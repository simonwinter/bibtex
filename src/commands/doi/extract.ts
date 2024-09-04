import bibTex, { type BibTexParser as Parser } from '../../schema/BibTexParser.js'
import InputCommand from '../../base-commands/inputCommand.js'
import { BibLatexParser } from 'biblatex-csl-converter'
import { BibliographyIO } from '../../api/index.js'
import { CrossRefDoiAPI } from '../../api/doi/crossref/index.js'
import { DOIHandler, TitleHandler } from '../../handlers.js'


export default class DoiExtract extends InputCommand<typeof DoiExtract> {

  static override description = 'Extract records from a parsed bibtex source (see the parse command) that contain DOI references'

  static override examples = [
    '<%= config.bin %> <%= command.id %> -i <file to extract from>',
  ]

  public async run(): Promise<void> {
    const { flags } = await this.parse(DoiExtract)

    if (flags.input) {
      const output: BibLatexParser['entries'] = await this.readInput(flags.input)
      const doiEntries = output.filter((i) => i.fields['doi'])

      // console.log('entries', )

      const DOI_API_HEADERS = {
        'User-Agent': 'DragonflyBot/1.0 (https://www.dragonfly.co.nz; mailto:simon@dragonfly.co.nz)'
      }

      const doiAPI = new CrossRefDoiAPI(this.logger, DOI_API_HEADERS)
      const { interval, limit } = await doiAPI.getRateLimit()
      console.log('limit', interval, limit)

      this.logger.info(`entries: ${doiEntries.length}`)

      const promises = doiEntries.map((entry) => {
        const { entry_key, bib_type, fields: entry_fields } = entry
        const fields: Record<string, unknown> = JSON.parse(JSON.stringify(entry_fields))

        let initial = {
          id: entry_key,
          bib_type: bib_type,
          fields
        }

        return async () => {
          const titleHander = new TitleHandler()
          const doiHandler = new DOIHandler(this.logger)

          let result = titleHander.handle(fields, initial)

          console.log(`${result.title} (${result.fields.doi})`)

          return await doiHandler.handle({
            fields,
            doiAPI
          }, result)
        }
      })

      // !NOTE - we are ignoring the returned limit, as it comes back as 50, but
      // !NOTE - appears to actually be 5
      const results = await doiAPI.throttlePromises(promises, interval, 5)

      console.log('results', results)

      if (flags.output) {
        // Do something
      } else {
        // BibliographyIO.streamArrayToStdOutAsJson(output, 'entries')
      }
    }
  }

  /**
   * Reads an input from a file (assumed to be a parsed BibTex json output). We
   * then validate the response to ensure we do have an actual bibtex response
   * and extract entries which contain a `doi` key.
   *
   * @private
   * @param {string} input
   * @return {Promise<EntryObject[]>} extracted doi records
   * @memberof DoiExtract
   */
  private async readInput(input: string) {
    const f = await BibliographyIO.readFromDisk(input)
    let schema: Parser | undefined
    let output: BibLatexParser['entries'] = []

    try {
      schema = bibTex.parse(JSON.parse(f))
    } catch (e) {
      const err = e as Error
      this.catch(err)
    }

    if (schema) {
      for (const key of Object.keys(schema.entries)) {
        const entry = schema.entries[key]

        if (entry.fields.doi) {
          output.push(entry)
        }
      }
    }
    return output
  }
}
