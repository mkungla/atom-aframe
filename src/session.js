'use babel'

import {CompositeDisposable} from 'atom'
import {PJW} from './pjw'
import {AframeDev} from './aframe/aframe-dev'
import {AutocompleteProvider} from './autocomplete/provider'
import {AframeStatusBar} from './status-bar/aframe-status-bar'

class Session {
  /**
   * Session constructor
   *
   * @param  {Object} state from last package serialization
   * @return {Session}
   */
  constructor (state) {
    this.state = state
    this.subscriptions = new CompositeDisposable()
    this.autocomplete = new AutocompleteProvider()
    this.statusBar = new AframeStatusBar()

    this.pjw = new PJW()
    this.aframe = new AframeDev()
    this.subscribe(this.aframe)
  }

  /**
   * Session.start called when package is activated by version found in
   * package json, matched grammar or some of the workspace commands
   */
  start () {
    this.observeVersionChanged()
    this.observePackageJSON()
  }

  /**
   * Set up subscriptions
   *
   * @param  {Disposable} disposable
   */
  subscribe (disposable) {
    this.subscriptions.add(disposable)
  }

  /**
   * destroy subscriptions
   */
  destroy () {
    this.subscriptions.dispose()
    this.subscriptions = null

    this.pjw.dispose()
    this.pjw = null

    if (this.statusBar) {
      this.statusBar.destroy()
    }
  }

  /**
   * Observe package.json for A-Frame dependency
   */
  observePackageJSON () {
    this.subscribe(atom.config.observe('atom-aframe.project.checkPackageJson', (listen) => {
      if (listen) {
        this.pjw.listen((ver, semver) => {
          this.aframe.setVersion(ver, semver)
        })
      } else {
        this.pjw.stop()
        this.aframe.setVersion(atom.config.get('atom-aframe.project.defaultAframeVersion'), null)
      }
    }))
  }

  /**
   * Listen version changed event from this.aframe and update
   * - status bar
   * - autocomplete doc version
   */
  observeVersionChanged () {
    this.aframe.onVersionChanged((ver) => {
      if (this.statusBar) {
        this.statusBar.update(ver, this.aframe.getMessage())
      }
      if (this.autocomplete) {
        this.autocomplete.setDocVersion(this.aframe.getDocVersion())
      }
    })
  }
}
export {Session}
