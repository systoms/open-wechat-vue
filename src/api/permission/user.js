import request from '@/utils/request';

// 获取用户信息
export function getInfo() {
    return request({
        url: '/company/permission/user/info',
        method: 'get',
    });
}