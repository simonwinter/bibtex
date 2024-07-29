import { BibliographyIO } from '@df-astro/bibliography/io'
import { Command, Flags } from '@oclif/core'
import { BibLatexParser } from 'biblatex-csl-converter'
import https from 'https'
import { Logger } from '@df-astro/bibliography/log'

import { Worker } from 'worker_threads'

const BIB_FILE = 'https://raw.githubusercontent.com/dragonfly-science/bibliography/master/dragonfly.bib'

type ParsedBibTex = ReturnType<BibLatexParser['parse']>

export default class Download extends Command {
  static override description = 'Download the bibtex file necessary to build our bibliography'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    url: Flags.string({ 
      char: 'u', 
      required: false,
      description: 'Url of bibtex file to download.',
      default: BIB_FILE
    }),
    output: Flags.file({ 
      char: 'o',
      required: false,
      description: 'Output path to download the file to'
    }),
    verbosity: Flags.option({
      options: ['info', 'warn', 'error', 'silent'] as const
    })({
      char: 'v',
      description: 'set logging level',
      default: 'info'
    }),
    noColour: Flags.boolean({
      description: 'disable colour output',
      aliases: ['no-colour', 'no-color'],
      default: false
    })
  }

  public static override enableJsonFlag = true

  response?: string
  io?: BibliographyIO
  logger?: Logger

  public async run() {
    const start = performance.now()
    const { flags } = await this.parse(Download)
    
    this.logger = new Logger({
      logLevel: flags.json ? 'silent' : flags.verbosity,
      prefix: {
        label: `‣ ${this.id}: `,
      }, 
      nolColour: flags.noColour
    })

    const download = await this.download(flags.url)
    let parsed: ParsedBibTex | undefined = undefined

    try {
      const response = await this.parseBib(download)
      parsed = response

      if (flags.json) {
        return JSON.parse(JSON.stringify(response))
      }
  
    } catch(e) {
      this.logger.error((e as Error).message)
      process.exit(1)
    }


    if (flags.output) {
      this.io = new BibliographyIO()
      await this.save(parsed, flags.output)
    }

    const end = performance.now()
    this.logger.info(`Completed in ${(end - start)}ms`)
  }

  private async download(url: string) {
    try {
      const progress = this.logger?.progress({
        barCompleteString: 'bib file successfully downloaded'
      })

      return await new Promise<string>((resolve, reject) => {
    
        // Add headers to prevent caching
        const options = {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }

        https.get(url, options, (result) => {
          if (result.statusCode !== 200) {
            reject(new Error(`${url} - ${result.statusMessage}`))
            return
          }

          const totalSize = parseInt(result.headers['content-length'] ?? '0', 10);
          let downloadedSize = 0
          let data = ''

          progress?.start(totalSize, downloadedSize)

          // A chunk of data has been received.
          result.on('data', (chunk) => {
            downloadedSize += chunk.length
            progress?.update(downloadedSize)
            data += chunk
          })
          
          // The whole response has been received. Resolve the promise.
          result.on('end', () => {
            progress?.stop()
            resolve(data)
          })

        }).on('error', (error) => {
          progress?.stop()
          reject(error)
        })
      })
    } catch (e) {
      this.logger?.error(`Error downloading bib file ${(e as Error).message}`)
      process.exit(1)
    }
  }

  private async parseBib(response: string): Promise<ReturnType<BibLatexParser['parse']>> {
    this.logger?.processing('parsing bib file')

    return new Promise((resolve, reject) => {
      const worker = new Worker('./dist/parseBib.js', { workerData: response })

      worker.on('message', (data: { success: boolean; result: ReturnType<BibLatexParser['parse']> }) => {
        this.logger?.success('bib file successfully parsed')
        resolve(data.result)
      })
      worker.on('error', reject)
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`))
      })
    })
    // const parser = new BibLatexParser(response, {
    //   processUnexpected: true, 
    //   processUnknown: true,
    //   processComments: false,
    //   processInvalidURIs: false
    // })

    // try {
      
    //   // const parsed = await (async () => {
    //   //   return parser.parseAsync()
    //   // })()

      
    //   return parser.parseAsync().then((bib) => {
    //     this.logger?.success('bib file successfully parsed')
    //     return bib
    //   })
    // } catch (e) {
    //   this.logger?.error(`Error parsing Bib: ${(e as Error).message}`)
    //   process.exit(1)
    // }
  }


  private async save(parsed: ReturnType<BibLatexParser['parse']>, output: string) {
    try {
      this.logger?.processing('saving bib file')
      const size = await this.io?.saveToDisk(parsed, output)
      const fileSize = size ? `\t${(size / 1024 / 1024).toFixed(2)} MB` : ''
      this.logger?.success(`bib file successfully saved as ${output}${fileSize}`)
    } catch (e) {
      this.logger?.error((e as Error).message)
      process.exit(1)
    }
  }
}
