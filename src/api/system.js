import request from '@/utils/request';

// 获取用户信息
export function getSystemMenu() {
    return request({
        url: '/api/system/menu',
        method: 'get',
    });
}