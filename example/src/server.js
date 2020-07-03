import Server from '../../src/server';

const getResponseTemplate = Server.getResponseTemplate;

const server = new Server({
  // validator: ({id}, originRequestData) => {
  //   // 可以用来检验权限
  //   // 所以得请求都会收敛到这里
  //   // return Promise.resolve(true);
  //   return true;
  // },
});

/**
 * config
 */
const clientID = 'someId';
const someRequestName = 'somePushName';
const somePushName = 'somePushName';

/**
 * 响应client请求
 */
server.on({
  type: someRequestName,
  callback: (err, res) => {
    // handle request
    // response request
    server.response(Object.assign({}, res,
      {data: getResponseTemplate(0, {someData: 'response'})}));
  },
});

/**
 * server主动推数据
 */
// server.response(clientID, somePushName, {});

// ===================

let loadButton = document.getElementById('load');
let unloadButton = document.getElementById('unload');
let pushButton = document.getElementById('push');

function loadIframe() {
  let iframe = document.getElementById(clientID);
  if (iframe !== null) return;

  iframe = document.createElement('iframe');
  iframe.id = clientID;
  iframe.src = 'http://localhost:9002/';
  document.body.appendChild(iframe);
}

function unloadIframe() {
  let iframe = document.getElementById(clientID);
  if (iframe === null) return;
  document.body.removeChild(iframe);
}

loadButton.addEventListener('click', () => {
  loadIframe();
});

unloadButton.addEventListener('click', () => {
  unloadIframe();
});

pushButton.addEventListener('click', () => {
  server.response(clientID, somePushName,
    getResponseTemplate(0, {someData: 'push'}));
});
