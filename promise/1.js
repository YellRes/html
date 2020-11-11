function PromiseA(fn) {
  let value = null
  let callBackArr = []
  let state = 'pending'
  
  this.then = function (callBack) {
    if (state === 'pending') {
      callBackArr.push(callBack)
      return this
    }
    callBack(value)
    return this
  }

  function resolve(newValue) {
    value = newValue
    state = 'fulfilled'
    setTimeout(function () {
      callBackArr.forEach(item => {
        item(value)
      })
    }, 0)

  }

  fn(resolve)
}

class PromiseA {
  callbacks = []

  constructor(fn) {
    fn(this._resolve.bind(this))
  }

  then(arr) {
    this.callbacks.push(arr) 
  }

  _resolve(value) {
    this.callbacks.forEach(item => item(value))
  }

}

let p = new PromiseA(resolve => {

  setTimeout(() => {
    console.log('done');
    resolve('5秒');
  }, 5000)

}).then(tip => {
  console.log(tip);
})
// https://zhuanlan.zhihu.com/p/58428287