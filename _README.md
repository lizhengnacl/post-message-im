## dx frame sdk

## 模型

### 拉模型
frame主动向上层请求数据
每次请求都唯一，用meta字段标识，上层不用关心meta字段

## 参数

### 初始化
```
new S({
    id: '', // 定位frame window
    appKey: '',
    jsTicket: ''
})
```

### 拉模型

#### 请求参数 request
```
{
    type: '',
    params: {
        id: '' // 参数尽量只做透传
    },
    callback: (res) => {},
    meta: {
        uuid: '', // 标识请求唯一性
        requestTime: '', // 发起时间，做超时检测；选人面板这种的不做超时检测
        model: 'pull' // 主动从大象拉取数据
    },
    token: {
        id: '',
        appKey: '',
        jsTicket: ''
    }
}
```

#### 请求参数 返回值
```
{
    type: '',
    params: {
        id: '' // 参数尽量只做透传
    },
    callback: (res) => {},
    meta: {
        uuid: '', // 标识请求唯一性
        requestTime: '' // 发起时间，做超时检测；选人面板这种的不做超时检测
    },
    data: {
        // 大象返回值
    },
    token: {
        id: '',
        appKey: '',
        jsTicket: ''
    }
}
```

#### callback res
```
{
    rescode: 0, // 0 正确 401 鉴权失败 408 超时 404 协议类型错误，协议过期
    data: {
        
    }
}
```

### 推模型，通过拉离线消息实现，本质还是拉模型，只是上层需要做缓存
```
.on({
    type: '',
    callback: (data) => {}
})

// data 数据格式
{
    type: '',
    token: {
        id: ''
    }
    data: ''
}
```

## 通道


========== Server部分 ==================== Server部分 ==================== Server部分 ==================== Server部分 ==================== Server部分 ==========


## 消息协议

## 初始化
```
new Server({
    validate: ({appKey, jsTicket}) => {}
})
```

## on 监听来自frame的请求数据

注册监听事件
```
server.on({
    type: '',
    callback: (data) => {}
})

// data数据格式
{
    "type": "",
    "params": {
        "id": ""
    },
    "meta": {
        "uuid": "1412b9dc-0e1d-71cc-867a-81fbcc5de7e4",
        "requestTime": 1527347858383,
        "model": "pull"
    },
    "token": {
        "id": "",
        "appKey": "",
        "jsTicket": ""
    }
}

// 大象处理完数据后，在parent.on的注册函数中使用parent.response接口，分发出去
```

## response 响应来自frame的请求；主动向frame发送数据

响应来自frame的请求，这种一般有on的上下文

```
// 接口形式
response({
    type: '',
    params: {},
    meta: {},
    token: {
        id: ''
    },
    data: {},
});

// 最终数据，基于传入的数据，挂在data
Object.assign({}, data, {data: {}})

// 数据格式
{
    "type": "",
    "params": {
        "id": ""
    },
    "meta": {
        "uuid": "1412b9dc-0e1d-71cc-867a-81fbcc5de7e4",
        "requestTime": 1527347858383,
        "model": "pull"
    },
    "token": {
        "id": "",
        "appKey": "",
        "jsTicket": ""
    },
    data: {
        
    }
}
```

主动向frame推送数据，这种一般是独立响应frame的监听事件

```
// 接口形式
response(frameId, {
    type: '',
    data: {}
});

// 最终数据
{
    "type": "",
    data: {
        
    },
    "token": {
        "id": '' // 这个是必须要的，通过这个找到frame window
    }
}
```

## 鉴权
鉴权发生在on中
鉴权函数暴露出去，支持异步


## TODO 
1. Parent部分支持异步 `done`
2. Child超时机制 `todo`
3. 类型版本控制，遗弃 `done`
4. 建立链接的过程 `todo`