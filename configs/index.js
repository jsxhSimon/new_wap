const fs = require('fs')
const path = require('path')

console.log(require('yargs').argv)

const {
  site: APP_SITE, env2: targetEnv, env: targetEnv1, platform, buildSite
} = require('yargs').argv

const envConfigs = require(`./env/${targetEnv || targetEnv1}`)

let siteConfigs = require(`./sites/${APP_SITE}`)
console.log(siteConfigs)
if (buildSite && APP_SITE === 'dcs') {
  siteConfigs = require(`./sites/${buildSite === 'bog' ? 'bog2' : buildSite}/dcs.js`)
}
if (buildSite && APP_SITE === 'pre') {
  if (buildSite === 'bog') {
    siteConfigs = require('./sites/bog2/pre.js')
  } else if (buildSite === 'goc') {
    siteConfigs = require('./sites/sdy/pre.js')
  } else {
    siteConfigs = require(`./sites/${buildSite}/pre.js`)
  }
}
if (platform) {
  const jsonData = {
    env: APP_SITE,
    appTitle: siteConfigs.APP_TITLE,
    template: siteConfigs.APP_TEMPLATE,
    OPENINSTALL_APPKEY: envConfigs.OPENINSTALL_APPKEY,
  }
  fs.writeFileSync(path.resolve(__dirname, './../src-cordova/site.json'), JSON.stringify(jsonData), 'utf8')
}
// eslint-disable-next-line import/no-dynamic-require

// eslint-disable-next-line import/no-dynamic-require
const { getDeploymentKey } = require('./codepush')
const { getDefaultSToken } = require('./stoken')

// 把configs的值都转化成'"xxx"'形式
const normalizeConfigs = (configs) => {
  const newConfig = {}
  Object
    .keys(configs)
    .forEach((key) => {
      const value = configs[key]
      newConfig[key] = JSON.stringify(value)
    })
  return newConfig
}

module.exports = {
  normalizeConfigs,
  appConfigs: {
    APP_SITE: process.env.APP_SITE || APP_SITE,
    ...envConfigs,
    ...siteConfigs,
    APP_DEPLOYMENT_KEY: getDeploymentKey({
      site: APP_SITE,
      platform: platform || 'android',
      template: siteConfigs.SITE,
    }),
    DEFAULT_STOKEN: getDefaultSToken({ site: APP_SITE }),
  },
}
