import { BaseCommand } from '../baseCommand.js'
import { Flags } from '@oclif/core'
import { BibLatexParser } from 'biblatex-csl-converter'

import { Worker } from 'worker_threads'

type ParsedBibTex = ReturnType<BibLatexParser['parse']>

export default class Parse extends BaseCommand<typeof Parse> {
  static override description = 'Parse the input as bibtex'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    input: Flags.string({
      char: 'i',
      description: 'file to read input from',
    }),
  }

  public static override enableJsonFlag = true

  public async run(): Promise<void> {
    const { flags } = await this.parse(Parse)

    let parsed = ''
    
    try {
      if (flags.input) {
        parsed = await this.io!.readFromDisk(flags.input)
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

  private async processStdIn(): Promise<string> {
    return new Promise((resolve, reject) => {
      let data = ''

      process.stdin.on('data', (chunk) => {
        data += chunk
      })

      process.stdin.on('end', () => {
        resolve(data)
      })

      process.stdin.on('error', (error) => {
        reject(error)
      })
    })
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
