const shell = require('shelljs')
const path = require('path')
const readFile = require('../readFile')
const writeFile = require('../writeFile')
const getFilesName = require('../getFilesName')

/* eslint-disable */
function checkCordovaSrcRight(nextFn){
  const {platform, projectName, projectSite} = this
  const srcPackage = path.resolve(__dirname, '../../package.json')
  const openinstallPlugin = {
    pluginName: "cordova-plugin-openinstall",
    version: "2.0.1",
    pluginValue: {
      "OPENINSTALL_APPKEY": "wwwwww",
      "OPENINSTALL_SCHEME": "wwwwww",
      "APPKEY": "wwwwww",
      "SCHEME": "wwwwww"
    }
  }
  const wsdyOpeninstallPlugin = {
    pluginName: "cordova-plugin-gzmj-wsdy",
    version: "1.0.2",
    pluginValue: {
      "APPKEY": "wwwwwwww",
      "SCHEME": "wwwwwwww"
    }
  }
  readFile(srcPackage, (packageContent)=>{
    let deleteName = ''
    let needName = ''
    if (projectName === 'goc' || projectName === 'sdy' || projectName === 'ysz') {
      deleteObj = wsdyOpeninstallPlugin
      needObj = openinstallPlugin
    } else {
      deleteObj = openinstallPlugin
      needObj = wsdyOpeninstallPlugin
    }
    if (packageContent.devDependencies[deleteObj.pluginName]) {
      delete packageContent.devDependencies[deleteObj.pluginName]
    }
    if (packageContent.cordova.plugins[deleteObj.pluginName]) {
      delete packageContent.cordova.plugins[deleteObj.pluginName]
    }
    if (!packageContent.devDependencies[needObj.pluginName]) {
      packageContent.devDependencies[needObj.pluginName] = needObj.version
    }
    if (!packageContent.cordova.plugins[needObj.pluginName]) {
      packageContent.cordova.plugins[needObj.pluginName] = needObj.pluginValue
    }
    const packageFix = JSON.stringify(packageContent, null,2)
    writeFile(srcPackage, packageFix, () => {
      setTimeout(() => {
        const pluginsDirs = getFilesName(path.resolve(__dirname, '../../plugins'), 'directory').map((item) => {
          return item.fileName
        })
        const nodeModulesDirs = getFilesName(path.resolve(__dirname, '../../node_modules'), 'directory').map((item) => {
          return item.fileName
        })
        if (pluginsDirs.indexOf(needObj.pluginName) !== -1 && nodeModulesDirs.indexOf(needObj.pluginName) !== -1) {
          nextFn()
        } else {
          const commandSql = `cd src-cordova && rm -rf ./plugins && rm -rf ./platforms && npm i && cd ..`
          shell.exec(
            commandSql,
            {silent:false},
            function(){
              nextFn()
            }
          )
        }
      }, 1000*5)
    })
  }, () => {
    throw('读取src-coordova下的package.json失败')
  })
}

module.exports = checkCordovaSrcRight;
