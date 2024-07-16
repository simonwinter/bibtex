// import { get as https } from 'https'
import { dirname, resolve } from 'path'
import { writeFile, mkdir } from 'fs/promises'
// import type { Logger } from '@df-astro/bibliography/log'


export class BibliographyIO {

  // Path to online bib file
  // bibFile: string

  // logger: Logger

  constructor() {
    // this.bibFile = bibFile
    // this.logger = logger
  }

  // downloadBibFile(): Promise<string> {
  //   const self = this
  //   return new Promise((resolve, reject) => {
  //     https(self.bibFile, (result) => {
  //       let data = '';

  //       // A chunk of data has been received.
  //       result.on('data', (chunk) => {
  //         data += chunk
  //       })

  //       // The whole response has been received. Resolve the promise.
  //       result.on('end', () => {
  //         resolve(data)
  //       })
  //     }).on('error', (error) => {
  //       reject(error)
  //     })
  //   })
  // }

  async saveToDisk<T>(input: T, path: string) {
      const absolutePath = resolve(path)
      const dirPath = dirname(absolutePath)
      const jsonString = JSON.stringify(input)

      await mkdir(dirPath, { recursive: true })

      await writeFile(absolutePath, jsonString)
  }
}