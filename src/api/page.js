import request from '@/utils/request';

export function getPageList(params) {
    return request({
        url: '/company/page/list',
        method: 'get',
        params
    });
}

export function savePage(data) {
    return request({
        url: '/company/page/save',
        method: 'post',
        data
    });
}

export function readPage(id) {
    return request({
        url: '/company/page/read/' + id,
        method: 'get',
    });
}

export function updatePage(id, data) {
    return request({
        url: '/company/page/update/' + id,
        method: 'put',
        data
    });
}

export function changePageStatus(id, status) {
    return request({
        url: '/company/page/set-status/' + id,
        method: 'put',
        data: {status: status},
    });
}

export function deletePage(ids) {
    return request({
        url: '/company/page/delete',
        method: 'delete',
        data: {ids: ids}
    });
}