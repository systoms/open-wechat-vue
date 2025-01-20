<template>
  <el-header class="main-header" height="50">
    <!-- Logo -->
    <a href="/" class="logo" :style="{width: layoutStore.sidebarCollapsed ? '50px' : '230px'}">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini" v-if="layoutStore.sidebarCollapsed">
        <b>A</b>LT
      </span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg" v-else>
        <b>Admin</b>LTE
      </span>
    </a>

    <!-- Header Navbar -->
    <el-menu 
      class="navbar"
      mode="horizontal"
      :ellipsis="false"
    >
      <!-- Sidebar toggle button -->
      <el-menu-item index="0" class="sidebar-toggle" @click="handleSidebarToggle">
        <el-icon><Fold /></el-icon>
        <span class="sr-only">Toggle navigation</span>
      </el-menu-item>

      <div class="flex-grow" />

      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <el-menu 
          class="nav"
          mode="horizontal"
          :ellipsis="false"
        >
          <!-- Messages Menu -->
          <el-sub-menu index="messages" class="messages-menu">
            <template #title>
              <el-badge :value="4" :max="99" class="item">
                <el-icon :size="16"><Message /></el-icon>
              </el-badge>
            </template>
            <el-menu-item index="messages-1">
              <span>你有 4 条未读消息</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="messages-2">
              <span>查看全部消息</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- Notifications Menu -->
          <el-sub-menu index="notifications" class="notifications-menu">
            <template #title>
              <el-badge :value="10" :max="99" class="item">
                <el-icon :size="16"><Bell /></el-icon>
              </el-badge>
            </template>
            <el-menu-item index="notifications-1">
              <span>你有 10 条通知</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="notifications-2">
              <span>查看全部通知</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- Tasks Menu -->
          <el-sub-menu index="tasks" class="tasks-menu">
            <template #title>
              <el-badge :value="9" :max="99" class="item">
                <el-icon :size="16"><List /></el-icon>
              </el-badge>
            </template>
            <el-menu-item index="tasks-1">
              <span>你有 9 个任务</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="tasks-2">
              <span>查看全部任务</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- User Account Menu -->
          <el-sub-menu index="user" class="user-menu">
            <template #title>
              <el-avatar 
                :size="25" 
                :src="userInfo.user.avatar || '@/assets/img/user2-160x160.jpg'"
              />
              <span class="hidden-xs">{{ userInfo.user.fullname }}</span>
            </template>
            <el-menu-item index="user-1">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="user-2">
              <el-icon><Setting /></el-icon>
              <span>设置</span>
            </el-menu-item>
            <el-divider />
            <el-menu-item index="logout" @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </el-menu>
  </el-header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTabStore } from '@/store/tab'
import { useMenuStore } from '@/store/system'
import { useLayoutStore } from '@/store/layout'
import { ElMessageBox } from 'element-plus'
import { logout } from '@/api/auth'
import { removeToken } from '@/utils/auth'
import { 
  Fold, 
  Bell, 
  User, 
  Lock, 
  SwitchButton,
  Message,
  List,
  Setting
} from '@element-plus/icons-vue'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
    default: () => ({
      company: { name: '' },
      user: { 
        fullname: '',
        avatar: ''
      }
    })
  }
})

const router = useRouter()
const tabStore = useTabStore()
const menuStore = useMenuStore()
const layoutStore = useLayoutStore()

// 处理侧边栏切换
const handleSidebarToggle = () => {
  layoutStore.toggleSidebar()
}

// 处理顶部菜单点击
const handleTopMenuClick = (menu) => {
  // 处理顶部菜单点击逻辑
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await logout()
      removeToken()
      tabStore.clearTabs()
      menuStore.clearMenus()
      router.push('/passport/login')
    } catch (error) {
      console.error('退出失败:', error)
    }
  })
}
</script>

<style lang="less" scoped>
.main-header {
  position: relative;
  max-height: 50px;
  z-index: 1030;
  padding: 0;
  display: flex;
  background-color: #3c8dbc;
  border-bottom: 0;

  .logo {
    transition: width .3s ease-in-out;
    display: block;
    float: left;
    height: 50px;
    font-size: 20px;
    line-height: 50px;
    text-align: center;
    width: 230px;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    padding: 0 15px;
    font-weight: 300;
    overflow: hidden;
    background-color: #367fa9;
    color: #fff;
    border-right: 1px solid #eee;
    text-decoration: none;

    .logo-lg {
      display: block;
      b {
        font-weight: 700;
      }
    }

    .logo-mini {
      display: block;
      font-size: 18px;
      b {
        font-weight: 700;
      }
    }
  }

  .navbar {
    flex: 1;
    margin-bottom: 0;
    margin-left: 0;
    border: none;
    height: 50px;
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
    background-color: #3c8dbc;
    display: flex;

    :deep(.el-menu-item) {
      height: 50px;
      line-height: 50px;
      color: #fff;
      border-bottom: none;
      
      &:hover, &:focus {
        background: rgba(0,0,0,0.1);
        color: #f6f6f6;
      }
    }

    .sidebar-toggle {
      float: left;
      background-color: transparent;
      background-image: none;
      padding: 15px;
      font-family: fontAwesome;
      color: #fff;

      &:hover {
        background: rgba(0,0,0,0.1);
        color: #f6f6f6;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        border: 0;
      }
    }

    .flex-grow {
      flex: 1;
    }
  }

  .navbar-custom-menu {
    float: right;
    height: 50px;
    
    .nav {
      background-color: transparent;
      border: none;
      padding: 0;
      margin: 0;
      height: 50px;

      :deep(.el-menu) {
        background-color: transparent;
        border: none;
      }

      :deep(.el-sub-menu) {
        &__title {
          color: #fff;
          height: 50px;
          line-height: 50px;
          padding: 0 15px;
          border-bottom: none;

          &:hover {
            background: rgba(0,0,0,0.1);
            color: #f6f6f6;
          }
        }

        &__icon {
          color: #fff;
        }
      }

      :deep(.el-menu--popup) {
        background-color: #fff;
        padding: 5px 0;
        border-radius: 2px;
        min-width: 160px;

        .el-menu-item {
          height: 36px;
          line-height: 36px;
          color: #333;
          padding: 0 15px;

          &:hover {
            background-color: #f5f5f5;
            color: #262626;
          }
        }

        .el-divider {
          margin: 5px 0;
        }
      }

      :deep(.el-badge) {
        margin-right: 0;
        display: inline-block;
        position: relative;
        vertical-align: middle;

        .el-badge__content {
          position: absolute;
          top: 8px;
          right: -12px;
          z-index: 10;
          min-width: 10px;
          height: 10px;
          padding: 0 4px;
          background-color: #f56954;
          color: #fff;
          border: none;
          font-weight: normal;
          font-size: 10px;
          line-height: 15px;
          border-radius: 7.5px;
          transform: translateY(0);
        }
      }

      :deep(.el-sub-menu__title) {
        .el-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
          margin-right: 0;
          vertical-align: middle;
        }
      }

      .hidden-xs {
        margin-left: 5px;
        color: #fff;
      }

      .user-menu {
        :deep(.el-sub-menu__title) {
          display: flex;
          align-items: center;
          padding: 0 15px;

          .el-avatar {
            margin-right: 5px;
          }
        }
      }
    }
  }
}

// 当侧边栏折叠时
.sidebar-collapse {
  .logo {
    width: 50px;
  }
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
  
  .el-menu-item, .el-sub-menu__title {
    height: 50px;
    line-height: 50px;
    color: #fff;
    background-color: transparent;

    &:hover {
      background-color: rgba(0,0,0,0.1);
    }

    .el-sub-menu__icon-arrow {
      display: none;
    }
  }
}

.el-divider--horizontal {
  margin: 3px !important;
}
</style>