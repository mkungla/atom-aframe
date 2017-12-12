'use babel'

import {CompositeDisposable, Emitter} from 'atom'

import Services from './services'
import Validator from './validator'
import Session from './session'
import Dispatcher from './dispatcher'
import Commands from './commands'

export default {
  valid: false,
  statusBar: null,
  subscriptions: null,
  emitter: null,
  session: null,
  /**
   * Called before atom-aframe package is activated.
   * This gives you a chance to handle the serialized package state before
   * the package's derserializers and view providers are used.
   *
   * @param {Object} state data from the last time the window was serialized
   */
  initialize (state) {
    // Initialize atom services
    new Services().bind(this)
    // Set up validator
    new Validator().bind(this)
    this.session = new Session(state)
    this.validate()
  },

  /**
   * Called when atom-aframe package is activated
   */
  activate () {
    if (!this.isValid()) { return }
    this.subscriptions = new CompositeDisposable()
    this.emitter = new Emitter()

    let dispatcher = new Dispatcher()
    dispatcher.bind(this)
    this.subscriptions.add(...dispatcher.subscribe(this))

    let commands = new Commands()
    this.subscriptions.add(...commands.all())
  },

  /**
   * Called when the window is shutting down
   * so we can restore atom-aframe to where the user left off.
   *
   * @return {Session} state of atom-aframe
   */
  serialize () {
    return this.session
  },

  /**
   * Called when the window is shutting down so release external resources
   * e.g stop watching project package.json for A-Frame version
   */
  dispose () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
      this.subscriptions = null
    }
    if (this.emitter) {
      this.emitter.dispose()
      this.emitter = null
    }
    this.statusBar = null
    this.valid = false
  },

  /**
   * alias dispose
   */
  deactivate () {
    this.dispose()
  }
}
