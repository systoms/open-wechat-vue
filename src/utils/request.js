import axios from 'axios';

// 创建 Axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
});

// 请求拦截器
service.interceptors.request.use((config) => {
    // 在发送请求前做点什么，比如添加 Token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // 处理请求错误
    console.error('Request error:', error);
    return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use((response) => {
    // 处理响应数据
    const res = response.data;
    if (res.code !== 200) {
        // 假设后端返回非 200 为错误
        console.error('Error:', res.message || 'Error');
        return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
}, (error) => {
    // 处理响应错误
    console.error('Response error:', error);
    return Promise.reject(error);
});

export default service;
