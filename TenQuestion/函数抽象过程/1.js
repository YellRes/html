let once = (fn) => {
  
  return (...args) => {
    if (fn) {
      let res = fn.call(this, ...args)
      fn = null
      return res
    }
  }
}

let fn = () => {
  console.log('more money, more modify');
}

let f = once(fn)()
f()
f()
f()
f()
f()


