import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/company/passport/login',
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/company/passport/logout',
    method: 'get'
  })
}