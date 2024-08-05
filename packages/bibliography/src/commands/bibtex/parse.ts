import { BaseCommand, verbosityFlags } from '@df-astro/bibliography/baseCommand'
import {Args, Flags} from '@oclif/core'
import { BibLatexParser } from 'biblatex-csl-converter'

import { Worker } from 'worker_threads'
import * as readline from 'readline'

type ParsedBibTex = ReturnType<BibLatexParser['parse']>

export default class Parse extends BaseCommand<typeof Parse> {
  static override args = {
    bibtex: Args.string({ description: 'Bibtex string to read and parse' }),
  }

  static override description = 'Parse the input as bibtex'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    verbosity: Flags.option({
      options: verbosityFlags
    })({
      char: 'v',
      description: 'set logging level',
      default: 'silent'
    }),
    stdin: Flags.boolean({
      description: 'read input from stdin',
      default: true
    }),
  }

  public static override enableJsonFlag = true

  public async run(): Promise<void> {
    const { args, argv, flags } = await this.parse(Parse)

    this.logger.setLogLevel(flags.verbosity)

    let rl: readline.Interface | undefined = undefined

    if (flags.stdin || !process.stdin.isTTY) {
      // Read from stdin
      rl = readline.createInterface({
        input: process.stdin,
        terminal: false,
      })
    }

    if (rl) {
      try {
        let parsed = ''
        for await (const line of rl) {
          parsed += line
        }

        const output = await this.parseBib(parsed)

        if (flags.json) {
          return JSON.parse(JSON.stringify(output))
        }
      } catch(e) {
        this.logger.error((e as Error).message)
        process.exit(1)
      }
    }

  }

  private async parseBib(response: string): Promise<ParsedBibTex> {
    this.logger?.processing('parsing bib file')

    return new Promise((resolve, reject) => {
      const worker = new Worker('./dist/parseBib.js', { workerData: response })

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
