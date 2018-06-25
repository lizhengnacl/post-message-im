/**
 * * Created by lee on 2018/5/27
 */

export const TYPE = {
    OFFLINE: 'offline'
};

export const CODE = {
    Success: 0,
    Unauthorized: 401,
    Forbidden: 403,
    Not_Found: 404,
    Request_Timeout: 408
};

export const CODE_TYPE = {
    0: 'Success',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not_Found',
    408: 'Request_Timeout',
};

export default {
    TYPE: TYPE,
    CODE: CODE,
    CODE_TYPE: CODE_TYPE
}