import chalk, { type ForegroundColorName } from 'chalk'

import ora, { type Ora } from 'ora'
import log from 'loglevel'

export namespace Logger {
  export type Levels = Exclude<log.LogLevelNames, 'debug' | 'trace'> | 'silent'
  export type Prefix = {
    label: string
    color?: ForegroundColorName
  }
  export type Input = string
}

export class Logger {
  private ora: Ora
  
  constructor(logLevel: Logger.Levels, prefix: Logger.Prefix = { label: '', color: 'yellow' }) {
    log.setLevel(logLevel, true)

    const colourNames: ForegroundColorName[] = ['yellow', 'green', 'blue', 'magentaBright', 'cyanBright']

    this.ora = ora({
      prefixText: chalk[prefix.color ?? colourNames[Math.floor(Math.random() * colourNames.length)] ?? 'cyan'](prefix.label)
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
}