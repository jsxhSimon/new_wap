const path = require('path')
const fs = require('fs-extra')
const readlineSync = require('readline-sync')

let site = process.argv[2]

if (!site) {
  site = readlineSync.question('输入你的打包环境（如：dcs, pre, goc 等）')
}
// eslint-disable-next-line import/no-dynamic-require
const env = require(`./configs/sites/${site}`)
const toPath = url => path.resolve(__dirname, url)

const obj = {
  env: site,
  appTitle: env.APP_TITLE,
  site: env.SITE,
}
console.log('进入add第一个hoc')
console.log(env)
// 写入当前打包环境
fs.writeFileSync(toPath('./src-cordova/site.json'), JSON.stringify(obj), { encoding: 'utf8' })

function initConfig() {
  let configFile = toPath('./src-cordova/site/sdy/config.xml')
  const siteConfigFile = toPath(`./src-cordova/site/${obj.site}/config.xml`)
  if (fs.existsSync(siteConfigFile)) {
    configFile = siteConfigFile
  }
  fs.writeFileSync(toPath('./src-cordova/config.xml'), fs.readFileSync(configFile), { encoding: 'utf8' })
}
initConfig()

function initCordova() {
  const pSitePath = toPath('./src-cordova/platforms/pSite.json')
  function initPlatforms() {
    fs.removeSync(toPath('./src-cordova/plugins'))
    fs.removeSync(toPath('./src-cordova/platforms'))
    fs.removeSync(toPath('./src-cordova/res'))
    fs.copySync(toPath(`./src-cordova/site/${obj.site}/res`), toPath('./src-cordova/res'))
    fs.copySync(toPath('./src-cordova/localPlugins/plugins'), toPath('./src-cordova/plugins'))
  }
  if (fs.existsSync(toPath('./src-cordova/platforms'))) {
    if (fs.existsSync(pSitePath)) {
      const pSiteData = fs.readFileSync(pSitePath)
      const pSite = JSON.parse(pSiteData)
      if (obj.site !== pSite.site) {
        initPlatforms()
      }
    } else {
      initPlatforms()
    }
  } else {
    initPlatforms()
  }
}
initCordova()
