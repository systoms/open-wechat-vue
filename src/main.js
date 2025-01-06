import {createApp} from 'vue'
import App from './App.vue'
import router from '@/router'
import pinia from '@/store'
import ElementPlus from 'element-plus'
import './styles/index.less'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(pinia).use(ElementPlus, {
    locale: zhCn,
}).mount('#app')
