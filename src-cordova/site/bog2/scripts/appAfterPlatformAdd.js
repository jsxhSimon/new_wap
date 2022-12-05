// 每次安装 platforms/ios 时，自动配置打包环境

const fs = require('fs-extra')
const env = require('./../site.json')

module.exports = (ctx) => {
  /* eslint-disable global-require */
  const toPath = require('./utils/toPath')(ctx)
  const configPath = toPath('./platforms/ios/config')
  fs.writeFileSync(toPath('./platforms/pSite.json'), JSON.stringify(env), { encoding: 'utf8' })
  const filePath = toPath(`./site/${env.template}/ExportOptions.plist`)
  const zs = toPath(`./site/${env.template}/project.pbxproj`)
  const resultPath = toPath('./platforms/ios/config/ExportOptions.plist')
  if (fs.existsSync(toPath('./platforms/ios'))) {
    if (!fs.existsSync(configPath)) {
      fs.mkdirSync(configPath)
      fs.writeFileSync(resultPath, fs.readFileSync(filePath))
    }
    if (fs.existsSync(zs)) {
      fs.copyFileSync(toPath(zs), toPath(`./platforms/ios/${env.appTitle}.xcodeproj/project.pbxproj`))
      console.log('证书替换完成')
    } else {
      console.log('证书没找到')
    }
  }
}
