import { CrossRefDoiAPI } from "./api/doi/crossref/index.js"
import type { Logger } from "./log.js"

export type Output = {
  id: string
  bib_type: string
  title?: string
  meta?: Record<string, unknown>
  fields: Record<string, unknown>
}

type Context = {
  start: number
  limit: number
  interval: number
  count: number
  doiAPI: CrossRefDoiAPI
} & Pick<Output, 'fields'>

type Marks = NonNullable<Pick<CrossRefDoiAPI.TitleRecord, 'marks'>['marks']>

interface JsonHandler {
  handle(context: Context, result: Readonly<Output>, mutated?: Output): Promise<Output> | Output
}

export class TitleHandler implements JsonHandler {
  handle(context: Pick<Context, 'fields'>['fields'], result: Readonly<Output>, mutated?: Output) {
    const copiedOutput = mutated ?? { ...result }

    if ('title' in context) {
      copiedOutput.title = (context.title as CrossRefDoiAPI.TitleRecord[]).map(({ text, marks }) => this.processMarks(text, marks)).join()
    }
    
    return copiedOutput
  }

  processMarks(text: string, marks?: Marks): string {
    if (!marks) {
      return text
    }

    return marks.reduce((acc, current) => {
      const { link, type } = current

      switch (type) {
        case 'bold':
          return `<strong>${acc}</strong>`
        case 'code':
          return `<code>${acc}</code>`
        case 'italic':
          return `<em>${acc}</em>`
        case 'link':
          return link ? `<a href="${link}" target="_blank">${acc}</a>` : acc
        case 'subscript':
          return `<sub>${acc}</sub>`
        case 'superscript':
          return `<sup>${acc}</sup>`
        case 'underline':
          return `<u>${acc}</u>`
        default:
          return acc
      }
      return acc
    }, text)
  }
}

export class DOIHandler implements JsonHandler {
  logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  async handle(context: Pick<Context, 'fields' | 'doiAPI'>, result: Readonly<Output>, mutated?: Output) {
    const copiedOutput = mutated ?? { ...result }
    const self = this

    if ('doi' in context.fields) {
      const doi = (context.fields['doi'] as string).replace(/https?\:\/\/(\w+\.)?doi\.org\//, '')

      try {
        const result = await context.doiAPI.fetchData(doi)
        
        // .then((metaData) => {
          const response: Record<string, unknown> = JSON.parse(result)
          copiedOutput['meta'] = response
          return copiedOutput
        // }).catch((err) => {
        //   self.logger.error(`DOI error (${context.fields['doi']}): ${err.message}`)
        //   return copiedOutput
        // })
      } catch (e) {
        this.logger.error(`(${doi}) ` + (e as Error).message)
      }

      // return context.doiAPI.fetchData(doi).then((metaData) => {
      //   const response: Record<string, unknown> = JSON.parse(metaData)
      //   copiedOutput['meta'] = response
      //   return copiedOutput
      // }).catch((err) => {
      //   self.logger.error(`DOI error (${context.fields['doi']}): ${err.message}`)
      //   return copiedOutput
      // })
    }

    return copiedOutput
  }
}