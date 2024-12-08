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
                path: '/wechat/menu',
                component: () => import('@/views/wechat/menu/index.vue'),
                meta: { title: '微信菜单管理' }
            },
            {
                path: '/drag/index',
                component: () => import('@/views/drag/index.vue'),
                meta: { title: '拖拽管理' }
            },
            {
                path: '/table/index',
                component: () => import('@/views/table/index.vue'),
                meta: { title: '表格管理' }
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