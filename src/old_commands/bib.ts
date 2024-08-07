import type { BibliographyIO } from '@df/bibliography/io'
import { Logger } from '@df/bibliography/log'
import { BibLatexParser } from 'biblatex-csl-converter'
import https from 'https'

// 1. download bib
// 2. save bib
// 3. parse bib
// 4. save response


const BIB_FILE = 'https://raw.githubusercontent.com/dragonfly-science/bibliography/master/dragonfly.bib'
const BIB_OUTPUT = 'src/content/bibliography/bib.json'


export class BibFile {
  logger: Logger
  endpoint: string
  io: BibliographyIO
  output: string

  response?: string
  parsed?: ReturnType<BibLatexParser['parse']>

  constructor(io: BibliographyIO, logger: Logger, endpoint: string = BIB_FILE, output: string = BIB_OUTPUT) {
    this.logger = logger
    this.endpoint = endpoint
    this.io = io
    this.output = output
  }

  async download() {
    try {
      this.response = await new Promise<string>((resolve, reject) => {
        https.get(this.endpoint, (result) => {
          if (result.statusCode !== 200) {
            reject(new Error(`${this.endpoint} - ${result.statusMessage}`))
            return
          }

          let data = ''

          // A chunk of data has been received.
          result.on('data', (chunk) => {
            data += chunk
          })

          // The whole response has been received. Resolve the promise.
          result.on('end', () => {
            this.logger.success('bib file successfully downloaded')
            resolve(data)
          })

        }).on('error', (error) => {
          reject(error)
        })
      })
    } catch (e) {
      this.logger.error(`Error downloading bib file: ${(e as Error).message}`)
      process.exit(1)
    }

    return this
  }

  parse() {
    if (this.response) {
      const parser = new BibLatexParser(this.response, {
        processUnexpected: true, 
        processUnknown: true
      })
      this.parsed = parser.parse()
    } else {
      throw new Error('No response to parse. Call download() first.')
    }

    return this
  }

  // async save() {
  //   if (this.parsed) {
  //     await this.io.saveToDisk(this.parsed, this.output)
  //   } else {
  //     throw new Error('No parsed data to save. Call parse() first.')
  //   }

  //   return this
  // }
}
