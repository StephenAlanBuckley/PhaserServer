const fs = require('fs')

console.log(walk('static/js/'))

function walk(dir, files = []) {
  let walkIndex = 0
  let allClientJsFiles = fs.readdirSync(dir)

  //no dot files
  allClientJsFiles = allClientJsFiles.filter(function(filename) {
    if (filename.charAt(0) == '.') {
      return false
    }
    return true
  })

  allClientJsFiles.forEach(function(filename) {
    if (filename.slice(-3) == '.js') {
      files.push(dir + filename)
    } else {
      files = walk(dir + filename + "/", files)
    }
  })
  return files
}
