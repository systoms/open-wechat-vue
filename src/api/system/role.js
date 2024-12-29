import request from '@/utils/request';

export function getRoleList(params) {
    return request({
        url: '/company/system/role/list',
        method: 'get',
        params
    });
}

export function readRole(company_role_id) {
    return request({
        url: '/company/system/role/read/' + company_role_id,
        method: 'get',
    });
}

export function saveRole(data) {
    return request({
        url: '/company/system/role/save',
        method: 'post',
        data
    });
}

export function updateRole(id, data) {
    return request({
        url: '/company/system/role/update/' + id,
        method: 'put',
        data
    });
}

export function changeRoleStatus(id, status) {
    return request({
        url: '/company/system/role/set-status/' + id,
        method: 'put',
        data: {status: status},
    });
}

export function deleteRole(ids) {
    return request({
        url: '/company/system/role/delete',
        method: 'delete',
        data: {ids: ids}
    });
}