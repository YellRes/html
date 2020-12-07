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




