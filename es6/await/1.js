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
    }).catch(err => err)
}

function second() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('secondsecondsecondsecond')
        }, 3000)
    })
}


async function united() {

    let a = await first()
    console.log(555111, a);
    let b = await second()
    console.log('ababab', b);
   
}

united()
