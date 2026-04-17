import {request} from "./request";

export default {
    loginWx(data) {
        return request('user/loginwx', data)
    },
    loginAuth(data) {
        return request('huawei/login-auth', data)
    }
}
