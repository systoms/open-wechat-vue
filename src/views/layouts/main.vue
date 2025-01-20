<template>
  <el-container style="height: 100vh; overflow: hidden;">
    <el-header style="height: 50px; line-height: 50px; background: #3c8dbc; color: white;">
      <el-button
          icon="el-icon-s-fold"
          @click="toggleSidebar"
          style="margin-right: 15px; color: white;"
          plain
      ></el-button>
    </el-header>
    <el-container>
      <el-aside
          ref="aside"
          :style="{width:isCollapsed?'50px':'200px'}"
          width="200px"
      >
        <el-scrollbar height="calc(100vh - 50px)">
          <el-menu
              :default-openeds="['1', '3']"
              background-color="#222d32"
              text-color="#b8c7ce"
              active-text-color="#ffffff"
          >
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">Dashboard</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-main style="padding: 15px; overflow: auto;">
          <TabView/>
          <router-view/>
        </el-main>
        <el-footer style="height: 50px; line-height: 50px; text-align: center; background: #f9fafc;">
          <Footer></Footer>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import Footer from "@/components/Footer.vue";
import TabView from "@/components/TabView.vue";
import {useMenuStore} from '@/store/system'
import {getInfo} from '@/api/permission/user'

import "@/assets/font-awesome/less/font-awesome.less";
import "@/assets/bootstrap/less/bootstrap.less";
import "@/assets/AdminLTE/AdminLTE.less";
import "@/assets/AdminLTE/skins/skin-blue-light.less";


const menuStore = useMenuStore()
const company = ref({name: ''})
const user = ref({rand_id: '', fullname: ''})
const isCollapsed = ref(false)

const toggleSidebar = async () => {
  isCollapsed.value = !isCollapsed.value;
}

// 获取用户信息和菜单
const initUserInfo = async () => {
  try {
    const {data} = await getInfo()
    // 设置菜单
    menuStore.setMenus(data.menus)
    company.value = data.company
    user.value = data.user
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 在组件挂载时初始化用户信息
onMounted(() => {
  initUserInfo()
})

// 使用 computed 包装用户信息
const userInfo = computed(() => ({
  company: company.value,
  user: user.value
}))
</script>

<style scoped>
/* Header 样式 */
.el-header {
  background-color: #3c8dbc;
  color: #ffffff;
  font-size: 16px;
  padding-left: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Sidebar 样式 */
.el-aside {
  background-color: #222d32;
  color: #b8c7ce;
  transition: width 0.3s;
}

.el-menu {
  border-right: none;
}

/* 主内容区样式 */
.el-main {
  background-color: #ecf0f5;
  color: #333;
  border-radius: 5px;
  min-height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

/* Footer 样式 */
.el-footer {
  background-color: #f9fafc;
  color: #333;
  border-top: 1px solid #d2d6de;
}
</style>