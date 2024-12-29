// 使用一个常量作为 token 的 key
const TOKEN_KEY = 'Admin-Token'

// 获取 token
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// 设置 token
export function setToken(token) {
  return localStorage.setItem(TOKEN_KEY, token)
}

// 移除 token
export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY)
}