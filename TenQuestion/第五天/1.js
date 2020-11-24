function defer() {
  const deferred = {}
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })

  return deferred
}

const deferred = defer()
deferred.resolve()

const _state = Symbol('state')
const _checkers = Symbol('checkers')

class Signal {
  constructor(initState) {
    this[_state] = initState
    this[_checkers] = new Map()
  }

  get state() {
    return this[_state]
  }

  set state(value) {
    [...this[_checkers]].forEach(([promise, {type, deferred, state}]) => {
      if (type === 'while' && value !== state || type === 'until' && value === state) {
        deferred.resolve(value)
        this[_checkers].delete(promise)
      }
    })
    this[_state] = value
  }

  while (state) {
    const deferred = defer()
    if (state !== this[_state]) {
      deferred.resolve(this[_state])
    } else {
      
    }
  }
}