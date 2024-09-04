import { SingleBar } from 'cli-progress'
import https from 'https'

export const downloadFile = async (url: URL, progress: SingleBar | undefined) => {
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
}