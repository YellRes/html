const fs = require('fs')
const EventEmitter = require('events')
const LinkList = require('./linkList1')

class Queue {
    constructor() {
        this.linkList = new LinkList() 
    }

    offer(element) {
        this.linkList.add(element)
    }

    poll() {
        return this.linkList.remove(0)
    }

}


class WriteStream extends EventEmitter{

    constructor(path, options) {
        super()
        this.path = path
        this.flags = options.flags || 'w'
        this.autoClose = options.autoClose || true
        this.encoding = ooptions.encoding || 'utf8'
        this.start = options.start || 0
        this.mode = options.mode || 0o666
        this.highWaterMark = options.highWaterMark || 16 * 1024

        // 维护当前的数据个数
        this.len = 0
        this.writing = false
        this.needDrain = false
        this.offset = this.start

        this.cache = new Queue() // 多次的缓存操作  除了第一次
        
        this.open()
    }

    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if (err) return this.emit('error', err)

            this.fd = fd
            this.emit('open', fd)
        })
    }

    write(chunk, encoding = 'utf8', cd = () => {}) {
        
    }
}

module.exports = WriteStream