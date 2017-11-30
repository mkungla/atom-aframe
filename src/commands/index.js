'use babel'

import {WorkspaceCommands} from './workspace-cmd'
import {HTMLCommands} from './html-cmd'
import {JSCommands} from './js-cmd'

/**
 * Atom A-Frame commands
 */
class Commands {
  constructor () {
    this.list = []
    this.add(new WorkspaceCommands())
    this.add(new HTMLCommands())
    this.add(new JSCommands())
  }

  /**
   * Add command to list
   *
   * @param {CommandSet} commands
   */
  add (commands) {
    for (const cmd of commands) {
      if (!cmd.isValid()) { continue }
      this.list.push(atom.commands.add(cmd.getTarget(), cmd.attachable()))
    }
  }
}

export default new Commands()
