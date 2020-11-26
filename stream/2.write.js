// 写10个数 占用一个字节内存

const fs = require('fs')
const path = require('path')
const WriteStream = require('./writeStream1')

let ws = new WriteStream(path.resolve(__dirname, 'name.txt'), {
    highWaterMark: 3
})

let index = 0

function write() {
    let flag = true
    while(flag && index < 10) {
        flag = ws.write(index+'')
        index++
    }

    if (index === 10) {
        ws.end('!!')
    }
}

write()

ws.on('drain', () => {
    console.log('drain');
    write()
})

ws.on('close', () => {
    console.log('close');
})


