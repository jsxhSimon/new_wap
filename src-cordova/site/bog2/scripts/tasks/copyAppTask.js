const shell = require('shelljs')
const path = require('path')

function copyAppTask(nextFn){
  const {platform, projectName, projectSite} = this
  const appNameMap = {
    'sdy':'SDY体育',
    'bog2':'博冠体育',
    'jun':'君博体育',
    'bw2':'澳博体育',
    'ysz':'悟空包网',
    'hbx':'浩博体育',
    'mbs': '名博体育',
    'bw1': '澳世娱乐城',
    'mgm': '美高梅娱乐城',
  }
  const siteOutMap = {
    1: 'dcs',
    2: 'pre',
    3: 'prod',
  }
  const siteMap = {
    1: '-dcs',
    2: '-pre',
    3: '',
  }
  const iosPath = path.resolve(__dirname, `../../platforms/ios/config/ipa-app-store/${appNameMap[projectName]}.ipa`)
  const androidPath = path.resolve(__dirname, `../../platforms/android/app/build/outputs/apk/release/app-release.apk`)
  let commandSql = ''
  if (platform == 1){
    commandSql = `mkdir -p appDist/${siteOutMap[projectSite]} && cp ${iosPath} ./appDist/${siteOutMap[projectSite]}/${projectName==='bog2'?'bog':projectName}${siteMap[projectSite]}.ipa`
  } else {
    commandSql = `mkdir -p appDist/${siteOutMap[projectSite]} && cp ${androidPath} ./appDist/${siteOutMap[projectSite]}/${projectName==='bog2'?'bog':projectName}${siteMap[projectSite]}.apk`
  }
  shell.exec(
    commandSql,
    {silent:false},
    function(code){
      if(code === 0){
        nextFn()
      }else{
        const msg = `拷贝单个厅主app失败-${platform}-${projectName}-${projectSite}`
        throw msg
      }
    }
  );
}

module.exports = copyAppTask;
