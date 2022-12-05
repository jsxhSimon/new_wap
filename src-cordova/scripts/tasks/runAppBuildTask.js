const shell = require('shelljs');

function runAppBuildTask(nextFn){
  const {platform, projectName, projectSite} = this
  const commandSql = `node appBuild.js ${platform} ${projectName} ${projectSite}`
  shell.exec(
    commandSql,
    {silent:false},
    function(){
      nextFn()
    }
  );
}

module.exports = runAppBuildTask;
