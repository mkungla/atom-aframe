'use babel'

/**
 * Command instance
 *
 * @type {[type]}
 */
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
   * Get Command action to be added to the command registry
   *
   * @return {Object} {commandName, listener}
   */
  getAction () {
    return { [this.cmd]: this.runc }
  }
}

/**
 * Command Collection
 */
export class CommandCollection {
  constructor () {
    this.commands = []
  }

  /**
   * Get command target A String containing a CSS selector or a DOM element.
   * If you pass a selector, the command will be globally associated with
   * all matching elements. The , combinator is not currently supported.
   * If you pass a DOM element the command will be associated with just that element.
   *
   * @param {string} t target
   */
  setTarget (t) {
    this.target = t
  }

  /**
   * getTarget
   *
   * @return {String} targetstring
   */
  getTarget () {
    return this.target ? this.target : 'atom-workspace'
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
