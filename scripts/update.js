const path = require('path')
const fs = require('fs')
const request = require('request')
const semver = require('semver')

const pkgConfig = require('../package.json')
const { AframeVersion } = require('./aframe-version')
const vjson = path.join(path.dirname(__dirname), 'data', 'versions.json')
const aframeMinVer = '0.3.0'

function hascnf (obj) {
  const args = Array.prototype.slice.call(arguments, 1)
  for (let i = 0; i < args.length; i++) {
    if (!obj || !Object.prototype.hasOwnProperty.call(obj, args[i])) {
      return false
    }
    obj = obj[args[i]]
  }
  return true
}

if (
  !hascnf(pkgConfig, 'configSchema', 'devel', 'properties', 'npmapi', 'default')
) {
  console.error('NPM API URI missing')
  process.exit(1)
}
const npmapi = pkgConfig.configSchema.devel.properties.npmapi.default
if (
  !hascnf(
    pkgConfig,
    'configSchema',
    'devel',
    'properties',
    'docsBaseURL',
    'default'
  )
) {
  console.error('A-Frame documentation base url missing')
  process.exit(1)
}
const docsBaseURL = pkgConfig.configSchema.devel.properties.docsBaseURL.default

/**
 * Get A-Frame Versions
 */
const npmapiPromise = new Promise(resolve => {
  return request({ json: true, url: npmapi }, function (error, res, attributes) {
    if (error != null) {
      console.error(error.message)
      resolve(null)
    }

    if (res.statusCode !== 200) {
      console.error(
        `Request checking A-Frame versions failed: ${res.statusCode}`
      )
      resolve(null)
    }

    for (const attribute in attributes) {
      const options = attributes[attribute]
      if (
        (options.attribOption != null
          ? options.attribOption.length
          : undefined) === 0
      ) {
        delete options.attribOption
      }
    }

    return resolve(attributes)
  })
})

async function checkDocsURL (docsTestURL) {
  const res = await new Promise(resolve => {
    return request({ url: docsTestURL, method: 'HEAD' }, (err, r) => {
      if (err) return false
      resolve(/4\d\d/.test(r.statusCode) === false)
    })
  })
  return res
}

async function updateVersions (npmData) {
  console.info('updating versions...')
  const versions = {}
  let docsVer = 'master'

  for (const ver in npmData.versions) {
    if (semver.gte(ver, aframeMinVer)) {
      versions[ver] = new AframeVersion(ver, npmData.time[ver])
      const docsURL = `${docsBaseURL}/${ver}`
      const docsTestURL = `${docsURL}/introduction/`
      const hasDocs = await checkDocsURL(docsTestURL)
      versions[ver].hasDocs = hasDocs
      if (hasDocs) {
        docsVer = versions[ver].version
      }
      versions[ver].docsVer = docsVer
      fs.writeFileSync(vjson, `${JSON.stringify(versions, null, '  ')}\n`)
    }
  }
}

Promise.all([npmapiPromise]).then(function (values) {
  updateVersions(values[0])
})
