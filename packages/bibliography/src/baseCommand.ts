import { Logger } from '@df-astro/bibliography/log'
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
      default: 'info'
    }),
    noColour: Flags.boolean({
      description: 'disable colour output',
      aliases: ['no-colour', 'no-color'],
      default: false
    }),
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

    this.logger = new Logger({
      logLevel: flags.json ? 'silent' : flags.verbosity,
      prefix: {
        label: `‣ ${this.id}: `,
      }, 
      nolColour: flags.noColour
    })

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
}