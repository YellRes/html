
// resolve 处理的promise 
// 支持链式调用
class PromiseMy {
  value = null
  state = 'pending'
  callBackArr = []

  constructor(fn) {
    fn(this.resolve.bind(this))
  }

  resolve(value) {
    if (value && (typeof value === 'object' || typeof value === 'function')) {
      let then = value.then
      if (typeof then === 'function') {
        then.call(value, this.resolve.bind(this))
        return
      }
    }
    this.value = value
    this.state = 'fulfilled'
    this.callBackArr.forEach(item => {
      this.handle(item)
    })
  }

  then(onfulfilled) {
    return new PromiseMy(resolve => {
      this.handle({
        onfulfilled,
        resolve
      })
    })
  }

  handle(callBackObj) {
    if (this.state === 'pending') {
      this.callBackArr.push(callBackObj)
      return
    }

    if (!callBackObj.onfulfilled) {
      callBackObj.resolve(this.value)
      return
    }

    let res = callBackObj.onfulfilled(this.value)
    callBackObj.resolve(res)
  }
}

let p = new PromiseMy((resolve) => {
    resolve('promise')
}) 
p.then(res => {
  console.log(res + '1');
}).then(res => {
  console.log(res + '2');
}).then(res => {
  console.log(res + '3');
})
