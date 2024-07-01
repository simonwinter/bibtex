import type { OutgoingHttpHeaders } from "http"
import { get as https } from 'https'
import { Utils } from "./utils"

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
}

export class DoiAPI {
  headers: OutgoingHttpHeaders | undefined

  constructor(headers?: OutgoingHttpHeaders | undefined) {
    this.headers = headers
  }

  async fetchMetadataFromDOI(doi:string): Promise<string> {
    const self = this
    return new Promise((resolve, reject) => {
      https(`https://api.crossref.org/works/${doi}`, { headers: self.headers }, (result) => {
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
      https(`https://api.crossref.org/works/`, { headers: self.headers }, (result) => {

        if (result.statusCode !== 200) {
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

    return {
      interval,
      limit
    }
  }
}