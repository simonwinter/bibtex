import chalk, { type ForegroundColorName } from 'chalk'
import cliProgress from 'cli-progress'
import log from 'loglevel'
import logSymbols from 'log-symbols'
import ora, { type Ora, spinners } from 'ora'

export namespace Logger {
  export type Levels = Exclude<log.LogLevelNames, 'debug' | 'trace'> | 'silent'
  export type Prefix = {
    label: string
    color?: ForegroundColorName
  }
  export type Input = string
  export type ProgressOptions = cliProgress.Options & {
    prefix?: string
  }
}

export class Logger {
  private ora: Ora
  private prefix: Required<Logger.Prefix> & { chalkOutput?: string }
  
  constructor(logLevel: Logger.Levels, prefix: Logger.Prefix = { label: '', color: 'yellow' }) {
    log.setLevel(logLevel, true)

    const colourNames: ForegroundColorName[] = ['yellow', 'green', 'blue', 'magentaBright', 'cyanBright']
    const randomColour = colourNames[Math.floor(Math.random() * colourNames.length)] as ForegroundColorName

    this.prefix = {
      ...prefix,
      color: randomColour,
      chalkOutput: chalk[prefix.color ?? randomColour](prefix.label)
    }

    this.ora = ora({
      prefixText: this.prefix.chalkOutput
    })
  }

  info(input: Logger.Input) {
    if (log.getLevel() > log.levels.INFO) {
      return
    }

    log.info(input)
  }

  success(input: Logger.Input) {
    if (log.getLevel() > log.levels.INFO) {
      return
    }

    this.ora.succeed(input).stop()
  }

  warn(input: Logger.Input) {
    if (log.getLevel() > log.levels.WARN) {
      return
    }

    this.ora.warn(chalk.yellow(input)).stop()
  }

  error(input: Logger.Input) {
    if (log.getLevel() > log.levels.ERROR) {
      return
    }

    this.ora.fail(chalk.red(input)).stop()
  }

  processing(input: Logger.Input) {
    if (log.getLevel() > log.levels.INFO) {
      return
    }

    this.ora.start(input)
  }
  
  done() {
    this.ora.stop()
  }

  clear() {
    this.ora.clear()
  }

  progress(args: Logger.ProgressOptions) {
    const { prefix, barCompleteString, ...params } = args
    // success: string, prefix?: string
    if (log.getLevel() > log.levels.INFO) {
      return
    }

    return new cliProgress.SingleBar({
      ...params,
      format: (options, params, payload) => {
        const barValue = options.barCompleteString?.substring(0, Math.round(params.progress*(options.barsize ?? 1)))
        const barPrefix = chalk[this.prefix.color](prefix ?? this.prefix.label)
        const percentage = Math.ceil(params.progress*100)
        const bar = chalk[percentage < 100 ? 'cyan' : 'green'](barValue)
        const barSeparator = percentage < 100 ? '  ' : logSymbols.success
        const eta = percentage < 100 ? `ETA ${params.eta}` : barCompleteString

        return `${barPrefix} ${barSeparator} ${bar} | ${percentage}% | ${eta}`
      },
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      barsize: 25,
      hideCursor: true,
      clearOnComplete: false,
      stopOnComplete: false,
      gracefulExit: true
    }, cliProgress.Presets.shades_classic)
  }
}