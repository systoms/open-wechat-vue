import request from '@/utils/request';

export function getMenuTree(params) {
    return request({
        url: '/company/system/menu/tree',
        method: 'get',
        params
    });
}