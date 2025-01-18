import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

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
        // 401 表示未授权，需要重新登录
        if (res.code === 401) {
            ElMessage.error('登录已过期，请重新登录');
            // 清除本地存储的 token
            localStorage.removeItem('token');
            // 跳转到登录页面，并带上当前页面的路径，便于登录后跳回
            router.push({
                path: '/passport/login',
                query: {
                    redirect: router.currentRoute.value.fullPath
                }
            });
            return Promise.reject(new Error('Unauthorized'));
        }
        
        // 其他错误
        console.error('Error:', res.message || 'Error');
        ElMessage.error(res.message || 'Error');
        return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
}, (error) => {
    // 处理响应错误
    if (error.response) {
        switch (error.response.status) {
            case 401:
                ElMessage.error('登录已过期，请重新登录');
                localStorage.removeItem('token');
                router.push({
                    path: '/passport/login',
                    query: {
                        redirect: router.currentRoute.value.fullPath
                    }
                });
                break;
            default:
                ElMessage.error(error.message || '请求失败');
        }
    } else {
        ElMessage.error('网络错误，请检查您的网络连接');
    }
    return Promise.reject(error);
});

export default service;
