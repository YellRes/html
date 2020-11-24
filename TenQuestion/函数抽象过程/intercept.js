function intercept(fn, { beforeCall = null, afterCall = null }) {
  return function (...args) {
    if (!beforeCall || beforeCall.call(this, args) !== false) {
      const ret = fn.apply(this, args)
      if (afterCall) return afterCall.call(this, ret)
      return ret
    }
  }
}

function sum(...list) {
  return list.reduce((a, b) => a + b)
}

sum = intercept(sum, {
  beforeCall(arg) {
    console.log(`the arguments is ${arg}`)
    console.time(`sum`)
  },
  afterCall(arg) {
    console.log(`the result is ${arg}`);
    console.timeEnd(`sum`)
  }
})

sum(1, 2, 3, 4, 5)

function batch(fn) {
  return function (subject, ...args) {
    if (Array.isArray(subject)) {
      return subject.map(item => {
        return fn.call(this, item, ...args)
      })
    }

    return fn.call(this, subject, ...args)
  }
}

const setStyle = batch((el, key, value) => {
  el.style[key] = value
})

function H0F0(fn) {
  return function (...args) {
    return fn.apply(this, args)
  }
}

function continous(reducer) {
  return function (...args) {
    return args.reduce((a, b) => reducer(a, b))
  }
}