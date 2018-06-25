/**
 * * Created by lee on 2018/5/26
 */
import CONSTANTS from './constants';

/**
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * @returns {string}
 */
export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


export function check(value, predicate, error) {
    if(!predicate(value)) {
        log('error', 'uncaught at check, ', error);
        throw new Error(error)
    }
}

function toStr(data){
    return Object.prototype.toString.call(data);
}

export const is = {
    undef     : v => v === null || v === undefined,
    notUndef  : v => v !== null && v !== undefined,
    string    : f => typeof f === 'string',
    func      : f => typeof f === 'function',
    number    : n => typeof n === 'number',
    array    : arr => toStr(arr) === '[object Array]',
    object    : obj => toStr(obj) === '[object Object]'
};

export function log(level, message, error) {
    /*eslint-disable no-console*/
    console[level].call(console, message, error)
}

export function isPromise(data){
    return typeof data === 'object' && typeof data.then === 'function';
}

export function getResponseTemplate(code, data){
    let res = {
        rescode: code,
    };

    if(CONSTANTS.CODE_TYPE[code]){
        res.data = {
            message: CONSTANTS.CODE_TYPE[code]
        };
    }

    if(data !== void 0){
        res.data = data;
    }

    return res;
}