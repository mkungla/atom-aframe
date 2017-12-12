'use babel'

import StatusBar from './services/status-bar'

export default class Services {
  /**
   * Initialize all services which will be activated
   *
   * @param  {pkg}  package main module
   */
  bind (pkg) {
    this.bindConsumedServices(pkg)
    this.bindProvidedServices(pkg)
  }

  /**
   * Bind all consumed services
   *
   * @param {Object} pkg package main module
   */
  bindConsumedServices (pkg) {
    pkg.consumeStatusBar = this.consumeStatusBar.bind(pkg)
  }

  /**
   * Bind all provided services
   *
   * @param {Object} pkg package main module
   */
  bindProvidedServices (pkg) {
    pkg.provideAutocomplete = this.provideAutocomplete.bind(pkg)
  }

  /**
   * Status Bar Consumer
   *
   * @param  {Object} sb atom.status-bar
   */
  consumeStatusBar (sb) {
    if (!this.isValid()) { return }
    this.statusBar = new StatusBar(sb)
    this.subscriptions.add(this.statusBar.disposable())
    this.dependsOnAframe(this.session.isAframeProject)
  }

  /**
   * Autocomplete provider
   */
  provideAutocomplete () {
    if (!this.isValid()) { return }
    console.warn('noop')
  }
}
