'use babel'

import semver from 'semver'
import { Emitter } from 'atom'
import versions from '../../data/versions.json'

export class AframeDev {
  /**
   * Aframe Develeoment API for atom-aframe package
   */
  constructor () {
    this.emitter = new Emitter()
    this.description = null
    this.docsVer = 'master'
    this.release = null
    // if false latest satisfied version should be used
    this.hasDocs = null
    this.setVersion(atom.config.get('atom-aframe.project.defaultAframeVersion'))
  }

  /**
   * Set current project A-Frame version and docs version
   *
   * @param {String} ver  valid semver version
   * @param {String} sver valid semver range
   */
  setVersion (ver, sver) {
    this.semver = sver
    this.parseVersion(ver, sver)
    if (Object.prototype.hasOwnProperty.call(versions, this.version)) {
      this.description = versions[this.version].description
      this.docsVer = versions[this.version].docsVer
      this.release = versions[this.version].release
    }
    this.emitter.emit('aframe-version-changed', this.version)
  }

  /**
   * Call provided callback when verison has been changed
   *
   * @param  {Function} cb callback to call
   */
  onVersionChanged (cb) {
    this.emitter.on('aframe-version-changed', cb)
  }

  /**
   * dispose emitter
   */
  dispose () {
    this.emitter.dispose()
  }

  /**
   * Get current documentation version
   *
   * @return {String} documentation version related to current version
   */
  getDocVersion () {
    return this.docsVer
  }

  /**
   * Currently returns release date infor, but should return release notes
   *
   * @return {String} [description]
   */
  getMessage () {
    return this.description
  }

  /**
   * Parse current version
   *
   * @param {String} ver  valid semver version
   * @param {String} sver valid semver range
   */
  parseVersion (ver, sver) {
    if (semver.valid(ver)) {
      this.version = ver
      return
    }
    const r = semver.validRange(sver)
    if (r) {
      const vers = []
      for (const v in versions) {
        vers.push(v)
      }
      this.version = semver.maxSatisfying(vers, r)
    }
  }
}
