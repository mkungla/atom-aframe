'use babel'

export class Command {
  constructor (cmd, func) {
    this.cmd = cmd
    this.runc = func
  }

  /**
   * Can command be used
   *
   * @return {Boolean} true if command can be used by atom.commands.add
   */
  isValid () {
    return this.cmd !== null && this.func !== null
  }

  /**
   * Get Command to attach to atom
   *
   * @return {Object} command
   */
  attachable () {
    return {
      [this.cmd]: this.runc
    }
  }
}
/**
 * Apstract for commands
 */
export class CommandSet {
  constructor () {
    this.commands = []
  }
  /**
   * iterator for commands
   */
  * [Symbol.iterator] () {
    for (let c of this.commands) {
      yield c
    }
  }
}
