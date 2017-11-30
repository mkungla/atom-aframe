'use babel'

import {CompositeDisposable} from 'atom'
import semver from 'semver'
import * as cnf from './config'
import commands from './commands'
import PkgState from './pkg-state'

export default {
  // is package valid and can be loaded
  valid: false,
  // CompositeDisposable
  subscriptions: null,
  // Statusbar
  statusbar: null,
  // PackageState
  pkgState: null,

  /**
   * Called before atom-aframe package is activated
   *
   * @param  {[Object]} state data from the last time the window was serialized
   */
  initialize (state) {
    this.pkgState = new PkgState(state)
    this.subscriptions = new CompositeDisposable()
    this.verifyConfig()
    this.verifyAtom()
    this.setupCommands()
  },

  /**
   * Called when atom-aframe package is activated
   *
   * @param  {Object} state data from the last time the window was serialized
   */
  activate () {
    if (!this.valid) { return }
  },

  /**
   * Called when the window is shutting down so we can restore atom-aframe
   * to where the user left off.
   *
   * @return {String} JSON to represent the state of atom-aframe
   */
  serialize () {
    return JSON.stringify(this.pkgState)
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
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
    this.statusbar = null
  },

  /**
   * Reqister all commands
   */
  setupCommands () {
    for (const cmd of commands.list) {
      this.subscriptions.add(cmd)
    }
  },

  /**
   * Verify Configuration
   */
  verifyConfig () {
    // If AFRAME_DEPREACTED_CONFIG is set then handle these entries
    if (cnf.AFRAME_DEPREACTED_CONFIG.length > 0) {
      for (let c of cnf.AFRAME_DEPREACTED_CONFIG) {
        atom.config.unset(`atom-aframe.${c}`)
      }
    }
  },

  /**
   * Can package be activated for that Atom version
   */
  verifyAtom () {
    const validVersion = semver.gte(atom.appVersion, cnf.AFRAME_ATOM_MINVER)
    if (!validVersion && atom.config.get('atom-aframe.global.notifOnActivationFailure')) {
      const notification = atom.notifications.addWarning('**Package atom-aframe will not load**', {
        dismissable: true,
        icon: 'flame',
        description: 'Package **atom-aframe** requires Atom `v' + cnf.AFRAME_ATOM_MINVER + '` but you are running `v' + atom.appVersion + '`.'
      })
      if (this.subscriptions) {
        this.subscriptions.add({dispose: () => {
          notification.dismiss()
        }})
      }
    }
    this.valid = validVersion
  },

  /**
   * Load autocomplete provider
   */
  provideAutocomplete () {
    console.info('main.provideAutocomplete')
    console.warn('should provide autocomplete')
  },

  /**
   * Attac statusbar service
   */
  consumeStatusBar (sb) {
    console.info('main.consumeStatusBar')
    this.statusbar = sb
  }
}
