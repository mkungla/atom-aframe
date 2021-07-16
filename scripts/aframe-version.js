exports.AframeVersion = class {
  constructor (value, release) {
    this.version = value
    this.description = null
    this.release = null
    this.docsVer = null
    this.hasDocs = false
    this.setRelease(release)
  }

  setRelease (release) {
    const rd = new Date(release)
    if (Object.prototype.toString.call(rd) !== '[object Date]' || isNaN(rd)) {
      return
    }
    this.release = release
    if (this.version) {
      this.description = 'v' + this.version + ' released ' + rd.toDateString()
    }
  }

  setDocsVer (ver) {
    this.docsVer = ver
  }
}
