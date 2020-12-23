
function awaitContainer(fn) {
    return fn
        .then(res => [res, null])
        .catch(err => [null, err])
}

// 判断 await 后 promise 的状态变化
function randomPromise() {
    return new Promise((resolve, reject) => {
        let result = Math.random()
        if (result > 0.5) {
            resolve('大于0.5的值： ' + result)
        } else {
            reject('小于0.5：' + result)
        }
    })
}

async function test() {
    let [result, err] = await awaitContainer(randomPromise())
    console.log(result, err);
}

test()


