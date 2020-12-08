const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process
let filesArr  = null

fs.readdir(process.cwd(), function (err, files) {
  console.log('');
  filesArr = files
  if (!files.length) {
    return console.log('no file to show')
  }

  console.log(' select which file or directory you want to see');

  function file(i) {
    var filename = files[i]

    fs.stat(path.join(__dirname, filename), function (err, stat) {
      if (stat.isDirectory()) {
        console.log('   ' +i+'  \033[36m' + filename + '/\033[39m');
      } else {
        console.log('   ' +i+'  \033[90m' + filename + '/\033[39m');
      }

      i++
      if (i === files.length) {
        read()
      } else {
        file(i)
      }
    })
  }

  file(0)
})

function read() {
  console.log('');
  stdout.write('    \033[33m Enter your choice: \033[39m')
  stdin.resume()
  stdin.setEncoding('utf8')
  stdin.on('data', option)
}

function option(data) {
  let filename = filesArr[Number(data)]
  if (!filename) {
    stdout.write('   \033[31m Enter your choice: \033[39m')
  } else {
    stdin.pause()
    fs.readFile(path.join(__dirname, filename), 'utf8', (err, data) => {
      console.log('');
      console.log('\033[90m' + data.replace(/(.*)/g, '   $1') + '\033[39m');
    })
  }
}