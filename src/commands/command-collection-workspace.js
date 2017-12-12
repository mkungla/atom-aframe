'use babel'

import {shell} from 'electron'
import {CommandCollection, Command} from './command-collection'

/**
 * Workspace commands
 *
 * @extends CommandCollection
 */
export class CommandCollectionWorkspace extends CommandCollection {
  /**
   * Construct workspace commands
   */
  constructor () {
    super()
    this.commands.push(this.settings())
    this.commands.push(this.documentation())
  }

  /**
   * Settings command opens package settings view
   *
   * @return {Command} Settings command
   */
  settings () {
    return new Command('atom-aframe:settings', () => {
      atom.workspace.open('atom://config/packages/atom-aframe')
    })
  }

  /**
   * Documentation command opens A-Frame documentation
   *
   * @return {Command} Documentation command
   */
  documentation () {
    return new Command('atom-aframe:documentation', () => {
      let url = atom.config.get('atom-aframe.devel.aframeDocsBaseURL') || 'https://aframe.io/docs'
      shell.openExternal(`${url}/master/introduction/`)
    })
  }
}
