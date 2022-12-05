const path = require('path')

const toPath = ctx => url => path.resolve(ctx.opts.projectRoot, url)

module.exports = toPath
