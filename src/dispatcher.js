'use babel'

export default class Dispatcher {
  /**
   * bind to main module
   *
   * @param  {Object} pkg package main module
   */
  bind (pkg) {
    pkg.dependsOnAframe = this.dependsOnAframe.bind(pkg)
  }

  /**
   * Setup subscriptions
   *
   * @param  {Object} package main module
   */
  subscribe (pkg) {
    return [
      pkg.emitter.on('project-did-change-aframe-version', this.aframeVersionChanged.bind(pkg)),
      pkg.emitter.on('project-depends-on-aframe', this.aframeDependencyUsed.bind(pkg)),
      pkg.emitter.on('project-does-not-depend-on-aframe', this.aframeDependencyNotUsed.bind(pkg))
    ]
  }

  /**
   * dependsOnAframe sets project type and dispatch events
   *
   * @param  {Boolean} depends true|false
   */
  dependsOnAframe (depends) {
    this.session.isAframeProject = depends
    if (depends) {
      this.emitter.emit('project-depends-on-aframe')
    } else {
      this.emitter.emit('project-does-not-depend-on-aframe')
    }
  }

  /**
   * aframeVersionChanged callback when project A-Frame version has changed
   */
  aframeVersionChanged () {
  }

  /**
   * aframeDependencyUsed is called when project is considered A-Frame project
   */
  aframeDependencyUsed () {
    if (this.statusBar) {
      this.statusBar.attach()
      let ver = '0.7.1'
      let msg = 'aframe'
      this.statusBar.update(ver, msg)
    }
  }

  /**
   * Set minimal UI when we are not sure is this A-Frame project
   */
  aframeDependencyNotUsed () {
    if (this.statusBar) {
      this.statusBar.destroy()
    }
  }
}
