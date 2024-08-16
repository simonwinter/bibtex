import { dirname, resolve } from 'path'
import { mkdir } from 'fs/promises'
import { createReadStream, createWriteStream, statSync } from 'fs'

type SaveArgs = {
  input: string
  path: string
  chunkSize?: number
}



export class BibliographyIO {
  constructor() {
  }

  async readFromDisk(path: string) {
    const absolutePath = resolve(path)
    const stream = createReadStream(absolutePath)
    let output = ''

    for await (const chunk of stream) {
      output += chunk
    }

    return output
  }

  async saveToDisk({ input, path }: SaveArgs) {
      const absolutePath = resolve(path)
      const dirPath = dirname(absolutePath)

      await mkdir(dirPath, { recursive: true })
      await this.writeStringInChunks({ path: absolutePath, input })

      const { size } = statSync(absolutePath)
      return size
  }

  private async writeStringInChunks({ input, path, chunkSize = 1024 * 1024 }: SaveArgs) {
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(path)
      
      const writeChunk = (start: number) => {
        const end = Math.min(start + chunkSize, input.length)
        const chunk = input.slice(start, end)
        
        if (start < input.length) {
          writeStream.write(chunk, 'utf8', (error) => {
            if (error) {
              writeStream.end()
              reject(error)
            } else {
              writeChunk(end)
            }
          })
        } else {
          writeStream.end()
        }
      }

      writeChunk(0)

      writeStream.on('finish', () => {
        resolve(null)
      })

      writeStream.on('error', (err) => {
        reject(err)
      })
    })
  }
}