'use babel'

import {WorkspaceCommands} from './workspace-cmd'
import {HTMLCommands} from './html-cmd'
import {JSCommands} from './js-cmd'

/**
 * Atom A-Frame commands
 */
class Commands {
  constructor () {
    this.workspace = new WorkspaceCommands()
    this.html = new HTMLCommands()
    this.js = new JSCommands()
  }
}

export default new Commands()
