// const { read } = require("fs/promises");
// const { Writable } = require('stream')

// const outStream = new Writable({
//   write(chunk, encoding, callback) {
//     console.log(chunk.toString());
//     callback()
//   }
// })

// process.stdin.pipe(outStream)

// const { Readable } = require('stream')
// // const inStream = new Readable({})

// // inStream.push('ABDDBJDJBLKLKLLL');
// // inStream.push('NOPUNBHYTGFGVDSC');
// // inStream.push(null)

// // inStream.pipe(process.stdout)

// const inStream2 = new Readable({
//   read(size) {
//     this.push(String.fromCharCode(this.currentCharCode++))
//     this.currentCharCode > 90 && this.push(null)
//   }
// })

// inStream2.currentCharCode = 65
// inStream2.pipe(process.stdout)
// console.log('/n')


// const { Duplex } = require('stream')

// const inoutStream = new Duplex({
//   write(chunk, encoding, callback) {
//     console.log(chunk.toString());
//     callback()
//   },

//   read(size) {
//     this.push(String.fromCharCode(this.currentCharCode++))
//     this.currentCharCode > 90 && this.push(null)
//   }
// })

// inoutStream.currentCharCode = 65
// process.stdin.pipe(inoutStream).pipe(process.stdout)

const fs = require('fs')

const rs = fs.createReadStream(__dirname + '/name.txt', 'utf-8')

rs.on('data', (chunk) => {
  console.count('流执行了')
  console.log('Data: ');
  console.log(chunk);
})

rs.on('end', () => {
  console.log('end');
})

rs.on('error', (err) => {
  console.log('error: ' + err);
})

// const ws1 = fs.createWriteStream(__dirname + '/sample1.txt', 'utf-8')
// ws1.write('hellllllllllo, worllllllllllllllllld\n')
// ws1.write('END')
// ws1.end()

// const ws2 = fs.createWriteStream(__dirname + '/sample2.txt')
// ws2.write(Buffer.from('hellllllllllo, worllllllllllllllllld\n', 'utf-8'))
// ws2.write(Buffer.from('END', 'utf-8'))
// ws2.end()

// const fs = require('fs')

// const rs = fs.createReadStream(__dirname + '/sample1.txt')
// const ws = fs.createWriteStream(__dirname + '/copied.txt')

// rs.pipe(ws)




