// promise的完全版
class PromiseMy {
  value = null
  state = 'pending'
  callBackArr = []

  constructor(fn) {
    fn(this.resolve.bind(this), this.reject.bind(this))
  }

  then(onFulfilled, onRejected) {
    return new PromiseMy((resolve, reject) => {
      this.handle({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      })
    })
  }

  resolve(value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled' 
      this.value = value
      this.callBackArr.forEach(item => {
        this.handle(item)
      })
    }
  }

  reject(value) {
    if (this.state === 'pending') {
      this.state = 'onReject' 
      this.value = value
      this.callBackArr.forEach(item => {
        this.handle(item)
      })
    }
  }

  handle(callBackObj) {
    if (this.state === 'pending') {
      this.callBackArr.push(callBackObj)
      return 
    }

    let cbOn = this.state === 'fulfilled' ? callBackObj.onFulfilled : callBackObj.onRejected
    let cbRe = this.state === 'fulfilled' ? callBackObj.resolve : callBackObj.reject

    if (!cbOn) {
      cbRe(this.value)
      return
    }

    let result = cbOn(this.value)
    cbRe(result)
  }
}

let p = new PromiseMy((resolve, reject) => {
  setTimeout(() => {
    reject('200')
  }, 100)
})

p.then(res => {
  console.log(res);
}, err => {
  console.log(err);
})