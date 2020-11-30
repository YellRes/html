const fs = require('fs')
const path = require('path')

// Events 1. 默认清空文件   2. 文件不存在创建文件
// fs.open  fs.write
let ws = fs.createWriteStream(path.resolve(__dirname, 'name.txt'), {
    flags: 'w',
    encoding: 'utf8',
    mode: 0o666,
    autoClose: true,
    start: 0,
    highWaterMark: 16 * 1024
    // 超过预期 返回false
})

// drain 触发的条件是 1. 必须达到预期或者超过预期 2. 内存中的内容全部清空会触发 drain
ws.write('hello', () => {
    console.log('成功');
})


ws.write('world', () =>{ 
    console.log('成功2');
})

ws.end('!!!', () => {
    console.log('成功3');
})
// ws.write() 
// ws.end()
// ws.on('drain', () =>  {})

// ws.open()
// ws.close()

