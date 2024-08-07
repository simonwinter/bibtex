import type { OutgoingHttpHeaders } from "http"
import * as https from 'https'
import { Utils } from "@df/bibliography/utils"
import { type Output } from '@df/bibliography/handlers'
import type { Logger } from "@df/bibliography/log"

export namespace DoiAPI {
  export type RateLimitHeaders = {
    'x-rate-limit-limit': string,
    'x-rate-limit-interval': string
  }

  export type TitleRecord = {
    type: string
    text: string
    marks?: {
      type:
        | 'nocase'
        | 'link'
        | 'code'
        | 'bold'
        | 'underline'
        | 'italic'
        | 'superscript'
        | 'subscript'
      link?: string
    }[]
  }

  export type PromiseList<T = Output> = (() => Promise<T>)[]
}

export class DoiAPI {
  headers: OutgoingHttpHeaders | undefined
  logger: Logger

  constructor(logger: Logger, headers?: OutgoingHttpHeaders | undefined) {
    this.headers = headers
    this.logger = logger
  }

  async fetchMetadataFromDOI(doi: string): Promise<string> {
    const self = this
    return new Promise((resolve, reject) => {
      self.logger.info(`fetching ${doi}`)
      const start = new Date().getTime()
      https.get(`https://api.crossref.org/works/${doi}`, { headers: self.headers }, (result) => {
        let data = ''

        if (result.statusCode !== 200) {
          // console.log('status', result.headers, result.statusCode, result.statusMessage)
          reject(new Error(result.statusMessage))
          return
        }

        // A chunk of data has been received.
        result.on('data', (chunk) => {
          data += chunk
        })

        // The whole response has been received. Resolve the promise.
        result.on('end', () => {
          const now = new Date().getTime()
          self.logger.success(`fetched ${doi}. time: ${now - start}`)
          resolve(data)
        })
      }).on('error', (error) => {
        // console.log('error', error.message)
        reject({
          ...error,
          message: `${error.message}: at url https://api.crossref.org/works/${doi}`
        })
      })
    })
  }

  async retrieveRateLimit(): Promise<string> {
    const self = this
    return new Promise((resolve, reject) => {
      https.get(`https://api.crossref.org/works/`, { headers: self.headers }, (result) => {

        if (result.statusCode !== 200) {
          // console.log('error getting limit', result.statusCode, result.headers)
          reject(new Error(`Request failed with status code ${result.statusCode}`))
          return
        }

        const headers = {
          'x-rate-limit-limit': result.headers['x-rate-limit-limit'] as string,
          'x-rate-limit-interval': result.headers['x-rate-limit-interval'] as string
        }

        resolve(JSON.stringify(headers))
      }).on('error', (error) => {
        reject(error)
      })
    })
  }

  async getRateLimit() {
    const rateLimit = JSON.parse(await this.retrieveRateLimit()) as DoiAPI.RateLimitHeaders
    let apiCount = 0
    const interval = Utils.convertToMs(rateLimit['x-rate-limit-interval'])
    const limit = +rateLimit['x-rate-limit-limit']

    // console.log(rateLimit, limit, interval)

    return {
      interval,
      limit
    }
  }

  async throttlePromises<T = Output>(promises: DoiAPI.PromiseList<T>, interval: number, limit: number) {
    let results: T[] = []

    for (let i = 0; i < promises.length; i += limit) {
      const batch = promises.slice(i, i + limit)

      // settle
      const out = await Promise.all(batch.map((p) => p()))
      
      // throttle
      if (i + limit < promises.length) {
        this.logger.info('WAITING')
        await Utils.promiseDelay(interval)
        this.logger.info('THROTTLED')
      }
      
      results = [ ...results, ...out]
    }

    return results
  }
}