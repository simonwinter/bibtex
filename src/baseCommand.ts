import { BibliographyIO } from '@df/bibliography/io'
import { Logger } from '@df/bibliography/log'
import { Command, Flags, Interfaces } from '@oclif/core'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof BaseCommand['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export const verbosityFlags = ['info', 'warn', 'error', 'silent'] as const
export type Verbosity = typeof verbosityFlags[number]

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // add the --json flag
  static override enableJsonFlag = true

  // define flags that can be inherited by any command that extends BaseCommand
  static override baseFlags = {
    verbosity: Flags.option({
      options: verbosityFlags
    })({
      char: 'v',
      description: 'set logging level',
      default: 'silent'
    }),
    'no-color': Flags.boolean({
      description: 'disable colour output',
      default: false
    }),
    output: Flags.string({
      char: 'o',
      description: 'If saving file to disk, file path to save to',
      exactlyOne: ['stdout', 'output']
    }),
    stdout: Flags.boolean({
      description: 'Indicate if you want output to be redirected to stdout',
    })
  }

  protected flags!: Flags<T>
  protected args!: Args<T>

  protected logger!: Logger
  protected io?: BibliographyIO

  public override async init(): Promise<void> {
    await super.init()
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      args: this.ctor.args,
      strict: this.ctor.strict,
    })

    this.logger = new Logger({
      logLevel: flags.json ? 'silent' : flags.verbosity,
      prefix: {
        label: `‣ ${this.id}: `,
      }
    })

    this.io = new BibliographyIO()

    this.flags = flags as Flags<T>
    this.args = args as Args<T>
  }

  protected override async catch(err: Error & {exitCode?: number}): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  protected override async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  protected async save(input: string, path: string) {
    try {
      this.logger?.processing('saving file')
      const size = await this.io?.saveToDisk({ input, path })
      const fileSize = size ? `\t${(size / 1024 / 1024).toFixed(2)} MB` : ''
      this.logger?.success(`file successfully saved as ${path}${fileSize}`)
    } catch (e) {
      this.logger?.error((e as Error).message)
      process.exit(1)
    }
  }
}