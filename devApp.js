const readlineSync = require('readline-sync')
const shell = require('shelljs')

let platform = process.argv[2]
let projectName = process.argv[3]
let projectSite = process.argv[4]

if (!projectName) {
  projectName = readlineSync.question('请输入项目名称（如：sdy, bog, bt8, bog2, jun, ybo, bw2, ob8, ysz, hbx, bw1等）: ')
}
if (!platform) {
  platform = readlineSync.question('请输入要打包的平台 （1 ios, 2 android）')
}
if (!projectSite) {
  projectSite = readlineSync.question('请输入打包环境名称（如：1 测试环境 2 予发布环境 3 生产环境）:')
}

const siteMap = {
  1: 'dcs',
  2: 'pre',
  3: projectName === 'sdy' ? 'goc' : projectName,
}

const isIOS = platform === '1'

try {
  shell.exec(`node initData.js ${projectName} ${siteMap[projectSite]} ${platform}`)
  shell.exec(`node initCordova.js ${siteMap[projectSite]}`)
  console.log(`quasar dev -m ${isIOS ? 'ios' : 'android'} --site=${siteMap[projectSite]} --env=wsdy-${projectSite === '1' ? 'test' : 'prod'} ${isIOS ? '-e iPhone-11 --platform=ios' : ''}`)
  shell.exec(`quasar dev -m ${isIOS ? 'ios' : 'android'} --site=${siteMap[projectSite]} --env=wsdy-${projectSite === '1' ? 'test' : 'prod'} ${isIOS ? '-e iPhone-11 --platform=ios' : ''}`)
} catch (err) {
  console.log(err)
}
