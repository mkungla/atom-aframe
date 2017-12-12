'use babel'

import {CommandCollectionWorkspace} from './command-collection-workspace'
import {CommandCollectionHTML} from './command-collection-html'
import {CommandCollectionJS} from './command-collection-js'

/**
 * Atom A-Frame commands
 */
export default class Commands {
  constructor () {
    this.list = []
    this.add(new CommandCollectionWorkspace())
    this.add(new CommandCollectionHTML())
    this.add(new CommandCollectionJS())
  }

  /**
   * Add command collection to commands
   *
   * @param {CommandCollection} const
   */
  add (cmdSet) {
    for (const cmd of cmdSet) {
      if (!cmd.isValid()) { continue }
      this.list.push(atom.commands.add(cmdSet.getTarget(), cmd.getAction()))
    }
  }

  /**
   * Get all commands
   *
   * @return {[Command]} array of Commands
   */
  all () {
    return this.list
  }
}
