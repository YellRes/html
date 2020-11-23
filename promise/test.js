const p1 = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve(p1), 1000)
})

p2
.then(result =>  console.log(result) )
.catch(error =>  console.log(error) )

const s1 = new Promise((resolve, reject) => {
  resolve('promise1')
})

s1.then(res => {
  console.log(res);

  let p2 = new Promise((resolve, reject) => {
    resolve('promise2')
  })

  return p2
}).then(res => {
  console.log(res);
})