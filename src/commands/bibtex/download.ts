import { Flags } from '@oclif/core'
import https from 'https'

import { BaseCommand } from '@df-astro/bibliography/baseCommand'

const BIB_FILE = 'https://raw.githubusercontent.com/dragonfly-science/bibliography/master/dragonfly.bib'

export default class Download extends BaseCommand<typeof Download> {

  static override summary = 'Download the bibtex file necessary to build our bibliography'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -o <file-path>',
    '<%= config.bin %> <%= command.id %> -v warn',
  ]

  static override flags = {
    url: Flags.string({ 
      char: 'u', 
      required: false,
      description: 'Url of bibtex file to download.',
      aliases: ['output'],
      default: BIB_FILE
    })
  }

  static override enableJsonFlag = false

  public async run() {
    const start = performance.now()
    const { flags } = await this.parse(Download)

    this.logger.setLogLevel(flags.verbosity)

    const download = await this.download(flags.url)

    if (flags.stdout) {
      process.stdout.write(download)
      return
    }

    if (flags.output) {
      await this.save(download, flags.output)
      return
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
}
