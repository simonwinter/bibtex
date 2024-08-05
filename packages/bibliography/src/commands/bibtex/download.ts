import { BibliographyIO } from '@df-astro/bibliography/io'
import { Flags } from '@oclif/core'
import { BibLatexParser } from 'biblatex-csl-converter'
import https from 'https'

import { BaseCommand, verbosityFlags } from '@df-astro/bibliography/baseCommand'

const BIB_FILE = 'https://raw.githubusercontent.com/dragonfly-science/bibliography/master/dragonfly.bib'

type ParsedBibTex = ReturnType<BibLatexParser['parse']>

export default class Download extends BaseCommand<typeof Download> {

  static override summary = 'Download the bibtex file necessary to build our bibliography'

  static override description = `
    Download the bibtex file necessary to build our bibliography.
    If the --json flag is supplied, the output is sent to stdout and no logging occurs.
    If --json and --output are supplied, the file is saved to output and loggign is enabled.`

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --json',
    '<%= config.bin %> <%= command.id %> -o <file-path> --json',
    '<%= config.bin %> <%= command.id %> -v warn',
  ]

  static override flags = {
    url: Flags.string({ 
      char: 'u', 
      required: false,
      description: 'Url of bibtex file to download.',
      aliases: ['output'],
      default: BIB_FILE
    }),
    verbosity: Flags.option({
      options: verbosityFlags
    })({
      char: 'v',
      description: 'set logging level',
      default: 'silent'
    }),
  }

  static override enableJsonFlag = false

  response?: string
  io?: BibliographyIO

  public async run() {
    const start = performance.now()
    const { flags } = await this.parse(Download)

    this.logger.setLogLevel(flags.verbosity)

    const download = await this.download(flags.url)

    process.stdout.write(download)

    // try {
    //   const response = await this.parseBib(download)
    //   parsed = response

    //   if (flags.json && !flags.output) {
    //     return JSON.parse(JSON.stringify(response))
    //   }
  
    // } catch(e) {
    //   this.logger.error((e as Error).message)
    //   process.exit(1)
    // }

    // if (flags.output) {
    //   this.io = new BibliographyIO()
    //   await this.save(parsed, flags.output)
    // }

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
