const fs = require('fs-extra')
const path = require('./utils/toPath')

module.exports = (ctx) => {
  const toPath = path(ctx)
  const isIOS = ctx.opts.platforms[0] === 'ios'
  const pSitePath = toPath('./platforms/pSite.json')
  let plat = 'sdy'
  if (fs.existsSync(pSitePath)) {
    const fd = fs.readFileSync(pSitePath, 'utf8')
    plat = JSON.parse(fd).template
  }
  let sourcePath = toPath('./platforms/android/app/src/main/assets/www')
  if (isIOS) sourcePath = toPath('./platforms/ios/www')
  const imgsPath = `${sourcePath}/img/src/assets/images`
  const templatesPath = `${sourcePath}/img/src/pages`
  const wwwImg = toPath('./www/img/src/assets/images')
  const wwwPage = toPath('./www/img/src/pages')
  const removeFilePaths = [imgsPath, templatesPath, wwwImg, wwwPage]
  removeFilePaths.forEach((sp) => {
    try {
      if (fs.existsSync(sp)) {
        const files = fs.readdirSync(sp)
        const removes = files.filter(item => (item !== plat && item !== 'common'))
        removes.forEach(file => fs.removeSync(`${sp}/${file}`))
      }
    } catch (err) {
      console.log(err)
    }
  })
}
