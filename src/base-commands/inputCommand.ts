import { Command, Flags } from "@oclif/core"
import { BaseCommand } from "./baseCommand.js"

export default abstract class InputCommand<T extends typeof Command> extends BaseCommand<T> {
  static override baseFlags = { 
    ...BaseCommand.baseFlags,
    input: Flags.string({
      char: 'i',
      description: 'file to read input from',
    }),
  }
}