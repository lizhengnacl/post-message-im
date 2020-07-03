import Client from '../../src/client';

/**
 * config
 */
const clientID = 'someId';
const someRequestName = 'somePushName';
const somePushName = 'somePushName';

const client = new Client({id: clientID});

client.on({
  type: somePushName,
  callback: (err, res) => {
    console.log('======== server push ========', res);
  },
});

/**
 * 处理离线期间受到的推送消息
 * 放在注册事件之后
 */
client.request({
  type: 'offline',
  callback: (err, res) => {
    client.distribute(res);
  },
});

/**
 * 接口请求
 */
let requestButton = document.getElementById('request');
requestButton.addEventListener('click', () => {
  client.request({
    type: someRequestName,
    params: {},
    callback: (err, res) => {
      console.log('======== client request ========', res);
    },
  });
});
