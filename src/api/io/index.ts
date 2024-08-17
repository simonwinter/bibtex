import { dirname, resolve } from 'path'
import { mkdir } from 'fs/promises'
import { createReadStream, createWriteStream, statSync } from 'fs'
import { Readable, Transform } from 'stream'

type SaveArgs = {
  input: string
  path: string
  chunkSize?: number
}



export default class BibliographyIO {

  static async readFromDisk(path: string) {
    const absolutePath = resolve(path)
    const stream = createReadStream(absolutePath)
    let output = ''

    for await (const chunk of stream) {
      output += chunk
    }

    return output
  }

  static async saveToDisk({ input, path }: SaveArgs) {
      const absolutePath = resolve(path)
      const dirPath = dirname(absolutePath)

      await mkdir(dirPath, { recursive: true })
      await this.writeStringInChunks({ path: absolutePath, input })

      const { size } = statSync(absolutePath)
      return size
  }

  static streamArrayToStdOutAsJson(input: unknown[], rootEl: string) {

    let firstObject = false
    // Create a Readable stream that emits each object individually
    const objectStream = new Readable({
      objectMode: true, // Enable object mode to stream objects
      read() {
        if (input.length > 0) {
          const obj = input.shift() // Emit objects one by one
          this.push(obj)
        } else {
          this.push(null) // Signal end of stream
        }
      }
    })

    // Create a Transform stream to build the JSON structure
    const jsonTransformStream = new Transform({
      writableObjectMode: true, // Accept objects as input
      readableObjectMode: false, // Output will be a string (JSON)
      transform(obj, encoding, callback) {
        // Append a comma if this is not the first object
        if (firstObject) {
          this.push(',', encoding)
        } else {
          this.push(`{"${rootEl}":[`, encoding)
          firstObject = true
        }
        // Convert the object to a JSON string and push it to the stream
        this.push(JSON.stringify(obj), encoding)
        callback()
      },
      final(callback) {
        // Close the JSON array and object
        this.push(']}')
        callback()
      }
    })

    // Pipe the object stream through the JSON transform stream and then to stdout
    objectStream.pipe(jsonTransformStream).pipe(process.stdout)
  }

  protected static async writeStringInChunks({ input, path, chunkSize = 1024 * 1024 }: SaveArgs) {
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