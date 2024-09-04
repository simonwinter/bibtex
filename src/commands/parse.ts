import { BibLatexParser } from 'biblatex-csl-converter'

import { Worker } from 'worker_threads'
import InputCommand from '../base-commands/inputCommand.js'
import {BibliographyIO} from '../api/index.js'

type ParsedBibTex = ReturnType<BibLatexParser['parse']>

export default class Parse extends InputCommand<typeof Parse> {
  static override description = 'Parse the input as bibtex'

  static override summary = 'Accepts input as either a file or from stdin, parses and attempts to output to JSON'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public static override enableJsonFlag = true

  public async run(): Promise<void> {
    const { flags } = await this.parse(Parse)

    let parsed = ''
    
    try {
      if (flags.input) {
        parsed = await BibliographyIO.readFromDisk(flags.input)
      } else {
        parsed = await this.processStdIn()
      }

      const output = await this.parseBib(parsed)
      const jsonOut = JSON.stringify(output)

      if (flags.output) {
        await this.save(jsonOut, flags.output)
      } else {
        process.stdout.write(jsonOut)
      }
    } catch(e) {
      this.logger.error((e as Error).message)
      process.exit(1)
    }
  }

  private async parseBib(response: string): Promise<ParsedBibTex> {
    this.logger?.processing('parsing bib file')

    return new Promise((resolve, reject) => {
      const worker = new Worker('./dist/api/workers/parseBib.js', { workerData: response })

      worker.on('message', (data: { success: boolean; result: ParsedBibTex }) => {
        this.logger?.success('bib file successfully parsed')
        resolve(data.result)
      })
      worker.on('error', reject)
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`))
      })
    })
  }
}
