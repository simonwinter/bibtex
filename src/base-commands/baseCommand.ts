import { resolve } from 'path'
import BibliographyIO from '../api/io/index.js'
import { Logger } from '../log.js'
import { Command, Flags, Interfaces } from '@oclif/core'
import { access } from 'fs/promises'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof BaseCommand['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export const verbosityFlags = ['info', 'warn', 'error', 'silent'] as const
export type Verbosity = typeof verbosityFlags[number]

const dotenv = await import('dotenv')

export abstract class BaseCommand<T extends typeof Command> extends Command {

  // define flags that can be inherited by any command that extends BaseCommand
  static override baseFlags = {
    verbosity: Flags.option({
      options: verbosityFlags
    })({
      char: 'v',
      description: 'set logging level',
      default: 'silent',
      helpGroup: 'GLOBAL'
    }),
    'no-color': Flags.boolean({
      description: 'disable colour output',
      default: false,
      helpGroup: 'GLOBAL'
    }),
    output: Flags.string({
      char: 'o',
      description: 'If saving file to disk, file path to save to',
      helpGroup: 'GLOBAL'
    }),
    'env-file': Flags.file({
      char: 'e',
      summary: 'Provide a file to read env vars from. By default looks for a local .env file',
      helpGroup: 'GLOBAL'
    })
  }

  protected flags!: Flags<T>
  protected args!: Args<T>

  protected logger!: Logger

  public override async init(): Promise<void> {
    await super.init()
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      args: this.ctor.args,
      strict: this.ctor.strict,
    })

    this.flags = flags as Flags<T>
    this.args = args as Args<T>

    this.logger = new Logger({
      logLevel: flags.json ? 'silent' : flags.verbosity,
      prefix: {
        label: `‣ ${this.id}: `,
      }
    })

    await this.detectEnvFile(this.flags)
  }

  protected async save(input: string, path: string) {
    try {
      this.logger?.processing('saving file')
      const size = await BibliographyIO.saveToDisk({ input, path })
      const fileSize = size ? `\t${(size / 1024 / 1024).toFixed(2)} MB` : ''
      this.logger?.success(`file successfully saved as ${path}${fileSize}`)
    } catch (e) {
      this.logger?.error((e as Error).message)
      process.exit(1)
    }
  }

  private async detectEnvFile(flags: Flags<T>) {
    const file = flags['env-file']
    const fileName = file ?? '.env'
    let absolutePath = ''
    
    try {
      absolutePath = resolve(fileName)
      await access(absolutePath)
    } catch(e) {
      if (e instanceof Error && 'code' in e) {
        switch (e.code) {
          case 'ENOENT':
            this.logger.warn(`The environment file (${fileName}) does not exist`)
            break
          case 'EACCESS':
            this.logger.warn(`The environment file (${fileName}) cannot be read`)
            break
          default:
            break
        }
      }

      return
    }

    dotenv.config({ path: absolutePath })
  }

  protected async processStdIn(): Promise<string> {
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
}