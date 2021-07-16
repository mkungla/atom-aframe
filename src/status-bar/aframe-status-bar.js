'use babel'

import { Disposable } from 'atom'

export class AframeStatusBar {
  /**
   * Setup statusbBar
   */
  constructor () {
    this.sb = null
    this.clickSubscription = null
    this.tile = null
    this.tooltip = null
    this.el = null
    this.elVersion = null
    this.setup()
  }

  /**
   * Set StatusBar when consumedServices are setup
   */
  setStatusBar (sb) {
    this.sb = sb
  }

  /**
   * Create statusbar node
   */
  setup () {
    this.el = document.createElement('aframe-status-block')
    this.el.classList.add('atom-aframe-status', 'inline-block')

    const elLogo = document.createElement('div')
    elLogo.classList.add('atom-aframe-status-logo', 'inline-block')
    const elLogoImg = document.createElement('img')
    elLogoImg.setAttribute('src', 'atom://atom-aframe/res/images/favicon.png')
    elLogo.appendChild(elLogoImg)
    this.el.appendChild(elLogo)

    this.elVersion = document.createElement('a')
    this.elVersion.classList.add('atom-aframe-version', 'inline-block')
    this.el.appendChild(this.elVersion)
    this.el.addEventListener('click', this.onClick)
    this.clickSubscription = new Disposable(() =>
      this.el.removeEventListener('click', this.onClick)
    )
  }

  /**
   * Attach statusbar
   */
  attach () {
    if (!this.sb || !this.el) {
      return
    }
    this.el.style.display = 'none'
    this.tile = this.sb.addRightTile({ priority: 500, item: this.el })
  }

  /**
   * update status bar info
   *
   * @param  {String} version current version
   * @param  {String} msg     info about the version
   */
  update (version, msg) {
    if (!version) {
      this.el.style.display = 'none'
      return
    }
    atom.views.updateDocument(() => {
      this.el.style.display = ''
      this.elVersion.textContent = version
      this.elVersion.style.display = ''
      if (this.tooltip) {
        this.tooltip.dispose()
      }
      this.tooltip = atom.tooltips.add(this.el, { title: msg })
    })
  }

  /**
   * destroy statusbar
   */
  destroy () {
    if (this.clickSubscription) {
      this.clickSubscription.dispose()
    }
    if (this.tile) {
      this.tile.destroy()
    }

    if (this.tooltip) {
      this.tooltip.dispose()
    }
  }

  /**
   * Statusbar onClick
   *
   * shold provide some action menu instead of opening settings
   */
  onClick (e) {
    e.preventDefault()
    atom.commands.dispatch(
      atom.views.getView(atom.workspace),
      'atom-aframe:open-settings'
    )
  }
}
