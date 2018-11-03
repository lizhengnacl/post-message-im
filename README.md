[![NPM version][npm-image]][npm-url]


## 概述
页面`server`与iframe`client`的通信过程，可以用一种简易的消息模型来理解。

## Feature
* 兼容所有支持ES5语法的浏览器
* 支持离线消息模型

## 安装

```
npm i post-message-im
```

## client 使用

```
import { Client } from 'post-message-im'

const client = new Client({id: 'iframe id'})

client.request({
    type: '', 
    params: {},
    callback: (res) => {}
})

client.on({
    type: '',
    callback: (res) => {}
})

client.request({
    type: 'offline',
    callback: (res) => {
        client.distribute(res);
    }
})
```

callback返回值

```
{
    rescode: 0, // 0 正确 401 鉴权失败 403 用户未授权 404 协议类型错误，协议过期 408 超时
    data: {}
}
```

##  server 使用

```
import { Server } from 'post-message-im'

const server = new Server({validator: () => {}})

server.on({
    type: '',
    callback: (res) => {
        // get data 
        server.response(Object.assign({}, res, {data: data}))
    }
})

server.response('frameId', server.CONSTANTS.TYPE.SOME_SPECIFIC_TYPE, data)
```


[npm-image]: https://img.shields.io/npm/v/post-message-im.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/post-message-im
