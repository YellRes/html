function shuffle(items) {
  return items.sort((a, b) => Math.random() > 0.5 ? -1 : 1)
}

const p1 = new Promise(resolve => {
  setTimeout(() => {
    resolve('2000ms--后')
  }, 2000)
})

const p2 = new Promise(resolve => {
  setTimeout(() => {
    resolve('4000ms--后')
  }, 4000)
})


async function daoba() {
    let a = await p1
    console.log(a);
    let b = await p2

    console.log('测试下 await 的用法')
    console.log(a);
    console.log(b);
  } 

  daoba()
