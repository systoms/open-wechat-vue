import {createApp} from 'vue'
import App from './App.vue'
import router from '@/router'
import pinia from '@/store'
import ElementPlus from 'element-plus'
import './styles/index.less'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

createApp(App).use(router).use(pinia).use(ElementPlus, {
    locale: zhCn,
}).mount('#app')
