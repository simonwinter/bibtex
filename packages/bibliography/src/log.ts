import logSymbols from 'log-symbols'
import chalk, { type ForegroundColorName } from 'chalk'

// const logSymbols = require('log-symbols')
// const chalk = require('chalk')
import log from 'loglevel'

export namespace Logger {
  export type Levels = Exclude<log.LogLevelNames, 'debug' | 'trace'> | 'silent'
  export type Prefix = {
    label: string
    color: ForegroundColorName
  }
  export type Input = unknown
}

export class Logger {

  private prefix: Logger.Prefix
  
  constructor(logLevel: Logger.Levels, prefix: Logger.Prefix = { label: '', color: 'yellow' }) {
    log.setLevel(logLevel, true)
    this.prefix = prefix
  }

  info(...input: Logger.Input[]) {
    log.info(...input)
  }

  success(...input: Logger.Input[]) {
    log.info(chalk[this.prefix.color](this.prefix.label), logSymbols.success, chalk.green(input))
  }

  warn(...input: Logger.Input[]) {
    log.warn(logSymbols.warning, chalk.yellow(input))
  }

  error(...input: Logger.Input[]) {
    log.error(logSymbols.error, chalk.red(input))
  }

  log(...input: Logger.Input[]) {
    return [this.prefix, ...input]
  }
}