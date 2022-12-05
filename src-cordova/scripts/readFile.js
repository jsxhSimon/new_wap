const fs = require('fs')

function readFile(filePath, sucFn, failFn) {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      if (failFn) {
        failFn(err)
      }
      throw err
    }
    const res = JSON.parse(data.toString())
    if (sucFn) {
      sucFn(res)
    }
  })
}

module.exports = readFile
