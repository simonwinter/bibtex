import bibTex, { type BibTexParser as Parser } from '../../schema/BibTexParser.js'
import InputCommand from '../../base-commands/inputCommand.js'
import { BibLatexParser } from 'biblatex-csl-converter'
import BibliographyIO from '../../api/io/index.js'


export default class DoiExtract extends InputCommand<typeof DoiExtract> {

  static override description = 'Extract records from a parsed bibtex source (see the parse command) that contain DOI references'

  static override examples = [
    '<%= config.bin %> <%= command.id %> -i <file to extract from>',
  ]

  public async run(): Promise<void> {
    const { flags } = await this.parse(DoiExtract)

    if (flags.input) {
      let output: BibLatexParser['entries'] = await this.readInput(flags.input)

      if (flags.output) {
        // Do something
      } else {
        BibliographyIO.streamArrayToStdOutAsJson(output, 'entries')
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
