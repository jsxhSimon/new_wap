/**
 * @function 返回指定路径下文件/文件夹名称列表
 * @description 只遍历一层，不会递归遍历很多层文件目录
 * @param srcPath {Path} 文件夹路径
 * @param type {String} 文件类型 file:文件   directory:文件夹   all:文件+文件夹
 * @return Array
 * @example
 * [{
 *    fileName:'src-cordova',
 *    filePath:'/wsdy-coapp/src-cordova',
 *    type:'directory'
 * },{
 *    fileName:'package.json',
 *    filePath:'/wsdy-coapp/package.json',
 *    type:'file'
 * }]
 */
var fs = require("fs");

function getFilesName(srcPath, type='all'){
  let result = []
  const files = fs.readdirSync(srcPath)
  files.forEach(function (item) {
    let stat = fs.lstatSync(srcPath + '/' +item)
    if (type === 'file' && !stat.isDirectory()) {
      result.push({
        fileName: item,
        filePath: srcPath + '/' +item,
        type:'file'
      })
    }
    if (type === 'directory' && stat.isDirectory()) {
      result.push({
        fileName: item,
        filePath: srcPath + '/' +item,
        type:'directory'
      })
    }
    if (type === 'all') {
      if (!stat.isDirectory()) {
        result.push({
          fileName: item,
          filePath: srcPath + '/' +item,
          type:'file'
        })
      } else {
        result.push({
          fileName: item,
          filePath: srcPath + '/' +item,
          type:'directory'
        })
      }
    }
  })
  return result
}

module.exports = getFilesName
