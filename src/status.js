/**
 * * Created by lee on 2018/12/4
 */

/**
 * 子窗口状态，由此判断离线消息的临界点
 */
class Status {
    constructor (props = {}) {
        // id true/false
        this.state = {};
    }

    isLoaded (id) {
        return this.state[id] === true;
    }

    load (id) {
        return this.state[id] = true;
    }

    // 卸载的方法暴露给上层
    unload (id) {
        return delete this.state[id];
    }
}

export default Status;
