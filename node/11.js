// 了不起的nodejs
// process.stdout.write('hello world')
const fs = require('fs')
const path = require('path')

fs.readdir(process.cwd(), (err, files) => {
  console.log('');

  if (!files.length) {
    return console.log('  no file to show ')
  }

  console.log(' select which file or directory to you want to see');

  function file(i) {
    var filename = files[i]

    fs.stat(path.join(__dirname, filename), (err, stat) => {
      if (stat.isDirectory()) {
        console.log('   ' + i+ '  \033[36m' + filename + '/\033[39m');
      } else {
        console.log('   ' + i+ '  \033[90m' + filename + '/\033[39m');
      }

      i++
      if (i === files.length) {
        console.log('');
        process.stdout.write('  \033[33mEnter your choice: \033[39m')
        process.stdin.resume()
      } else {
        file(i)
      }
    })
  }

  file(0)
})


var start = Date.now()

setTimeout(function() {
  console.log(Date.now() - start);

  for (var i = 0; i < 10000000000000; i++) {}
}, 1000)

setTimeout(function() {
  console.log(Date.now() - start);
}, 2000)


function c() {
  b()
}

function b() {
  a()
}

function a() {
  setTimeout(function() {
    throw new Error('here')
  }, 10)
}

c()

var EventEmitter = require('events').EventEmitter
a = new EventEmitter()

a.on('event', function () {
  console.log('event called');
})

a.emit('event')

// console.log(EventEmitter);
