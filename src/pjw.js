'use babel'

import {File, CompositeDisposable} from 'atom'
import semver from 'semver'

class PJW {
  /**
   * Use pathwatcher to check single file.
   * Since pathwatcher can not handle rename well use onDidChangeFiles
   */
  constructor () {
    this.clear()
    this.pkgj = new File(atom.project.resolvePath('./package.json'))
  }
  /**
   * clear values
   */
  clear () {
    this.semver = null
    this.version = null
    this.dependencies = false
    this.devDependencies = false
  }
  /**
   * @return {Boolean} indicating does project have A-Frame dependency
   */
  hasDependency () {
    return this.dependencies || this.devDependencies
  }
  /**
   * check package.json and try to read dependencies || devDependencies
   *
   * @return {Promise} resolves only on dependencies || devDependencies : reject
   */
  check () {
    this.clear()
    return new Promise((resolve, reject) => {
      let c
      if (this.pkgj.existsSync()) {
        this.pkgj.read(false).then((f) => {
          try {
            c = JSON.parse(f)
            if (c.dependencies && c.dependencies.hasOwnProperty('aframe')) {
              this.semver = c.dependencies.aframe
              this.dependencies = true
            } else if (c.devDependencies && c.devDependencies.hasOwnProperty('aframe')) {
              this.semver = c.devDependencies.aframe
              this.devDependencies = true
            }

            if (this.semver) {
              this.version = semver.valid(this.semver) ? this.semver : null
              resolve()
            } else {
              reject(Error('Project package.json does not have aframe as dependencies or devDependencies'))
            }
          } catch (e) {
            reject(e)
          }
        })
      } else {
        reject(Error('Project has no package.json file'))
      }
    })
  }
  /**
   * listen package.jsone
   */
  listen (cp) {
    if (!this.subscriptions) {
      this.subscriptions = new CompositeDisposable()
    } else {
      this.subscriptions.dispose()
      this.subscriptions = null
    }
    // TODO: file.onDidRename
    // https://github.com/atom/atom/pull/16124
    if (this.pkgj.existsSync()) {
      // listen changes
      this.subscriptions.add(this.pkgj.onDidChange(() => {
        this.listenCallback(cp)
      }))

      // listen delete
      this.subscriptions.add(this.pkgj.onDidDelete(() => {
        // reload observers
        this.stop()
        this.listen(cp)
      }))
      // listen rename away
      this.subscriptions.add(atom.project.onDidChangeFiles(ev => {
        for (const e of ev) {
          if (e.action === 'renamed' && e.oldPath === this.pkgj.path) {
            this.stop()
            this.listen(cp)
            break
          }
        }
      }))
    } else {
      // listen create rename to
      this.subscriptions.add(atom.project.onDidChangeFiles(ev => {
        for (const e of ev) {
          if ((e.action === 'renamed' || e.action === 'created') && e.path === this.pkgj.path) {
            this.stop()
            this.listen(cp)
          }
        }
      }))
    }
    // initial
    this.listenCallback(cp)
  }
  /**
   * listenCallback should replaced and called just with this.semver
   */
  listenCallback (cp) {
    this.check().then(() => {
      if (this.hasDependency()) {
        cp(this.version, this.semver)
      }
    }).catch((e) => {
      cp(null, this.semver)
    })
  }
  /**
   * stop current observers/listeners
   */
  stop () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
      this.subscriptions = null
    }
    this.clear()
  }
  /**
   * dispose description
   *
   * @return {[type]} [description]
   */
  dispose () {
    this.stop()
  }
}
export {PJW}
