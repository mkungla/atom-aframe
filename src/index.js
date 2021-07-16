'use babel'

import { Session } from './session'
import { WorkspaceCommands } from './commands'
import { Activator } from './activator'
import Validator from './validator'

export default {
  session: null,
  activator: null,
  commandsLoaded: null,

  /**
   * activate atom-aframe package
   *
   * @param  {Object} state from last package serialization
   */
  activate () {
    if (!Validator.validate()) {
      return
    }
    this.session = new Session(/* state */)
    this.commandsLoaded = false
    this.activator = new Activator(cmd => {
      const initCommnds = !this.commandsLoaded
      this.loadCommands()
      // run only command
      if (cmd && initCommnds) {
        atom.commands.dispatch(atom.views.getView(atom.workspace), cmd)
        return
      }
      this.load()
    })
    this.session.subscribe(this.activator)
  },

  /**
   * deactivate the package
   */
  deactivate () {
    if (this.activator) {
      this.activator.dispose()
      this.activator = null
    }

    this.session.destroy()
    this.session = null

    this.commandsLoaded = false
  },

  /**
   * Initialize statusbar
   *
   * @param  {statusBar} sb https://github.com/atom/status-bar
   */
  consumeStatusBar (sb) {
    this.session.statusBar.setStatusBar(sb)
    this.session.statusBar.attach()
  },

  /**
   * Actual activation of the package
   */
  load () {
    if (this.activator) {
      this.activator.dispose()
      this.activator = null
    }
    this.session.start()
  },

  /**
   * Set up workspace commands
   */
  loadCommands () {
    if (this.commandsLoaded) {
      return
    }
    this.session.subscribe(WorkspaceCommands.openDocumentation())
    this.session.subscribe(WorkspaceCommands.openWebsite())
    this.session.subscribe(WorkspaceCommands.openGithub())
    this.session.subscribe(WorkspaceCommands.openSettings())
    this.commandsLoaded = true
  },

  /**
   * Init and setup aframe autocomplete provider
   *
   * @return {AutocompleteProvider} autocomplete.provider
   */
  provideAutocomplete () {
    this.session.autocomplete.setDocVersion(this.session.aframe.getDocVersion())
    return this.session.autocomplete
  }
}
