import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/views/layouts/main.vue'),
        children: [
            {
                path: '/',
                component: () => import('@/views/home/index.vue'),
                meta: { title: '首页' }
            },
            {
                path: '/console/dashboard',
                component: () => import('@/views/console/dashboard.vue'),
                meta: { title: '首页' }
            },
            {
                path: '/wechat/offiaccount',
                component: () => import('@/views/wechat/offiaccount/index.vue'),
                meta: { title: '微信公众号管理' }
            },
            {
                path: '/wechat/offiaccount/:appid/dashboard',
                component: () => import('@/views/wechat/offiaccount/dashboard.vue'),
                meta: { title: '公众号功能' }
            },
            {
                path: '/wechat/offiaccount/:appid/menu',
                component: () => import('@/views/wechat/menu/index.vue'),
                meta: { title: '微信菜单管理' }
            },
            {
                path: '/wechat/miniprogram',
                component: () => import('@/views/wechat/miniprogram/index.vue'),
                meta: { title: '微信小程序管理' }
            },
            {
                path: '/wechat/menu',
                component: () => import('@/views/wechat/menu/index.vue'),
                meta: { title: '微信菜单管理' }
            },
            {
                path: '/page/index',
                component: () => import('@/views/page/index.vue'),
                meta: { title: '页面管理' }
            },
            {
                path: '/page/edit',
                component: () => import('@/views/page/edit.vue'),
                meta: { title: '页面编辑' }
            },
            {
                path: '/table/index',
                component: () => import('@/views/table/index.vue'),
                meta: { title: '表格管理' }
            },
            {
                path: '/system/user',
                component: () => import('@/views/system/user/index.vue'),
                meta: { title: '用户管理' }
            },
            {
                path: '/system/role',
                component: () => import('@/views/system/role/index.vue'),
                meta: { title: '角色管理' }
            },
            {
                // 404 页面
                path: '/:pathMatch(.*)*',
                component: () => import('@/views/error/404.vue'),
                meta: { title: '404 Not Found' }
            }
        ]
    },
    {
        path: '/passport/login',
        component: () => import('@/views/passport/login.vue'),
        meta: { title: '登录' }
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})