## 概述
浏览器中的父窗口与iframe的postMessage通信，可以理解为一种消息模型。
iframe（client）向父窗口（server）发出请求（client.request），父窗口监听（server.on）到请求后，经过一系列的操作，将结果响应（server.response）给iframe；或者父窗口主动推送（server.response）数据给iframe，iframe监听（client.on）到推送后，进行后续操作。

## Feature
* ES5，支持所有支持ES5浏览器
* client未加载时，支持server消息离线缓存
* client request 超时机制

## 安装

```
npm i post-message-im
```

## Client 使用

```
import { Client } from 'post-message-im'

// 或者单独加载Client部分代码
// import Client from 'post-message-im/dist/client'

const client = new Client({
    id: '', // 通过此id找到frame window对象
    appKey: '',
    jsTicket: ''
})

client.request({
    type: '', // 请求类型
    params: { // 针对请求类型相关的参数
        
    },
    callback: (res) => { // 返回值
        
    }
})

client.on({
    type: '', // 监听类型
    callback: (res) => { // 返回值
        
    }
})

// 拉取离线消息
client.request({
    type: client.CONSTANTS.TYPE.OFFLINE, // 请求类型
    params: { // 针对请求类型相关的参数
        
    },
    callback: (res) => { // 返回值
        // 离线消息可能积攒了多个，可自行选择如何处理
        client.distribute(res[0]); // 分发某个离线消息到对应on事件
        // client.distribute(res); // 分发所有离线消息到对应on事件
    }
})
```

callback返回值

```
{
    rescode: 0, // 0 正确 401 鉴权失败 403 用户未授权 404 协议类型错误，协议过期 408 超时
    data: {
        // 接口相关返回值
    }
}
```

##  Server 使用

```
import { Server } from 'post-message-im'

// 或者单独加载Server部分代码
// import Server from 'post-message-im/dist/server'

const server = new Server({
    // 会将client初始化的信息，传给validator函数，支持异步
    validator: () => {}
})

// 注册事件，监听来自client的request
server.on({
    type: '', // 监听类型
    callback: (res) => { // 返回值
        // server收到监听后，进行相关处理，得到结果data
        server.response(Object.assign({}, res, {data: data}))
    }
})

// server主动向client推送数据，client不在线时，支持离线消息缓存
server.response('frameId', server.CONSTANTS.TYPE.SOME_SPECIFIC_TYPE, data)

// server数据格式，建议与上述「callback返回值」保持一致
```