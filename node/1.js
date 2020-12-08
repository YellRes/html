const { Readable } = require('stream')

const dataSource = ['a', 'b', 'c']

const readable = Readable()
// readable._read = function() {
//     if (dataSource.length) {
//         this.push(dataSource.shift())
//     } else {
//         this.push(null)
//     }
// }
readable._read = function () {
    process.nextTick(() => {
        if (dataSource.length) {
            this.push(dataSource.shift())
        } else {
            this.push(null)
        }
    })
}

readable.pause()
readable.on('data', data => process.stderr.write('\ndata: ' + data))

// var data = readable.read()
// while(data !== null) {
//     process.stdout.write('\nread: ' + data)
//     data = readable.read()
// }

readable.on('readable', function() {
    while(null !== readable.read()) ;
})


let fs = require('fs')
let path = require('path')
let result = ''

let rs = fs.createReadStream(path.join(__dirname, '1.txt'), {
    highWaterMark: 3
})


// rs.on('data', function (chunk) {
//     result += chunk.toString()
// })
rs.on('readable', function(chunk) {
    result += (rs.read(3) ? rs.read(3).toString() : '')
})

rs.on('end', function (chunk) {
    console.log(result);
})

// rs.on('readable', function(data) {
//     console.log(rs.read(3));
//     console.log(rs._readableState.length);
// })


