const readlineSync = require('readline-sync')
const shell = require('shelljs')
const path = require('path')
const { readFileSync, writeFileSync } = require('fs-extra')

const toPath = url => path.resolve(__dirname, url)

let platform = process.argv[2]
let projectName = process.argv[3]
let projectSite = process.argv[4]

if (!projectName) {
  projectName = readlineSync.question('请输入项目名称（如：sdy, bog, bog2, jun, bw2, ysz, bw1, hbx, ywb 等）: ')
}
if (!platform) {
  platform = readlineSync.question('请输入要打包的平台 （1 ios, 2 android）')
}
if (!projectSite) {
  projectSite = readlineSync.question('请输入打包环境名称（如：1 测试环境 2 予发布环境 3 生产环境）:')
}

const PRE_VERSION = require(`./configs/sites/${projectName}/pre`).APP_VERSION
let projectNamePro = projectName
if (projectName === 'bog2') {
  projectNamePro = 'bog'
}
if (projectName === 'sdy') {
  projectNamePro = 'goc'
}
const PRO_VERSION = require(`./configs/sites/${projectName}/${projectNamePro}`).APP_VERSION

const siteMap = {
  1: 'dcs',
  2: 'pre',
  3: projectName === 'sdy' ? 'goc' : projectName,
}

const runBuild = () => {
  const isIOS = platform === '1'
  const env = require(toPath(`./configs/sites/${siteMap[projectSite]}`))

  shell.echo(`您选择的打包站点是：${projectName}`)
  shell.echo(`您选择的打包平台是：${isIOS ? 'ios' : 'android'}`)
  shell.echo(`您选择的打包环境是：${siteMap[projectSite]}`)
  const env1 = `wsdy-${projectSite === '1' ? 'test' : 'prod'}`
  const env2 = `${{ bog2: 'bog', sdy: 'wsdy' }[projectName] || projectName}-${projectSite === '1' ? 'test' : 'prod'}`

  shell.echo('------------------------------------------- 选择完毕，开始修改openistall和极光推送 appkey ------------------------------------------------')

  const OPENINSTALL_APPKEY = require(`./configs/env/${env2}.js`).OPENINSTALL_APPKEY || 'wb11z6'
  const JPUSH_APP_KEY = require(`./configs/env/${env2}.js`).JPUSH_APP_KEY || '3e17db9402c3ca97550fbf3e'
  const pkg = JSON.parse(readFileSync('./src-cordova/package.json', 'utf-8'))
  let openInstall = null
  let OLD_OPENINSTALL_APPKEY = null
  if (projectName === 'sdy' || projectName === 'ysz') {
    openInstall = pkg.cordova.plugins['cordova-plugin-openinstall']
    OLD_OPENINSTALL_APPKEY = openInstall.OPENINSTALL_APPKEY
    openInstall.OPENINSTALL_APPKEY = OPENINSTALL_APPKEY
    openInstall.OPENINSTALL_SCHEME = OPENINSTALL_APPKEY
  } else {
    openInstall = pkg.cordova.plugins['cordova-plugin-gzmj-wsdy']
    OLD_OPENINSTALL_APPKEY = openInstall.APPKEY
    openInstall.APPKEY = OPENINSTALL_APPKEY
    openInstall.SCHEME = OPENINSTALL_APPKEY
  }

  const jpush = pkg.cordova.plugins['jpush-phonegap-plugin']
  const OLD_JPUSH_APP_KEY = jpush.APP_KEY
  jpush.APP_KEY = JPUSH_APP_KEY
  writeFileSync('./src-cordova/package.json', JSON.stringify(pkg, null, 2), 'utf-8')

  shell.echo('------------------------------------------- 选择完毕，www 打包 开始编译 ------------------------------------------------')
  shell.echo(`npx quasar build -m ${isIOS ? 'ios' : 'android'} ${isIOS ? '--skip-pkg' : ''} --site=${siteMap[projectSite]} --env=${env1} --env2=${env2} --platform=${isIOS ? 'ios' : 'android'} --buildSite=${projectName}`)

  shell.exec(`npx quasar build -m ${isIOS ? 'ios' : 'android'} ${isIOS ? '--skip-pkg' : ''} --site=${siteMap[projectSite]} --env=${env1} --env2=${env2} --platform=${isIOS ? 'ios' : 'android'} --buildSite=${projectName}`)

  shell.cd('src-cordova')

  if (isIOS) {
    shell.echo('-------------------------------------------选择完毕， www 打包 结束编译------------------------------------------------')
    shell.echo('-------------------------------------------ios 开始------------------------------------------------')
    shell.echo('-------------------------------------------从项目根目录进入打包ios目录开始------------------------------------------------')

    shell.cd('platforms')
    shell.cd('ios')

    shell.echo('-------------------------------------------从项目根目录进入打包ios目录结束------------------------------------------------')
    shell.echo('-------------------------------------------第一次build编译 开始------------------------------------------------')

    // shell.exec(`xcodebuild archive -workspace ${env.APP_TITLE}.xcworkspace -scheme ${env.APP_TITLE} -configuration Release -archivePath ./configBuild/archive.xcarchive`)
    shell.exec(`xcodebuild archive -workspace '${env.APP_TITLE}.xcworkspace' -scheme '${env.APP_TITLE}' -destination generic/platform=iOS -configuration Release -archivePath ./configBuild/archive.xcarchive`)

    shell.echo('-------------------------------------------第一次 build编译 结束------------------------------------------------')
    shell.echo('-------------------------------------------生成ipa开始------------------------------------------------')

    shell.exec('xcodebuild -exportArchive -archivePath ./configBuild/archive.xcarchive -exportPath ./config/ipa-app-store -exportOptionsPlist ./config/ExportOptions.plist -allowProvisioningUpdates')

    shell.echo('-------------------------------------------生成ipa开始结束------------------------------------------------')
    shell.echo('-------------------------------------------ios 结束------------------------------------------------')

    shell.echo('---准备回到上级目录，codepush准备中-----')

    shell.cd('../../')
  }
  shell.echo('---成功回到上级目录，还原openistall和极光推送 appkey -----')
  if (projectName === 'sdy') {
    openInstall.OPENINSTALL_APPKEY = OLD_OPENINSTALL_APPKEY
    openInstall.OPENINSTALL_SCHEME = OLD_OPENINSTALL_APPKEY
  } else {
    openInstall.APPKEY = OLD_OPENINSTALL_APPKEY
    openInstall.SCHEME = OLD_OPENINSTALL_APPKEY
  }
  jpush.APP_KEY = OLD_JPUSH_APP_KEY
  writeFileSync('../src-cordova/package.json', JSON.stringify(pkg, null, 2), 'utf-8')

  shell.echo('---还原成功，codepush准备开始-----')

  let code_push_sql = ''
  if (projectName === 'sdy') {
    code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/coapp-${siteMap[projectSite]}-${isIOS ? 'ios' : 'android'} -d wsdy-${projectSite === '1' ? 'test' : 'prod'}`
  } else {
    const map = {
      1: 'test',
      2: 'pre',
      3: 'prod',
    }
    if (projectName === 'bt8') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/coapp-${projectName}-${isIOS ? 'ios' : 'android'} -d ${map[projectSite]}`
    } else if (projectName === 'jun') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/${isIOS ? 'hzzx-doc-andriod' : 'india-android-test'} -d wsdy-${map[projectSite]}`
    } else if (projectName === 'ybo') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/${isIOS ? 'wesd' : 'india-android-prod'} -d wsdy-${map[projectSite]}`
    } else if (projectName === 'bw2') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/${isIOS ? 'mickeyapp-goc-ios' : 'mickeyapp-goc-android'} -d wsdy-${map[projectSite]}`
    } else if (projectName === 'ob8') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/${isIOS ? 'india-ios-prod' : 'coapp-bt8-android'} -d wsdy-${map[projectSite]}`
    } else if (projectName === 'ysz') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/${isIOS ? 'coapp-pre-ios' : 'coapp-pre-android'} -d sdydemo-${map[projectSite]}`
    } else if (projectName === 'bw1') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/${isIOS ? 'coapp-pre-ios' : 'coapp-pre-android'} -d bw1-${map[projectSite]}`
    } else if (projectName === 'hbx') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/${isIOS ? 'coapp-pre-ios' : 'coapp-pre-android'} -d hbx-${map[projectSite]}`
    } else if (projectName === 'mbs') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/${isIOS ? 'coapp-pre-ios' : 'coapp-pre-android'} -d mbs-${map[projectSite]}`
    } else if (projectName === 'ywb') {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/${isIOS ? 'coapp-pre-ios' : 'coapp-pre-android'} -d ywb-${map[projectSite]}`
    } else {
      code_push_sql = `appcenter codepush release-cordova -a sdyng.ops/coapp-${projectName.indexOf('bog') > -1 ? 'bog' : projectName}-${isIOS ? 'ios' : 'android'} -d wsdy-${map[projectSite]}`
    }
  }
  if (projectSite == 2) {
    code_push_sql = `${code_push_sql} --description '{"version":"${PRE_VERSION}","desc":"版本优化"}'`
  }
  if (projectSite == 3) {
    code_push_sql = `${code_push_sql} --disabled --description '{"version":"${PRO_VERSION}","desc":"版本优化"}'`
  }
  if (projectSite == 2 || projectSite == 3) {
    shell.echo(code_push_sql)
    shell.exec(code_push_sql)
    shell.echo('---odepush成功-----')
  }
}

try {
  shell.exec(`node initData.js ${projectName} ${siteMap[projectSite]} ${platform}`)
  shell.exec(`node initCordova.js ${siteMap[projectSite]}`)
  runBuild()
} catch (err) {
  console.log(err)
}
