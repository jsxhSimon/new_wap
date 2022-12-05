// 替换 三方游戏进入动画
const fs = require('fs')
const path = require('path')
const env = require('../site.json')

const myEnv = env.template

module.exports = (ctx) => {
  const rootdir = ctx.opts.projectRoot
  const toPath = url => path.resolve(rootdir, url)
  const imgPath = toPath(`./site/${myEnv}/gameLoading/loading.gif`)
  const htmlPath = toPath(`./site/${myEnv}/gameLoading/loading.html`)
  if (fs.existsSync(imgPath)) {
    if (fs.existsSync(toPath('./plugins'))) {
      const pluginPathArr = [
        './plugins/ben-cordova-plugin-themeablebrowser/src/ios/gameLoading/loading.gif',
        './plugins/ben-cordova-plugin-themeablebrowser/src/android/res/gameLoading/loading.gif',
      ]
      pluginPathArr.forEach((item) => {
        fs.writeFileSync(item, fs.readFileSync(imgPath))
      })
    }
    const loadingPath = toPath('./platforms/ios/www/gameLoading/loading.gif')
    if (fs.existsSync(loadingPath)) {
      fs.writeFileSync(loadingPath, fs.readFileSync(imgPath))
    }
    const loadingAnPath = toPath('./platforms/android/app/src/main/assets/gameLoading/loading.gif')
    if (fs.existsSync(loadingAnPath)) {
      fs.writeFileSync(loadingAnPath, fs.readFileSync(imgPath))
    }
  }
  if (fs.existsSync(htmlPath)) {
    if (fs.existsSync(toPath('./plugins'))) {
      const pluginPathArr = [
        './plugins/ben-cordova-plugin-themeablebrowser/src/ios/gameLoading/loading.html',
        './plugins/ben-cordova-plugin-themeablebrowser/src/android/res/gameLoading/loading.html',
      ]
      pluginPathArr.forEach((item) => {
        fs.writeFileSync(item, fs.readFileSync(htmlPath))
      })
    }
    const loadingPath = toPath('./platforms/ios/www/gameLoading/loading.html')
    if (fs.existsSync(loadingPath)) {
      fs.writeFileSync(loadingPath, fs.readFileSync(htmlPath))
    }
    const loadingAnPath = toPath('./platforms/android/app/src/main/assets/gameLoading/loading.html')
    if (fs.existsSync(loadingAnPath)) {
      fs.writeFileSync(loadingAnPath, fs.readFileSync(htmlPath))
    }
  }
}
