const fs = require('fs-extra')
const path = require('path')
const readlineSync = require('readline-sync')

const toPath = url => path.resolve(__dirname, url)

let projectName = process.argv[2]
let projectSite = process.argv[3]

if (!projectName) {
  projectName = readlineSync.question('请输入项目名称（如：mb2 等）: ')
  projectSite = readlineSync.question('请输入打包环境名称（如：dcs, pre, mb2 等）: ')
} else {
  const map = {
    sdy: 'goc',
  }
  projectSite = map[projectSite] || projectSite
}


// eslint-disable-next-line import/no-dynamic-require

console.log('配置当前站点信息')
function readySiteConfig() {
  let outSiteSitePath = `./configs/sites/${projectSite}.js`
  const projectSiteConfig = toPath(`./configs/sites/${projectName}/${projectSite}.js`)
  // const outSiteSiteConfig = toPath(outSiteSitePath)
  if (fs.existsSync(projectSiteConfig)) {
    fs.writeFileSync(toPath(outSiteSitePath), fs.readFileSync(projectSiteConfig), { encoding: 'utf-8' })
  }
}
readySiteConfig()
