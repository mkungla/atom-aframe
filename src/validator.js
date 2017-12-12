'use babel'

import semver from 'semver'

export default class Validator {
  /**
   * Initialize all validate methods
   *
   * @param  {pkg}  package module
   */
  bind (pkg) {
    pkg.validate = this.validate.bind(pkg)
    pkg.isValid = this.isValid.bind(pkg)
  }

  /**
   * validate package
   *
   * @return {Boolean} true if package is valid
   */
  validate () {
    this.valid = Validator.validateAtomVersion() && Validator.validateConfig()
  }

  /**
   * Is package valid and should be enabled
   *
   * @return {Boolean} isValid
   */
  isValid () {
    return this.valid || false
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
   * Validate package configuration
   *
   * @return {Boolean} true for valid atom-aframe config
   */
  static validateConfig () {
    const deprecated = atom.config.get('atom-aframe.devel.deprecatedConf')
    if (deprecated && deprecated.length > 0) {
      for (let c of deprecated) {
        atom.config.unset(`atom-aframe.${c}`)
      }
    }
    return true
  }
}
