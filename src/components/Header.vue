<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue';
import {useMenuStore} from '@/store/system'
import {getInfo} from '@/api/permission/user'
import {useRouter} from 'vue-router'
import {useTabStore} from '@/store/tab'
import { ElMessageBox } from 'element-plus'
import { logout } from '@/api/auth'
import { removeToken } from '@/utils/auth'

const menuStore = useMenuStore()
const activeTopMenu = computed(() => menuStore.currentTopMenu?.id)
const router = useRouter()
const tabStore = useTabStore()
const company = ref({name: ''})
const user = ref({rand_id: '', fullname: ''})

// 获取用户信息和菜单
const initUserInfo = async () => {
  try {
    const {data} = await getInfo()
    // 设置顶部菜单
    menuStore.setTopMenus(data.menus)
    company.value = data.company;
    user.value = data.user;

    // 根据当前路由找到对应的顶级菜单并设置
    const currentPath = router.currentRoute.value.path
    const currentTopMenu = findTopMenuByPath(currentPath, data.menus)
    if (currentTopMenu) {
      menuStore.setCurrentTopMenu(currentTopMenu)

      // 查找当前路由对应的具体菜单项
      const findCurrentMenu = (menus) => {
        for (const menu of menus) {
          if (menu.redirect === currentPath) return menu
          if (menu.children?.length) {
            const found = menu.children.find(child => {
              if (child.redirect === currentPath) return true
              if (child.children?.length) {
                return child.children.some(grandChild => grandChild.redirect === currentPath)
              }
              return false
            })
            if (found) return found
          }
        }
        return null
      }

      // 添加初始 tab
      const currentMenu = findCurrentMenu(data.menus)
      if (currentMenu) {
        tabStore.addTab({
          path: currentMenu.redirect,
          title: currentMenu.label,
          name: currentMenu.label
        })
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 根据路由路径查找对应的顶级菜单
const findTopMenuByPath = (path, menus) => {
  if (!menus?.length) return null

  for (const menu of menus) {
    if (menu.redirect === path) return menu
    if (menu.children?.length) {
      const hasPath = menu.children.some(child => {
        if (child.redirect === path) return true
        if (child.children?.length) {
          return child.children.some(grandChild => grandChild.redirect === path)
        }
        return false
      })
      if (hasPath) return menu
    }
  }
  return null
}

function sidebarToggle() {
  // 获取 body 元素
  const body = document.body;

// 判断是否包含 'sidebar-collapse' 类
  if (body.classList.contains('sidebar-collapse')) {
    // 如果包含，则删除该类
    body.classList.remove('sidebar-collapse');
  } else {
    // 如果没有包含，则添加该类
    body.classList.add('sidebar-collapse');
  }
}

// 管理下拉菜单状态
const activeDropdown = ref(null);

// 切换下拉菜单
const toggleDropdown = (menu, event) => {
  event.preventDefault();
  activeDropdown.value = activeDropdown.value === menu ? null : menu;
};

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown')) {
    activeDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 切换顶部菜单
const handleTopMenuClick = (menu) => {
  menuStore.setCurrentTopMenu(menu)
  // 如果有默认重定向路由，则跳转并添加 tab
  if (menu.redirect) {
    const tab = {
      path: menu.redirect,
      title: menu.label,
      name: menu.label
    }
    tabStore.addTab(tab)
    tabStore.setActiveTab(tab.name) // 设置当前激活的标签
    router.push(menu.redirect)
  } else if (menu.children?.[0]?.redirect) {
    // 如果没有重定向但有子菜单，跳转到第一个子菜单
    const firstChild = menu.children[0]
    const tab = {
      path: firstChild.redirect,
      title: firstChild.label,
      name: firstChild.label
    }
    tabStore.addTab(tab)
    tabStore.setActiveTab(tab.name) // 设置当前激活的标签
    router.push(firstChild.redirect)
  }
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
      // 清除 token
      removeToken()
      // 清除 tabStore
      tabStore.clearTabs()
      // 清除菜单状态
      menuStore.clearMenus()
      // 跳转到登录页
      router.push('/passport/login')
    } catch (error) {
      console.error('退出失败:', error)
    }
  }).catch(() => {
    // 取消退出
  })
}

onMounted(() => {
  initUserInfo()
})
</script>
<template>
  <header class="main-header">
    <!-- Logo -->
    <a href="../../index2.html" class="logo">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini"><b>A</b>LT</span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg"><b>Admin</b>LTE</span>
    </a>
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
      <!-- Sidebar toggle button-->
      <a class="sidebar-toggle" @click.prevent="sidebarToggle">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </a>
      <div class="collapse navbar-collapse pull-left">
        <ul class="nav navbar-nav">
          <li v-for="menu in menuStore.topMenus"
              :key="menu.id"
              :class="{ active: activeTopMenu === menu.id }">
            <a href="#" @click.prevent="handleTopMenuClick(menu)">
              {{ menu.label }}
            </a>
          </li>
        </ul>
      </div>

      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!-- Messages Dropdown Menu -->
          <li class="dropdown messages-menu" :class="{ 'show': activeDropdown === 'messages' }">
            <a href="#" class="dropdown-toggle" @click="toggleDropdown('messages', $event)">
              <i class="fa fa-envelope-o"></i>
              <span class="label label-success">4</span>
            </a>
            <ul class="dropdown-menu">
              <li class="header">You have 4 messages</li>
              <li>
                <!-- inner menu: contains the actual data -->
                <ul class="menu">
                  <li><!-- start message -->
                    <a href="#">
                      <div class="pull-left">
                        <img src="@/assets/img/w.jpg" class="img-circle" alt="User Image">
                      </div>
                      <h4>
                        Support Team
                        <small><i class="fa fa-clock-o"></i> 5 mins</small>
                      </h4>
                      <p>Why not buy a new awesome theme?</p>
                    </a>
                  </li>
                  <!-- end message -->
                </ul>
              </li>
              <li class="footer"><a href="#">See All Messages</a></li>
            </ul>
          </li>
          <!-- Notifications Dropdown Menu -->
          <li class="dropdown notifications-menu" :class="{ 'show': activeDropdown === 'notifications' }">
            <a href="#" class="dropdown-toggle" @click="toggleDropdown('notifications', $event)">
              <i class="fa fa-bell-o"></i>
              <span class="label label-warning">10</span>
            </a>
            <ul class="dropdown-menu">
              <li class="header">You have 10 notifications</li>
              <li>
                <!-- inner menu: contains the actual data -->
                <ul class="menu">
                  <li>
                    <a href="#">
                      <i class="fa fa-users text-aqua"></i> 5 new members joined today
                    </a>
                  </li>
                </ul>
              </li>
              <li class="footer"><a href="#">View all</a></li>
            </ul>
          </li>
          <!-- Tasks Dropdown Menu -->
          <li class="dropdown tasks-menu" :class="{ 'show': activeDropdown === 'tasks' }">
            <a href="#" class="dropdown-toggle" @click="toggleDropdown('tasks', $event)">
              <i class="fa fa-flag-o"></i>
              <span class="label label-danger">9</span>
            </a>
            <ul class="dropdown-menu">
              <li class="header">You have 9 tasks</li>
              <li>
                <!-- inner menu: contains the actual data -->
                <ul class="menu">
                  <li><!-- Task item -->
                    <a href="#">
                      <h3>
                        Design some buttons
                        <small class="pull-right">20%</small>
                      </h3>
                      <div class="progress xs">
                        <div class="progress-bar progress-bar-aqua" style="width: 20%" role="progressbar"
                             aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                          <span class="sr-only">20% Complete</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <!-- end task item -->
                </ul>
              </li>
              <li class="footer">
                <a href="#">View all tasks</a>
              </li>
            </ul>
          </li>
          <!-- User Account Dropdown Menu -->
          <li class="dropdown user user-menu" :class="{ 'show': activeDropdown === 'user' }">
            <a href="#" class="dropdown-toggle" @click="toggleDropdown('user', $event)">
              <img src="@/assets/img/w.jpg" class="user-image" alt="User Image">
              <span class="hidden-xs">{{ user.fullname }}</span>
              <i class="fa fa-angle-down arrow-icon"></i>
            </a>
            <div class="dropdown-menu">
              <div class="dropdown-arrow"></div>
              <div class="user-menu-list">
                <div class="menu-header">
                  <span class="welcome-text">您好，{{ user.fullname }}</span>
                  <small class="role-text">({{ company.name }})</small>
                </div>
                <el-menu class="user-menu-items" :default-active="'1'">
                  <el-menu-item index="1">
                    <template #title>
                      <i class="fa fa-user-circle"></i>
                      <span>个人中心</span>
                    </template>
                  </el-menu-item>
                  <el-menu-item index="3">
                    <template #title>
                      <i class="fa fa-shield"></i>
                      <span>修改密码</span>
                    </template>
                  </el-menu-item>
                  <el-divider></el-divider>
                  <el-menu-item index="4" class="logout-item" @click="handleLogout">
                    <template #title>
                      <i class="fa fa-power-off"></i>
                      <span>退出系统</span>
                    </template>
                  </el-menu-item>
                </el-menu>
              </div>
            </div>
          </li>
          <!-- Control Sidebar Toggle Button -->
          <li>
            <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style lang="less" scoped>
/* 下拉菜单基础样式 */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  left: auto;
  display: none;
  min-width: 280px;
  padding: 0;
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.2s ease;
}

/* 显示下拉菜单 */
.dropdown.show .dropdown-menu {
  display: block;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* 各种下拉菜单特定样式 */
.messages-menu .dropdown-menu,
.notifications-menu .dropdown-menu,
.tasks-menu .dropdown-menu,
.user-menu .dropdown-menu {
  width: 280px;
}

/* 用户菜单特定样式 */
.user-header {
  height: 175px;
  padding: 10px;
  text-align: center;
  background-color: #3c8dbc;
}

.user-header > img {
  width: 90px;
  height: 90px;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.user-header > p {
  color: #fff;
  margin-top: 10px;
}

.user-body {
  padding: 15px;
  border-bottom: 1px solid #f4f4f4;
}

.user-footer {
  padding: 10px;
  background-color: #f9f9f9;
}

/* 下拉菜单头部和底部样式 */
.dropdown-menu > li.header {
  border-bottom: 1px solid #f4f4f4;
  padding: 7px 10px;
  color: #444444;
  font-size: 14px;
}

.dropdown-menu > li.footer {
  border-top: 1px solid #f4f4f4;
  padding: 7px 10px;
  text-align: center;
}

.dropdown-menu > li.footer > a {
  color: #444444;
  text-decoration: none;
}

.dropdown-menu > li.footer > a:hover {
  text-decoration: underline;
}

.user-menu {
  .dropdown-menu {
    padding: 0;
    width: 100px;
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    border: 1px solid #ebeef5;
    background: #fff;
    overflow: visible;
    margin-top: 10px;
    position: relative;

    .dropdown-arrow {
      position: absolute;
      top: -5px;
      right: 16px;
      width: 8px;
      height: 8px;
      background: linear-gradient(135deg, #f8f9fa, #f2f3f5);
      border-left: 1px solid #ebeef5;
      border-top: 1px solid #ebeef5;
      transform: rotate(45deg);
      z-index: 10;
      box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
    }

    .menu-header {
      padding: 8px 10px;
      background: linear-gradient(135deg, #f8f9fa, #f2f3f5);
      border-bottom: 1px solid #ebeef5;
      position: relative;
      z-index: 11;

      .welcome-text {
        font-size: 12px;
        margin-bottom: 2px;
      }

      .role-text {
        font-size: 10px;
      }
    }
  }
}

:deep(.user-menu-items) {
  border: none;
  background: transparent;

  .el-menu-item {
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    margin: 2px 3px;
    border-radius: 4px;

    i {
      margin-right: 5px;
      font-size: 13px;
    }

    span {
      font-size: 12px;
    }
  }

  .el-divider {
    margin: 3px 0;
  }

  .logout-item {
    margin-bottom: 3px;
  }
}

/* 优化悬浮效果，避免文字换行 */
:deep(.user-menu-items .el-menu-item:hover) {
  padding-left: 14px;
}

.dropdown-menu {
  display: none;

  &.show {
    display: block;
  }
}

/* 优化用户头像和名称样式 */
.dropdown-toggle {
  padding: 0 15px;
  display: flex;
  align-items: center;
  height: 50px;

  .user-image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 8px;
    border: 2px solid rgba(255, 255, 255, 0.6);
  }

  .hidden-xs {
    color: #fff;
    font-size: 14px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 4px;
  }

  .arrow-icon {
    color: #fff;
    font-size: 14px;
    margin-left: 4px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
}

.user-menu.show {
  .arrow-icon {
    transform: rotate(180deg);
  }
}
</style>