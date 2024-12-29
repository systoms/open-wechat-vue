import request from '@/utils/request';

export function getUserList(params) {
    return request({
        url: '/company/system/user/list',
        method: 'get',
        params
    });
}

export function saveUser(data) {
    return request({
        url: '/company/system/user/save',
        method: 'post',
        data
    });
}

export function updateUser(id, data) {
    return request({
        url: '/company/system/user/update/' + id,
        method: 'put',
        data
    });
}

export function changeUserStatus(id, status) {
    return request({
        url: '/company/system/user/set-status/' + id,
        method: 'put',
        data: {status: status},
    });
}

export function deleteUser(ids) {
    return request({
        url: '/company/system/user/delete',
        method: 'delete',
        data: {ids: ids}
    });
}