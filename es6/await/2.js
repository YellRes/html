// async 返回一个promise对象
// 1. 返回的非promise 对象会被 包装成 promise 
// 2. 返回的promise 会被调用
async function first() {
    return 2
}

let a = first()
a.then(v => console.log(v))

async function first2() {
    return new Promise((resolve, reject) => {
        resolve(12)
    })
}

// 内部出现异常

async function first1() {
 
    throw new Error('error happen!!')
}

first1()
    .then(v => console.log(v, 'thenthen'))
    .catch(e => console.log(e, 'catchcatch'))

// await
// await后面 正常情况下是一个promise 对象
// 若 return await 123  === return 123 

async function second() {
    return await 123
}

second().then(v => console.log(v))



// await 是一个thenable 对象 (定义了then方法的对象)
// await 会把他当成promise 来处理

class Sleep {

    constructor(timeout) {
        this.timeout = timeout
    }

    then(resolve, reject) {
        const startTime = Date.now()
        setTimeout(
            () => resolve(Date.now() - startTime),
            this.timeout
        )
    }
}


(async () => {
    const sleepTime = await new Sleep(1000)
    console.log(sleepTime);
})()


// await 休眠语法
function sleep(interval) {
    return new Promise(resolve => {
        setTimeout(resolve, interval)
    })
}

async function one2FiveInAsync() {
    for (let i = 1; i <= 5; i++) {
        console.log(i)
        await sleep(1000)
    }
}

one2FiveInAsync()

// async 中 await 出现错误 会阻断后面所有的await的运行
// 给await 中的 promise 添加catch 方法