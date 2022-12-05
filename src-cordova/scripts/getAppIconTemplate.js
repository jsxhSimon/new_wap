// 根据sdy得出一个appIcon的json模板
// 使用gm这个插件，必须先要安装下面2个应用
// brew install imagemagick
// brew install graphicsmagick
const fs = require('fs')
const path = require('path')
const gm = require('gm')


function getFiles(srcPath, type='all'){
  let result = []
  const files = fs.readdirSync(srcPath)
  files.forEach(function (item) {
    let stat = fs.lstatSync(srcPath + '/' +item)
    if (type === 'file' && !stat.isDirectory()) {
      console.log(item)
      result.push({
        fileName: item,
        filePath: srcPath + '/' +item,
      })
    }
    if (type === 'directory' && stat.isDirectory()) {
      result.push({
        fileName: item,
        filePath: srcPath + '/' +item,
      })
    }
    if (type === 'all') {
      result.push({
        fileName: item,
        filePath: srcPath + '/' +item,
      })
    }
  })
  return result
}

const sdyIconIosPath = path.resolve(__dirname, '../site/mgm/res/ios')
const sdyIconAndroidPath = path.resolve(__dirname, '../site/mgm/res/android')

const sdyIconIosFiles = getFiles(sdyIconIosPath, 'file')
const sdyIconAndroidFiles = getFiles(sdyIconAndroidPath, 'file')

let iosIconPromise = []

sdyIconIosFiles.forEach((item) => {
  let p = new Promise((resolve, reject) => {
    gm(item.filePath).size(function (err, size) {
      if (!err) {
        item.width = size.width
        item.height = size.height
        resolve(item)
      }else {
        reject(err)
      }
    })
  })
  iosIconPromise.push(p)
})

Promise.all(iosIconPromise).then((result) => {
  result.forEach((item) => {
    gm(path.resolve(__dirname, '../site/mgm/res/icon-1024.png')).resize(item.width, item.height).write(path.resolve(__dirname, `../site/mgm/res/ios/${item.fileName}`), function(err){
      if(err){
        throw err;
      }else{
        console.log(`生成成功`);
      }
    })
  })
}).catch((error) => {
  console.log(error)
})
