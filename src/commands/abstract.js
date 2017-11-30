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
   * Get Command to ready to be added to command registry
   *
   * @return {Object} {commandName, listener}
   */
  getInstance () {
    return { [this.cmd]: this.runc }
  }

  /**
   * Get command target A String containing a CSS selector or a DOM element.
   * If you pass a selector, the command will be globally associated with
   * all matching elements. The , combinator is not currently supported.
   * If you pass a DOM element, the command will be associated
   * with just that element.
   *
   * @return {String} target
   */
  getTarget () {
    return this.t ? this.t : 'atom-workspace'
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
