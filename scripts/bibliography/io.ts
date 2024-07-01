import { get as https } from 'https'
import { dirname, resolve } from 'path'
import { mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'


export class BibliographyIO {

  // Path to online bib file
  bibFile: string

  constructor(bibFile: string) {
    this.bibFile = bibFile
  }

  downloadBibFile(): Promise<string> {
    const self = this
    return new Promise((resolve, reject) => {
      https(self.bibFile, (result) => {
        let data = '';

        // A chunk of data has been received.
        result.on('data', (chunk) => {
          data += chunk
        })

        // The whole response has been received. Resolve the promise.
        result.on('end', () => {
          resolve(data)
        })
      }).on('error', (error) => {
        reject(error)
      })
    })
  }

  async saveToDisk(input: Record<string, unknown>, path: string) {
    try {
      const absolutePath = resolve(path)
      const dirPath = dirname(absolutePath)
      const jsonString = JSON.stringify(input, null, 2)

      // Ensure the directory exists
      mkdirSync(dirPath, { recursive: true })

      const response = await writeFile(absolutePath, jsonString)
      console.log('File successfully written to', absolutePath)
    } catch (err) {
      console.error('Error writing file:', err)
    }
  }
}