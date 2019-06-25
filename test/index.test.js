/**
 * * Created by lee on 2018/5/26
 * 确定postMessage的输入和输出，可以模拟数据的收发过程，从而模拟测试
 */

/*global test*/
/*global expect*/
// const Client = require('../dist/client');
// const Server = require('../dist/server');
const {Client, Server, CONSTANTS} = require('../dist/main');

let client = new Client({
    id: '',
    appKey: '',
    jsTicket: '',
    __TEST__: true // 测试专用，其他情况下去掉
});

function serialize (data) {
    return JSON.parse(JSON.stringify(data))
}

test('client pull, post message to server and get message from server', () => {

    let userData = {
        type: '',
        params: {
            id: ''
        },
        callback: (res) => {}
    };

    let requestData = client.request(userData);
    // 注销掉真实的发送过程

    // 经过大象处理完后的数据
    let response = {
        rescode: 0,
        data: {
            someData: ''
        }
    };
    let responseData = Object.assign({}, requestData, { data: response });
    responseData = serialize(responseData);

    let responseDataFromParent = {
        "type": "",
        '$$symbol': 'DX_FRAME_SDK',
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
        "data": {
            "rescode": 0,
            "data": {
                "someData": ""
            }
        }
    };
    expect(Object.keys(responseData).length).toEqual(Object.keys(responseDataFromParent).length);

    // postMessage接收到数据后，会分发给后续处理，这里假设正常接收数据，继续走后面的流程
    let callbackData = client.distribute(responseData);
    expect(callbackData).toEqual(response);
});

test('client monitor, just get message from server', () => {
    let count = 0;

    let userData = {
        type: '',
        params: {
            id: ''
        },
        callback: (res) => {
            count++;
        }
    };

    // 注册事件
    let requestData = client.on(userData);
    // 重复注册
    client.on(userData);

    // 经过大象处理完后的数据
    let response = {
        rescode: 0,
        data: {
            someData: ''
        }
    };
    let responseData = Object.assign({}, requestData, { data: response }, { '$$symbol': 'DX_FRAME_SDK' });
    responseData = serialize(responseData);

    let responseDataFromParent = {
        "type": "",
        '$$symbol': 'DX_FRAME_SDK',
        "params": {
            "id": ""
        },
        "data": {
            "rescode": 0,
            "data": {
                "someData": ""
            }
        }
    };
    expect(Object.keys(responseData).length).toEqual(Object.keys(responseDataFromParent).length);

    // postMessage接收到数据后，会分发给后续处理，这里假设正常接收数据，继续走后面的流程
    let callbackData = client.distribute(responseData);
    expect(callbackData).toEqual(response);
    // 重复注册，重复响应
    expect(count).toEqual(2);
});

test('server monitor', () => {
    let server = new Server({
        validator: ({ appKey, jsTicket }) => {}
    });
    // 注册事件
    let monitor = {
        type: '',
        callback: (data) => {
            // 进行一系列的处理，然后将结果数据挂载到data上
            let d = server.response(Object.assign({}, data, { data: { someData: 'from server' } }));

            // 假设发射成功
            client.distribute(d);
        }
    };
    server.on(monitor);

    // 接受来自child的请求
    let userData = {
        type: '',
        params: {
            id: ''
        },
        callback: (res) => {
        }
    };

    let requestData = client.request(userData);

    // parent收到请求，分发请求
    server.distribute(serialize(requestData));
});

test('server response', () => {
    let server = new Server({
        validator: ({ appKey, jsTicket }) => {}
    });
    // 主动推送
    let d = server.response('type', 'id', { someData: 'from server' });
});

test('server offline', () => {
    let server = new Server({
        validator: ({ appKey, jsTicket }) => {
            return new Promise((resolve) => {
                resolve(false);
            });
        }
    });
    let client = new Client({
        id: 'id',
        appKey: '',
        jsTicket: '',
        __TEST__: true // 测试专用，其他情况下去掉
    });
    server.response('id', 'type', { someData: 'from server' });
    server.response('id', 'type', { someData: 'from server' });
    expect(server.offlinePool['id'].length).toEqual(2);

    let userData = {
        type: 'offline',
        params: {
            id: ''
        },
        callback: (res) => {
            count++;
        }
    };
    let requestData = client.request(userData);
    server.distribute(requestData);

    // 如果发送离线消息失败，则会将离线数据重新归位
    expect(server.offlinePool['id'].length).toEqual(2);
});
