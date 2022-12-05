const path = require('path');
const shell = require('shelljs');
var chalk = require("chalk");

function buildOneTask(nextFn, Task){
  const {platform, projectName, projectSite} = this
  const platformString = {
    1:'ios',
    2:'android',
  }[platform]
  const projectSiteString = {
    1:'dcs',
    2:'pre',
    3:'rc/prod',
  }[projectSite]

  const appBuildOnePath = path.resolve(__dirname, '../../../appBuildOne.js')
  let commandSql = `node ${appBuildOnePath} ${platform} ${projectName} ${projectSite}`
  shell.exec(
      commandSql,
      {silent:false},
      function(code){
          if(code === 0){
              Task.success_arr.push(`${platformString}-${projectName==='bog2'?'bog':projectName}-${projectSiteString}`);
              console.log(chalk.bold.green(`打包${platformString}-${projectName==='bog2'?'bog':projectName}-${projectSiteString}厅主成功！`));
          }else{
              Task.fail_arr.push(`${platformString}-${projectName==='bog2'?'bog':projectName}-${projectSiteString}`);
              console.log(chalk.bold.red(`打包$${platformString}-${projectName==='bog2'?'bog':projectName}-${projectSiteString}厅主失败！`));
          }
          nextFn()
      }
  );
}

module.exports = buildOneTask;
