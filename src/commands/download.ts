import { Flags } from '@oclif/core'
import https from 'https'

import { BaseCommand } from '../baseCommand.js'

export default class Download extends BaseCommand<typeof Download> {

  static override summary = 'Download the bibtex file necessary to build our bibliography'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -o <file-path>',
    '<%= config.bin %> <%= command.id %> -v warn',
  ]

  static override flags = {
    url: Flags.url({ 
      char: 'u', 
      description: 'Url of bibtex file to download. Defaults to the BIBLIOGRAPHY_FILE_URL env var',
      env: 'BIBLIOGRAPHY_FILE_URL'
    })
  }

  static override enableJsonFlag = false

  public async run() {
    const start = performance.now()
    const { flags } = await this.parse(Download)

    const download = await this.download(flags.url)

    if (flags.output) {
      await this.save(download, flags.output)
    } else {
      process.stdout.write(download)
    }

    const end = performance.now()
    this.logger.info(`Completed in ${(end - start)}ms`)
  }

  private async download(url?: URL) {
    try {
      if (!url) {
        throw new Error('missing url flag or BIBLIOGRAPHY_FILE_URL env var')
      }

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

          const totalSize = parseInt(result.headers['content-length'] ?? '0', 10)
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
