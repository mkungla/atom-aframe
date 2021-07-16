'use babel'

import { CompositeDisposable } from 'atom'
import { workspaceCommandNames } from './commands'
import { PJW } from './pjw'

// Extra grammars which should actiate atom-aframe
const extraGrammars = ['text.html.basic']

class Activator {
  /**
   * Activator controls when package will be activated.
   * package should avoid using any resources while user is not
   * working on A-Frame project
   *
   * @param  {function} activate callback to activate atom-aframe package
   */
  constructor (activate) {
    this.subscriptions = new CompositeDisposable()
    this.activateFn = activate
    // commandUsed
    this.runCommand = null
    this.validGrammar = false
    this.isActivated = false
    this.dependsOnAframe = false
    this.loaded =
      atom.packages &&
      atom.packages.triggeredActivationHooks &&
      atom.packages.triggeredActivationHooks.has(
        'core:loaded-shell-environment'
      )
    // Chack package json before setting up subscriptions
    this.checkPJSON().then(() => {
      if (!this.dependsOnAframe) {
        this.subscribeToCommands()
        this.subscribeToEvents()
      }
      this.check()
    })
  }

  /**
   * dispose activator subscriptions
   */
  dispose () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
    this.subscriptions = null
    this.activateFn = null
    this.runCommand = null
    this.validGrammar = false
    this.loaded = false
    this.isActivated = false
  }

  /**
   * Perform initial check on package.json and aframe dependency
   */
  async checkPJSON () {
    if (atom.config.get('atom-aframe.project.checkPackageJson')) {
      const pjw = new PJW()
      try {
        await pjw.check()
        this.dependsOnAframe = pjw.hasDependency()
      } catch (e) {
        // should listen package.json onCreate
        this.dependsOnAframe = false
      }
    }
  }

  /**
   * Subscribe to workspace commands
   */
  subscribeToCommands () {
    for (const command of workspaceCommandNames) {
      this.subscriptions.add(
        atom.commands.add('atom-workspace', command, () => {
          // this will not activate package fully because of command prop
          this.activateFn(command)
        })
      )
    }
  }

  /**
   * Subscribe to events which should trigger package activation
   */
  subscribeToEvents () {
    // Do not activate package if opened file is not js, html or one of extraGrammars
    // so observe until package is activated
    this.subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        if (!editor || !editor.getGrammar()) {
          return false
        }
        const grammar = editor.getGrammar()
        if (grammar && grammar.scopeName) {
          this.checkGrammar(grammar.scopeName)
        }
      })
    )
  }

  /**
   * Check should grammar trigger package activation
   *
   * @param  {[type]} scopeName [description]
   * @return {[type]}           [description]
   */
  checkGrammar (scopeName) {
    if (
      extraGrammars.indexOf(scopeName) !== -1 ||
      (scopeName.startsWith('source.js') &&
        !scopeName.startsWith('source.json'))
    ) {
      this.validGrammar = true
      this.check()
    }
  }

  /**
   * Check if package should be activated or call one of it's workspace cmmands
   */
  check () {
    if (this.isActivated) {
      return
    }
    if (this.loaded && (this.validGrammar || this.dependsOnAframe)) {
      this.isActivated = true
      // release all subscriptions
      this.subscriptions.dispose()
      this.activateFn()
    }
  }
}
export { Activator }
