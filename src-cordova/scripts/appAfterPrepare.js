// 修改 ios info.plist 文件
// 禁止 ios 橡皮筋效果
const fs = require('fs-extra')
const plist = require('plist')
const path = require('./utils/toPath')
const env = require('../site.json')

const infoPath = `./platforms/ios/${env.appTitle}/${env.appTitle}-Info.plist`
const openInstallDebugPath = `./platforms/ios/${env.appTitle}/Entitlements-Debug.plist`
const openInstallReleasePath = `./platforms/ios/${env.appTitle}/Entitlements-Release.plist`

console.log('----------------------- env-start --------------------')
console.log('env:', env)
console.log('----------------------- env-end --------------------')

module.exports = (ctx) => {
  const toPath = path(ctx)
  const isIOS = ctx.opts.platforms[0] === 'ios'
  if (isIOS) {
    const changPlistFile = (filePath, param) => {
      let xml = fs.readFileSync(toPath(filePath), 'utf8')
      const obj = plist.parse(xml)
      obj[param.attr] = param.value
      xml = plist.build(obj)
      fs.writeFileSync(toPath(filePath), xml, { encoding: 'utf8' })
    }
    const useConfirmPath = `./platforms/ios/${env.appTitle}/Plugins/cordova-plugin-inappbrowser/CDVWKInAppBrowserUIDelegate.m`
    if (fs.existsSync(toPath('./platforms/ios'))) {
      changPlistFile(toPath(infoPath), {
        attr: 'NSCameraUsageDescription',
        value: 'cameraDesciption',
      })
      if (env.appTitle === 'SDY体育' || env.appTitle === '悟空包网'){
        changPlistFile(toPath(openInstallDebugPath), {
          attr: 'com.apple.developer.associated-domains',
          value: [`applinks:${env.OPENINSTALL_APPKEY || 'wb11z6'}.openinstall.io`],
        })
        changPlistFile(toPath(openInstallReleasePath), {
          attr: 'com.apple.developer.associated-domains',
          value: [`applinks:${env.OPENINSTALL_APPKEY || 'wb11z6'}.openinstall.io`],
        })
      } else {
        changPlistFile(toPath(openInstallDebugPath), {
          attr: 'com.apple.developer.associated-domains',
          value: [`applinks:${env.OPENINSTALL_APPKEY || 'wb11z6'}.ytcnfc256.xyz`],
        })
        changPlistFile(toPath(openInstallReleasePath), {
          attr: 'com.apple.developer.associated-domains',
          value: [`applinks:${env.OPENINSTALL_APPKEY || 'wb11z6'}.ytcnfc256.xyz`],
        })
      }
      // 禁止橡皮筋效果
      const PlsCDVUIWebViewDelegate = toPath('./platforms/ios/CordovaLib/Classes/Private/Plugins/CDVUIWebViewEngine/CDVUIWebViewDelegate.m')
      if (fs.existsSync(PlsCDVUIWebViewDelegate)) {
        fs.writeFileSync(PlsCDVUIWebViewDelegate, fs.readFileSync(toPath('./iosConfig/CDVUIWebViewDelegate.m')), 'utf8')
      }
      // 允许使用系统自带的 alter 和 confirm
      if (fs.existsSync(toPath(useConfirmPath))) {
        fs.writeFileSync(toPath(useConfirmPath), fs.readFileSync(toPath('./iosConfig/CDVWKInAppBrowserUIDelegate.m')), 'utf8')
      }
      const PlsCDVThemeableBrowser = toPath(`./platforms/ios/${env.appTitle}/Plugins/ben-cordova-plugin-themeablebrowser/CDVThemeableBrowser.m`)
      if (fs.existsSync(PlsCDVThemeableBrowser)) {
        fs.writeFileSync(PlsCDVThemeableBrowser, fs.readFileSync(toPath('./iosConfig/CDVThemeableBrowser.m')), 'utf8')
      }
      const PlsCDVThemeableBrowserH = toPath(`./platforms/ios/${env.appTitle}/Plugins/ben-cordova-plugin-themeablebrowser/CDVThemeableBrowser.h`)
      if (fs.existsSync(PlsCDVThemeableBrowserH)) {
        fs.writeFileSync(PlsCDVThemeableBrowserH, fs.readFileSync(toPath('./iosConfig/CDVThemeableBrowser.h')), 'utf8')
      }
      const PlsCDVSplashScreen = toPath(`./platforms/ios/${env.appTitle}/Plugins/cordova-plugin-splashscreen/CDVSplashScreen.m`)
      if (fs.existsSync(PlsCDVSplashScreen)) {
        fs.writeFileSync(PlsCDVSplashScreen, fs.readFileSync(toPath('./iosConfig/CDVSplashScreen.m')), 'utf8')
      }
      const PlsCDVWebViewEngine = toPath('./platforms/ios/CordovaLib/Classes/Private/Plugins/CDVWebViewEngine/CDVWebViewEngine.m')
      if (fs.existsSync(PlsCDVWebViewEngine)) {
        fs.writeFileSync(PlsCDVWebViewEngine, fs.readFileSync(toPath('./iosConfig/CDVWebViewEngine.m')), 'utf8')
      }
      const PlsCDVFileTransfer = toPath(`./platforms/ios/${env.appTitle}/Plugins/cordova-plugin-file-transfer/CDVFileTransfer.m`)
      if (fs.existsSync(PlsCDVFileTransfer)) {
        fs.writeFileSync(PlsCDVFileTransfer, fs.readFileSync(toPath('./iosConfig/CDVFileTransfer.m')), 'utf8')
      }
      const PlsCDVWKWebViewFileXhr = toPath(`./platforms/ios/${env.appTitle}/Plugins/cordova-plugin-wkwebview-file-xhr/CDVWKWebViewFileXhr.m`)
      if (fs.existsSync(PlsCDVWKWebViewFileXhr)) {
        fs.writeFileSync(PlsCDVWKWebViewFileXhr, fs.readFileSync(toPath('./iosConfig/CDVWKWebViewFileXhr.m')), 'utf8')
      }
      // 关闭 app 玩三方游戏时 自动熄屏问题
      const fileAppDelegate = toPath(`./platforms/ios/${env.appTitle}/Classes/AppDelegate.m`)
      if (fs.existsSync(fileAppDelegate)) {
        fs.writeFileSync(fileAppDelegate, fs.readFileSync(toPath('./iosConfig/AppDelegate.m')), 'utf8')
      }
      const fileCDVLaunchSceen = toPath(`./platforms/ios/${env.appTitle}/CDVLaunchScreen.storyboard`)
      if (fs.existsSync(fileCDVLaunchSceen)) {
        fs.writeFileSync(fileCDVLaunchSceen, fs.readFileSync(toPath('./iosConfig/CDVLaunchScreen.storyboard')), 'utf8')
      }
      const iosResources = toPath(`./platforms/ios/${env.appTitle}/Resources`)
      if (fs.existsSync(iosResources)) {
        fs.writeFileSync(`${iosResources}/close@2x.png`, fs.readFileSync(toPath('./site/comm/themeablebrowser/close@2x.png')))
        fs.writeFileSync(`${iosResources}/close_pressed@2x.png`, fs.readFileSync(toPath('./site/comm/themeablebrowser/close_pressed@2x.png')))
      }
    }
    if (fs.existsSync(toPath('./plugins'))) {
      // splash 首页加载动画文件修改
      const PlsCDVSplashScreen = toPath('./plugins/cordova-plugin-splashscreen/src/ios/CDVSplashScreen.m')
      if (fs.existsSync(PlsCDVSplashScreen)) {
        fs.writeFileSync(PlsCDVSplashScreen, fs.readFileSync(toPath('./iosConfig/CDVSplashScreen.m')), 'utf8')
      }
      fs.writeFileSync(toPath('./plugins/cordova-plugin-inappbrowser/src/ios/CDVWKInAppBrowserUIDelegate.m'), fs.readFileSync(toPath('./iosConfig/CDVWKInAppBrowserUIDelegate.m')), 'utf8')
    }
  } else {
    if (fs.existsSync(toPath('./platforms/android'))) {
      const PlsCDVSplashScreen = toPath('./platforms/android/app/src/main/java/org/apache/cordova/splashscreen/SplashScreen.java')
      if (fs.existsSync(PlsCDVSplashScreen)) {
        fs.writeFileSync(PlsCDVSplashScreen, fs.readFileSync(toPath('./androidConfig/SplashScreen.java')), 'utf8')
      }
    }
    if (fs.existsSync(toPath('./plugins'))) {
      // splash 首页加载动画文件修改
      const PlsCDVSplashScreen = toPath('./plugins/cordova-plugin-splashscreen/src/android/SplashScreen.java')
      if (fs.existsSync(PlsCDVSplashScreen)) {
        fs.writeFileSync(PlsCDVSplashScreen, fs.readFileSync(toPath('./androidConfig/SplashScreen.java')), 'utf8')
      }
    }
    const grandlePath = './androidConfig/build-extras.gradle'
    const grandleForce = './platforms/android/app/build-extras.gradle'
    if (fs.existsSync(toPath('./platforms/android')) && fs.existsSync(toPath('./platforms/android/app')) && !fs.existsSync(toPath(grandleForce))) {
      const xml = fs.readFileSync(toPath(grandlePath), 'utf8')
      fs.writeFileSync(toPath(grandleForce), xml, { encoding: 'utf8' })
    }
    const androidResources = toPath('./platforms/android/app/src/main/res/drawable-xhdpi')
    if (fs.existsSync(androidResources)) {
      fs.writeFileSync(`${androidResources}/close.png`, fs.readFileSync(toPath('./site/comm/themeablebrowser/close@2x.png')))
      fs.writeFileSync(`${androidResources}/close_pressed.png`, fs.readFileSync(toPath('./site/comm/themeablebrowser/close_pressed@2x.png')))
    }
  }
}
