/**
 * * Created by lee on 2018/2/2
 */

import { guid, log, check, is } from './utils';
import CONSTANTS from './constants';

class Client {
    constructor (props) {
        check(props.id, is.notUndef, 'id is required');
        // check(props.appKey, is.notUndef, 'appKey is required');
        // check(props.jsTicket, is.notUndef, 'jsTicket is required');

        this.$$symbol = props.symbol || 'POST_MESSAGE_IM';
        this.token = {
            id: props.id,
            appKey: props.appKey,
            jsTicket: props.jsTicket
        };
        this.__TEST__ = props.__TEST__ || false;
        this.CONSTANTS = CONSTANTS;
        this.init();
    }

    static CONSTANTS = CONSTANTS;

    init = () => {
        if(!this.__TEST__) {
            this.subscribe();
        }
    };

    subscribe = () => {
        window.addEventListener('message', (e) => {
            let data = e.data;
            try {
                data = JSON.parse(data);
            } catch(err) {
                if(data && data.type === 'webpackOk') return;
                log('error', 'json parse error', err.message);
                // 提前结束
                return;
            }
            if(data.$$symbol === this.$$symbol) {
                // 只处理iframe的情况
                parent !== window && this.distribute(data);
            }
        }, false);
    };

    distribute = (data) => {
        if(!is.array(data)) {
            // 拉模型
            if(data.meta && data.meta.model === 'pull') {
                // 处理响应
                let callbackData = this.handleRequestResponse(data);
                this.removeRequestPool(data);
                return callbackData;
            }
            // 推模型，由上层往下推数据 push model
            return this.handleMonitorResponse(data);
        } else {
            // 支持分发离线消息列表
            data.forEach(m => {
                this.distribute(m);
            })
        }
    };

    postMessage = (data) => {
        window.parent.postMessage(JSON.stringify(data), '*');
    };

    // 发出post请求
    request = (data) => {
        // 用于区分postMessage来源
        data.$$symbol = this.$$symbol;
        data.meta = this.getMeta();
        // model 拉模型
        data.meta.model = 'pull';
        data.token = this.token;
        this.addRequestPool(data);
        if(!this.__TEST__) {
            this.postMessage(data);
        }
        return data;
    };

    getMeta = () => {
        // uuid 标识单次请求
        // requestTime 超时机制
        return {
            uuid: guid(),
            requestTime: new Date().valueOf()
        }
    };

    // 请求事件池
    requestPool = {};
    addRequestPool = (data) => {
        check(data.meta, is.notUndef, 'meta info is required');
        if(!this.requestPool[data.meta.uuid]) {
            this.requestPool[data.meta.uuid] = data;
        } else {
            log('error', 'uuid is repeated')
        }
    };
    removeRequestPool = (data) => {
        check(data.meta, is.notUndef, 'meta info is required');
        if(this.requestPool[data.meta.uuid]) {
            delete this.requestPool[data.meta.uuid];
        } else {
            log('error', 'can not find the uuid key[' + data.meta.uuid + '] in requestPool')
        }
    };
    handleRequestResponse = (res) => {
        check(res.data, is.notUndef, 'the data info in the response is required');
        check(res.meta, is.notUndef, 'meta info is required');

        let { data, meta } = res;
        let requestData = this.requestPool[meta.uuid];

        check(requestData, is.notUndef, 'can not find the request info in requestPool');
        try {
            requestData.callback(data);
        } catch(e) {
            if(typeof requestData.onError === 'function') {
                requestData.onError(e);
            } else {
                throw new Error(e);
            }
        }
        return data;
    };

    // 注册on事件
    // TODO once remove
    on = (data) => {
        this.addMonitorPool(data);
        return data;
    };

    // 监听事件池
    monitorPool = {};
    addMonitorPool = (data) => {
        if(!this.monitorPool[data.type]) {
            this.monitorPool[data.type] = [data];
        } else {
            this.monitorPool[data.type].push(data);
        }
    };
    handleMonitorResponse = (res) => {
        check(res.data, is.notUndef, 'the data info in the response is required');

        let { data, type } = res;
        // 遍历得到所有符合的类型
        let monitorList;
        Object.keys(this.monitorPool).forEach((t) => {
            // 先找到类型数据
            if(type === t) {
                // 再通知数据中所有注册的事件
                monitorList = this.monitorPool[t];
                check(monitorList, is.array, 'the monitor data is not a array type');
                monitorList.forEach((m) => {
                    try {
                        m.callback(data);
                    } catch(e) {
                        if(typeof m.onError === 'function') {
                            m.onError(e);
                        } else {
                            throw new Error(e);
                        }
                    }
                });
            }
        });
        return data;
    };
    // removeMonitorPool = () => {};
}

export default Client;
