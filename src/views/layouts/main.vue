<script setup>
import { ref, onMounted, computed } from 'vue'
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import Footer from "@/components/Footer.vue";
import TabView from "@/components/TabView.vue";
import { useMenuStore } from '@/store/system'
import { getInfo } from '@/api/permission/user'

import "@/assets/font-awesome/less/font-awesome.less";
import "@/assets/bootstrap/less/bootstrap.less";
import "@/assets/AdminLTE/AdminLTE.less";
import "@/assets/AdminLTE/skins/skin-blue-light.less";

document.body.classList = 'skin-blue-light fixed sidebar-mini sidebar-mini-expand-feature';

const menuStore = useMenuStore()
const company = ref({ name: '' })
const user = ref({ rand_id: '', fullname: '' })

// 获取用户信息和菜单
const initUserInfo = async () => {
  try {
    const { data } = await getInfo()
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

<template>
  <div class="wrapper">
    <Header :user-info="userInfo"></Header>
    <Aside></Aside>
    <div class="content-wrapper" style="min-height: calc(100vh - 50px);">
      <TabView />
      <router-view/>
    </div>
    <Footer></Footer>
  </div>
</template>

<style scoped>
.content-wrapper{
  background: #fff;
}
</style>