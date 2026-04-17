import {request} from "./request";

export default {
    getCateList(data) {
        return request('public/cate-list', data, 'apihost2')
    },
    getList(data) {
        return request('public/index', data, 'apihost2');
    },
}