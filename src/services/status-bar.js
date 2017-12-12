'use babel'

import {Disposable} from 'atom'

export default class StatusBar {
  constructor (sb) {
    this.el = document.createElement('aframe-status-block')
    this.el.classList.add('atom-aframe-status', 'inline-block')

    let elLogo = document.createElement('div')
    elLogo.classList.add('atom-aframe-status-logo', 'inline-block')
    let elLogoImg = document.createElement('img')
    elLogoImg.setAttribute('src', 'atom://atom-aframe/res/images/favicon.png')
    elLogo.appendChild(elLogoImg)
    this.el.appendChild(elLogo)

    this.elVersion = document.createElement('div')
    this.elVersion.classList.add('atom-aframe-version', 'inline-block')
    this.el.appendChild(this.elVersion)
  }

  /**
   * attach status bar
   */
  attach () {
    this.el.addEventListener('click', this.onClick)
    this.tile = this.sb.addRightTile({priority: 500, item: this.el})
  }

  /**
   * return status bar Disposable
   *
   * @return {Disposable} object
   */
  disposable () {
    return new Disposable(() => {
      this.el.removeEventListener('click', this.onClick)
      if (this.tile) {
        this.tile.destroy()
      }
      if (this.tooltip) {
        this.tooltip.dispose()
      }
    })
  }

  /**
   * destroy status bar
   */
  destroy () {
    this.disposable().dispose()
  }

  /**
   * update status bar
   *
   * @param  {string} version currently active version
   * @param  {string} msg     message for status bar tooltip
   */
  update (version, msg) {
    atom.views.updateDocument(() => {
      this.elVersion.textContent = version || 'master'
      this.elVersion.style.display = ''
      if (this.tooltip) {
        this.tooltip.dispose()
      }
      this.tooltip = atom.tooltips.add(this.el, {title: msg})
    })
  }

  /**
   * onClick handle when statusbar item is clicked
   *
   * @param  {Object} e event
   */
  onClick (e) {
    e.preventDefault()
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'atom-aframe:open-settings')
  }
}
