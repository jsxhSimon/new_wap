const readlineSync = require('readline-sync')
const shell = require('shelljs')

let projectName = process.argv[2]
let projectSite = process.argv[3]

if (!projectName) {
  projectName = readlineSync.question('请输入项目名称（如：mb2等）: ')
}

if (!projectSite) {
  projectSite = readlineSync.question('请输入打包环境名称（如：1 测试环境 2 予发布环境 3 生产环境）:')
}

const siteMap = {
  1: 'dcs',
  2: 'pre',
  3: projectName === 'sdy' ? 'goc' : projectName,
}

try {
  shell.exec(`node initData.js ${projectName} ${siteMap[projectSite]}`)
  console.log(`quasar dev --site=${siteMap[projectSite]} --env=wsdy-${Number(projectSite) === 1 ? 'test' : 'prod'}`)
  shell.exec(`quasar dev --site=${siteMap[projectSite]} --env=wsdy-${Number(projectSite) === 1 ? 'test' : 'prod'}`)
} catch (err) {
  console.log(err)
}
