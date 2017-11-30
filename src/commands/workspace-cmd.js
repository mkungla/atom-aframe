'use babel'

import {shell} from 'electron'
import {CommandSet, Command} from './abstract'
import {AFRAME_DOCS_URI_BASE} from '../config'
/**
 * Global commands
 *
 * @extends CommandSet
 */
export class WorkspaceCommands extends CommandSet {
  /**
   * Construct global commands
   */
  constructor () {
    super()
    this.commands.push(this.settings())
    this.commands.push(this.documentation())
  }

  /**
   * Settings command
   *
   * @return {Object} Settings command
   */
  settings () {
    return new Command('atom-aframe:settings', () => {
      atom.workspace.open('atom://config/packages/atom-aframe')
    })
  }

  /**
   * Documentation command
   *
   * @return {Object} Documentation command
   */
  documentation () {
    return new Command('atom-aframe:documentation', () => {
      shell.openExternal(`${AFRAME_DOCS_URI_BASE}/master/introduction/`)
    })
  }
}
