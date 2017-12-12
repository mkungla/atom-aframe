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
    this.commands.push(this.openSettings())
    this.commands.push(this.webDocumentation())
    this.commands.push(this.webAframeSite())
  }

  /**
   * Settings command opens package settings view
   *
   * @return {Command} Settings command
   */
  openSettings () {
    return new Command('atom-aframe:open-settings', () => {
      atom.workspace.open('atom://config/packages/atom-aframe')
    })
  }

  /**
   * Documentation command opens A-Frame documentation
   *
   * @return {Command} Documentation command
   */
  webDocumentation () {
    return new Command('atom-aframe:web-documentation', () => {
      let url = atom.config.get('atom-aframe.devel.aframeDocsBaseURL') || 'https://aframe.io/docs'
      shell.openExternal(`${url}/master/introduction/`)
    })
  }

  /**
   * Website command opens A-Frame website
   *
   * @return {Command} Documentation command
   */
  webAframeSite () {
    return new Command('atom-aframe:web-aframe-site', () => {
      let url = atom.config.get('atom-aframe.devel.aframeWebsite') || 'https://aframe.io'
      shell.openExternal(`${url}`)
    })
  }
}
