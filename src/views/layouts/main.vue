<template>
  <div class="common-layout">
    <el-container class="is-vertical">
      <Header :user-info="userInfo"></Header>
      <el-container>
        <Aside></Aside>
        <el-container class="is-vertical">
          <el-main>
            <div class="main-content">
              <TabView class="tab-view"/>
              <div class="view-container">
                <router-view/>
              </div>
            </div>
          </el-main>
          <Footer></Footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import Footer from "@/components/Footer.vue";
import TabView from "@/components/TabView.vue";
import {useMenuStore} from '@/store/system'
import {getInfo} from '@/api/permission/user'

// import "@/assets/font-awesome/less/font-awesome.less";
// import "@/assets/bootstrap/less/bootstrap.less";
// import "@/assets/AdminLTE/AdminLTE.less";
// import "@/assets/AdminLTE/skins/skin-blue-light.less";

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

<style scoped lang="less">
.common-layout {
  .el-header,
  .el-footer,
  .el-main,
  .el-aside {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-header,
  .el-footer {
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
    text-align: center;
  }

  .el-aside {
    background-color: var(--el-color-primary-light-8);
    color: var(--el-text-color-primary);
    text-align: center;
  }

  .el-main {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-text-color-primary);
    text-align: center;
    height: calc(100vh - 100px);
    padding: 0;

    .main-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      .tab-view {
        flex: none;
        width: 100%;
        background-color: #fff;
        border-bottom: 1px solid #ddd;
      }

      .view-container {
        flex: 1;
        width: 100%;
        overflow-y: auto;
      }
    }
  }
}
</style>