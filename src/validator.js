'use babel'

import semver from 'semver'

export default class Validator {
  static validate () {
    return this.validateConfig() ? this.validateAtomVersion() : false
  }
  /**
   * Can package be activated for current Atom version
   *
   * @return {Boolean} is valid atom version
   */
  static validateAtomVersion () {
    const validVersion = semver.gte(atom.appVersion, atom.config.get('atom-aframe.devel.atomMinVer'))
    if (!validVersion && atom.config.get('atom-aframe.package.notifOnActivationFailure')) {
      atom.notifications.addWarning('**Package atom-aframe will not load**', {
        dismissable: true,
        icon: 'flame',
        description: `'Package **atom-aframe** requires Atom v'
          ${atom.config.get('atom-aframe.devel.atomMinVer')}
          'but you are running v' ${atom.appVersion}`
      })
    }
    return validVersion
  }

  /**
   * Validate package configuration and clean up deprecated config
   *
   * @return {Boolean} true for valid atom-aframe config
   */
  static validateConfig () {
    return this.handleDeprecatedConfig()
  }
  static handleDeprecatedConfig () {
    const deprecated = atom.config.get('atom-aframe.devel.deprecatedConf')
    if (deprecated && deprecated.length > 0) {
      for (let c of deprecated) {
        atom.config.unset(`atom-aframe.${c}`)
      }
    }
    return true
  }
}
