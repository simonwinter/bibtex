import { BibLatexParser } from "biblatex-csl-converter"
import * as https from 'https'

import { BibliographyIO } from "../api/index.js"
import bibTex, { type BibTexParser as Parser } from '../schema/BibTexParser.js'
import { Utils } from "../utils.js"

const readInput = async (input: string) => {
    const f = await BibliographyIO.readFromDisk(input)
    let schema: Parser | undefined
    let output: BibLatexParser['entries'] = []

    try {
      schema = bibTex.parse(JSON.parse(f))
    } catch (e) {
      const err = e as Error
      console.log(err.message)
    }

    if (schema) {
      for (const key of Object.keys(schema.entries)) {
        const entry = schema.entries[key]

        if (entry.fields.doi) {
          output.push(entry)
        }
      }
    }
    return output
  }

const output: BibLatexParser['entries'] = await readInput('test-data/test-econ.json')
const doiEntries = output.filter((i) => i.fields['doi'])

console.log(doiEntries.map((i) => [i.entry_key, i.fields['doi']]))

const processEntry = async (doi: string): Promise<string> => {
  const start = new Date().getTime()
  
  return new Promise((resolve, reject) => {
    https.get(`https://api.crossref.org/works/${doi}`, { headers: {
        'User-Agent': 'DragonflyBot/1.0 (https://www.dragonfly.co.nz; mailto:simon@dragonfly.co.nz)'
      } }, (result) => {
        let data = ''

        if (result.statusCode !== 200) {
          // console.log('status', result.headers, result.statusCode, result.statusMessage)
          reject(new Error(result.statusMessage))
          console.error('error', doi, result.statusCode, result.statusMessage)
          return
        }

        // A chunk of data has been received.
        result.on('data', (chunk) => {
          data += chunk
        })

        // The whole response has been received. Resolve the promise.
        result.on('end', () => {
          const now = new Date().getTime()
          console.log(`fetched ${doi}. time: ${now - start}`)
          resolve(data)
        })
      }).on('error', (error) => {
        // console.log('error', error.message)
        console.error(`${error.message}: at url https://api.crossref.org/works/${doi}`)
        reject(new Error(`${error.message}: at url https://api.crossref.org/works/${doi}`))
      })
  })
}

const promises = doiEntries.map((entry) => {
  return () => processEntry(`${entry.fields['doi']}`)
})

// const fetchUrlsConcurrently = async (urls) => {
//   try {
//     // Create an array of promises for each URL
//     const fetchPromises = urls.map(url => fetchUrl(url))
    
//     // Use Promise.all to run all promises concurrently
//     const results = await Promise.all(fetchPromises)

//     console.log(results)
//   } catch (error) {
//     console.error('An error occurred:', error)
//   }
// }

;(async () => {
  try {

    const limit = 5
    const interval = 1000

    let results: string[] = []

    for (let i = 0; i < promises.length; i += limit) {
      const batch = promises.slice(i, i + limit)

      // settle
      const out = await Promise.all(batch.map(async (p) => await p()))
      
      // throttle
      if (i + limit < promises.length) {
        console.log('')
        // this.logger.info('WAITING')
        await Utils.promiseDelay(interval)
        // this.logger.info('THROTTLED')
      }
      
      results = [ ...results, ...out]
    }
    // const results = await Promise.allSettled(promises.map(async (p) => await p()))
    console.log(results)
  } catch(e) {
    console.log('ERR', e)
  }
})()