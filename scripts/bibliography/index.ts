import { BibLatexParser } from 'biblatex-csl-converter'
import { BibliographyIO } from './io'
import { DoiAPI } from './doiAPI'
import { DOIHandler, TitleHandler, type Output } from './processor/handlers'
import { ArticleSchema } from './schema'

const BIB_FILE = 'https://raw.githubusercontent.com/dragonfly-science/bibliography/master/dragonfly.bib'
const DOI_API_HEADERS = {
  'User-Agent': 'DragonflyBot/1.0 (https://www.dragonfly.co.nz; mailto:simon@dragonfly.co.nz)'
}

const localIO = new BibliographyIO(BIB_FILE)
const doiAPI = new DoiAPI(DOI_API_HEADERS)

const readBibFile = async () => {
  try {
    const response = await localIO.downloadBibFile()
    return response
  } catch (error) {
    console.error(error)
    return
  }
}

const parseBibTex = async () => {
  const input = await readBibFile()

  if (input) {
    let parser = new BibLatexParser(input, {
      processUnexpected: true, 
      processUnknown: true
    })
    let bib = parser.parse()
    let count = 0
    const { interval, limit } = await doiAPI.getRateLimit()
    let start = new Date().getTime()

    for (const key of Object.keys(bib.entries)) {
      const { entry_key, bib_type, fields: entry_fields } = bib.entries[+key]

      

      const fields: Record<string, unknown> = JSON.parse(JSON.stringify(entry_fields))
      let output: Output = {
        id: entry_key,
        bib_type: bib_type,
        fields
      }

      const titleHander = new TitleHandler()
      const doiHandler = new DOIHandler()
      titleHander.setNext(doiHandler)

      const result = await titleHander.handle({
          start,
          count,
          interval,
          limit,
          fields,
          doiAPI
        }, output)

      // try {
      //   const parsed = ArticleSchema.parse({
      //     ...output,
      //     ...result
      //   })
      // } catch (e) {
      //   console.log('parsing error:', e)
      // }

      localIO.saveToDisk({
        ...output,
        ...result
      }, `src/content/bibliography/${entry_key}.json`)
    }

  } else {
    return
  }
}

(async () => {
  await parseBibTex()
})()