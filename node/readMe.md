### nodejs 流

用Readable创建对象readable后，便得到了一个可读流
如果实现_read方法，就将流连接到一个底层数据源。
流通过调用_read向底层请求数据，底层再调用流的push方法将需要的数据传递过来。
下游便可以调用readable.read(n)向流请求数据
同时监听readable的data事件来接收取到的数据

1. data 事件
 内容从不停的流出可读流

2. readable 事件
flow = pasued 时候  readable + read 方法来读取数据