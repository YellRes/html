
const http = require('http');

const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1e10; i++) {
    sum += i;
  }
  return sum
}

const server = http.createServer()
server.on('request', (req, res) => {
  console.info('计算开始', new Date());
  const sum = longComputation()
  console.info('计算结束', new Date());
  return res.end(`Sum is ${sum}`)
})

server.listen(3000)