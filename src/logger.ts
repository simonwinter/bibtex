import { format } from 'node:util'
import { Interfaces } from '@oclif/core'
import { Logger } from './log'

export const customLogger = (options: Logger.Options): Interfaces.Logger => {
  const myLogger = new Logger(options)
  return {
    child: (ns: string, delimiter?: string) => customLogger(options),
    debug: (formatter: unknown, ...args: unknown[]) => myLogger.debug(format(formatter, ...args)),
    error: (formatter: unknown, ...args: unknown[]) => myLogger.error(format(formatter, ...args)),
    info: (formatter: unknown, ...args: unknown[]) => myLogger.info(format(formatter, ...args)),
    trace: (formatter: unknown, ...args: unknown[]) => myLogger.trace(format(formatter, ...args)),
    warn: (formatter: unknown, ...args: unknown[]) => myLogger.warn(format(formatter, ...args)),
    namespace: options.prefix.label,
  }
}

