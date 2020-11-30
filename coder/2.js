// function sleep(ms) {
//     return new Promise( resolve => {
//         setTimeout(resolve, ms)
//     })
// }


// async function getData() {
//     await sleep(1500)
//     return {
//         name: 'yellres',
//         age:23
//     }
// }

// async function isBind() {
//     await sleep(2000)
//     return {
//         logger: '成功登录'
//     }
// }

// function isBindFunc (cb) {
//     return function () {
//         isBind
//     }
// }

// ================= 箭头函数

let a = {
    value: '我是个对象',
    success: function (val){
        console.log(77, this);
    }
}

let b = {
    value: '我是个对象',
    success: (val) => {
        console.log(88, this);
    }
}

var cc = a.success
cc()
console.log(3333, this)


var c = b.success
c()
console.log(3333, this)
// ============= await 

function first() {
    let a = {}
    return new Promise((resolve, reject) => {
        setTimeout(() => {  
            if (a.b = 100) {
                console.log(444444)
                return reject('error')
            }
            return resolve('success')
        }, 2000)
    }).catch()
}

function second() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('secondsecondsecondsecond')
        }, 3000)
    })
}


async function united() {
    try {
        let a = await first()
        console.log(555111, a);
        let b = await second()
        console.log('ababab');
    } catch(err) {
        console.log(666, err)
    }
    
}

united()

// async function a() {
//     let obj = await first()

// }

// a()






