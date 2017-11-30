'use babel'

import {CompositeDisposable} from 'atom'
import * as globalCnf from './config'
import commands from './commands'

export default {
  subscriptions: null,

  /**
   * Called before atom-aframe package is activated
   *
   * @param  {[Object]} state data from the last time the window was serialized
   */
  initialize (state) {
    this.verifyConfig()
    this.subscriptions = new CompositeDisposable()
    this.setupCommands()
  },

  /**
   * Called when atom-aframe package is activated
   *
   * @param  {Object} state data from the last time the window was serialized
   */
  activate (state) {},

  /**
   * Called when the window is shutting down so we can restore atom-aframe
   * to where the user left off.
   *
   * @return {String} JSON to represent the state of atom-aframe
   */
  serialize () {
    return '{"serialized":  true }'
  },

  /**
   * Called when the window is shutting down so release external resources
   * like watching project packag.json for A-Frame version
   */
  deactivate () {
    this.dispose()
  },

  /**
   * Dispose whole package and it's subscriptions
   *
   * @return {[type]} [description]
   */
  dispose () {
    // Dispose all subscriptions
    this.subscriptions.dispose()
  },

  /**
   * Verify Configuration
   */
  verifyConfig () {
    // If AFRAME_DEPREACTED_CONFIG is set then handle these entries
    if (globalCnf.AFRAME_DEPREACTED_CONFIG.length > 0) {
      for (let c of globalCnf.AFRAME_DEPREACTED_CONFIG) {
        atom.config.unset(`atom-aframe.${c}`)
      }
    }
  },

  /**
   * Reqister all commands
   */
  setupCommands () {
    for (const cmd of commands.list) {
      this.subscriptions.add(cmd)
    }
  }
}
