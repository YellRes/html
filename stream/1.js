const Readable = require('stream').Readable

class ToReadable extends Readable {
  constructor(iterator) {
    super()
    this.iterator = iterator
  }

  _read() {
    const res = this.iterator.next()
    if (res.done) {
      return this.push(null)
    }
    setTimeout(() => {
      this.push(res.value + '\n')
    }, 0)
  }
}

const iterator = function (limit) {
  return {
    next: function () {
      if (limit--) {
        return {done: false, value: limit + Math.random()}
      }

      return {done: true}
    }
  }
}(1e10)


const readable = new ToReadable(iterator)

readable.on('data', data => process.stdout.write(data))
readable.on('end', () => process.stdout.write('DONE'))

//https://www.barretlee.com/blog/2017/06/06/dive-to-nodejs-at-stream-module/

const fs = require('fs')
const path = require('path')

let rs = fs.createReadStream(path.join(__dirname, '1to10.txt'), {
  highWaterMark: 3
})

rs.on('readable', data => {
    rs.read(3)
    console.log(rs._readableState.length);
})


