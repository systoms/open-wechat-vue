<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useMenuStore} from '@/store/system'
import {useTabStore} from '@/store/tab'
import {useLayoutStore} from '@/store/layout'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const tabStore = useTabStore()
const layoutStore = useLayoutStore()

// 直接使用所有菜单，不再区分顶部和侧边
const allMenus = computed(() => menuStore.menus || [])
console.log(allMenus)

// 存储展开的菜单
const openedMenus = ref([])

// 判断菜单是否被选中
const isMenuSelected = (menu) => {
  if (menu.redirect === route.path) return true
  if (menu.children?.length) {
    return menu.children.some(child =>
        child.redirect === route.path ||
        child.children?.some(grandChild => grandChild.redirect === route.path)
    )
  }
  return false
}

// 处理菜单点击
const handleMenuClick = (menu) => {
  if (menu.children?.length) {
    // 如果有子菜单，切换展开状态
    const index = openedMenus.value.indexOf(menu.id)
    if (index > -1) {
      openedMenus.value.splice(index, 1)
    } else {
      openedMenus.value.push(menu.id)
    }
  } else if (menu.redirect) {
    // 如果是叶子节点，添加并激活标签页，然后跳转
    const tab = {
      path: menu.redirect,
      title: menu.label,
      name: menu.label
    }
    // 先添加或更新标签页
    tabStore.addTab(tab)
    // 设置当前激活的标签页
    tabStore.setActiveTab(tab.name)
    // 最后进行路由跳转
    router.push(menu.redirect)
  }
}

// 判断菜单是否展开
const isMenuOpen = (menu) => {
  return openedMenus.value.includes(menu.id)
}

// 初始化展开状态和标签页
const initOpenedMenus = () => {
  const findAndOpenParent = (menus, targetPath) => {
    for (const menu of menus) {
      if (menu.redirect === targetPath) {
        // 为当前路由添加标签页
        const tab = {
          path: menu.redirect,
          title: menu.label,
          name: menu.label
        }
        tabStore.addTab(tab)
        tabStore.setActiveTab(tab.path)
        return true
      }
      if (menu.children?.length) {
        const hasPath = menu.children.some(child => {
          if (child.redirect === targetPath) {
            // 为当前路由添加标签页
            const tab = {
              path: child.redirect,
              title: child.label,
              name: child.label
            }
            tabStore.addTab(tab)
            tabStore.setActiveTab(tab.path)
            // 展开父级菜单
            if (!openedMenus.value.includes(menu.id)) {
              openedMenus.value.push(menu.id)
            }
            return true
          }
          if (child.children?.length) {
            return child.children.some(grandChild => {
              if (grandChild.redirect === targetPath) {
                // 为当前路由添加标签页
                const tab = {
                  path: grandChild.redirect,
                  title: grandChild.label,
                  name: grandChild.label
                }
                tabStore.addTab(tab)
                tabStore.setActiveTab(tab.path)
                // 展开父级菜单
                if (!openedMenus.value.includes(menu.id)) {
                  openedMenus.value.push(menu.id)
                }
                if (!openedMenus.value.includes(child.id)) {
                  openedMenus.value.push(child.id)
                }
                return true
              }
              return false
            })
          }
          return false
        })
        if (hasPath) {
          return true
        }
      }
    }
    return false
  }
  findAndOpenParent(allMenus.value, route.path)
}

// 在组件挂载时初始化
onMounted(() => {
  initOpenedMenus()
})

// 监听路由变化
watch(
    () => route.path,
    (newPath) => {
      if (newPath) {
        initOpenedMenus()
      }
    }
)

// 监听菜单数据变化
watch(
    () => menuStore.menus,
    () => {
      if (route.path) {
        initOpenedMenus()
      }
    }
)
</script>

<template>
  <el-aside
      ref="aside"
      :style="{width: layoutStore.sidebarCollapsed ? '50px' : '230px'}"
      width="230px"
      :collapse="layoutStore.sidebarCollapsed"
  >
    <el-scrollbar height="calc(100vh - 50px)">
      <el-menu
          :default-active="route.path"
          :collapse="layoutStore.sidebarCollapsed"
          :unique-opened="true"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          :collapse-transition="true"
          class="el-menu-vertical"
      >
        <template v-for="menu in allMenus" :key="menu.id">
          <!-- 无子菜单的菜单项 -->
          <el-menu-item
              v-if="!menu.children?.length"
              :index="menu.redirect"
              @click="handleMenuClick(menu)"
          >
            <el-icon>
            </el-icon>
            <template #title>
              <span>{{ menu.label }}</span>
            </template>
          </el-menu-item>

          <!-- 有子菜单的菜单项 -->
          <el-sub-menu
              v-else
              :index="menu.id.toString()"
              :class="{ 'is-active': isMenuSelected(menu) }"
          >
            <template #title>
              <el-icon>
              </el-icon>
              <span>{{ menu.label }}</span>
            </template>

            <!-- 递归渲染子菜单 -->
            <template v-for="subMenu in menu.children" :key="subMenu.id">
              <!-- 二级菜单项 -->
              <el-menu-item
                  v-if="!subMenu.children?.length"
                  :index="subMenu.redirect"
                  @click="handleMenuClick(subMenu)"
              >
                <el-icon>
                </el-icon>
                <template #title>
                  <span>{{ subMenu.label }}</span>
                </template>
              </el-menu-item>

              <!-- 三级菜单 -->
              <el-sub-menu
                  v-else
                  :index="subMenu.id.toString()"
                  :class="{ 'is-active': isMenuSelected(subMenu) }"
              >
                <template #title>
                  <el-icon>
                    <component :is="subMenu.icon"/>
                  </el-icon>
                  <span>{{ subMenu.label }}</span>
                </template>

                <el-menu-item
                    v-for="grandChild in subMenu.children"
                    :key="grandChild.id"
                    :index="grandChild.redirect"
                    @click="handleMenuClick(grandChild)"
                >
                  <el-icon>
                    <component :is="grandChild.icon"/>
                  </el-icon>
                  <template #title>
                    <span>{{ grandChild.label }}</span>
                  </template>
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<style lang="less" scoped>
.el-scrollbar {
  width: 100%;
}

/* 使用深度选择器调整标题的高度 */
.el-sub-menu__title {
  height: 50px; /* 设置需要的高度 */
  line-height: 50px; /* 垂直居中 */
}

.el-aside {
  background-color: #304156;
  transition: width 0.3s;

  .menu-header {
    padding: 12px 5px 12px 15px;
    color: #4b646f;
    background: #1a2226;
    font-size: 12px;
  }

  .el-menu-vertical {
    border-right: none;

    :deep(.el-menu-item) {
      &.is-active {
        background-color: #263445;
      }

      &:hover {
        background-color: #263445;
      }
    }

    :deep(.el-sub-menu) {
      .el-sub-menu__title {
        &:hover {
          background-color: #263445;
        }
      }

      &.is-active {
        > .el-sub-menu__title {
          color: #409EFF;
        }
      }
    }
  }

  // 折叠时的样式
  :deep(.el-menu--collapse) {
    width: 50px;

    .el-sub-menu {
      &.is-active {
        > .el-sub-menu__title {
          color: #ffffff;
        }
      }
    }
  }
}

/* 调整菜单项和子菜单标题的高度和内边距 */
:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  padding-left: 15px !important;

  .el-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    text-align: center;
    font-size: 16px;
  }
}

/* 调整子菜单箭头位置 */
:deep(.el-sub-menu__title) {
  position: relative;
  
  .el-sub-menu__icon-arrow {
    position: absolute;
    top: 22px;
    right: 15px;
    margin-top: -6px;
  }
}

// 弹出菜单样式
:deep(.el-menu--popup) {
  min-width: 200px !important;
  
  .el-menu-item {
    height: 50px !important;
    line-height: 50px !important;
    padding: 0 15px !important;
  }
}

// 处理弹出菜单的容器
:deep(.el-popper) {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  
  .el-menu {
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

// 处理所有可能的弹出菜单容器
:deep([class*='el-popper'][class*='is-light']) {
  border: none !important;
  padding: 0 !important;
  
  .el-menu {
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}


/* 修改菜单项的高度 */
.el-menu-vertical .el-menu-item {
  height: 50px !important; /* 修改菜单项高度 */
  line-height: 50px !important; /* 确保文本垂直居中 */
}

/* 修改子菜单标题的高度 */
.el-menu-vertical .el-sub-menu .el-menu-item {
  height: 50px; /* 修改子菜单项高度 */
  line-height: 50px; /* 确保子菜单项文本垂直居中 */
}

/* 修改折叠后的子菜单高度 */
.el-menu-vertical .el-sub-menu.is-collapsed .el-menu-item {
  height: 50px; /* 折叠时子菜单项的高度 */
  line-height: 50px; /* 确保子菜单项文本垂直居中 */
}

/* 修改子菜单的弹出位置和高度 */
.el-menu-vertical .el-sub-menu.is-opened {
  background-color: #1f2d3d;
}

/* 也可以通过深度选择器修改折叠时子菜单的高度 */
::v-deep .el-menu-item {
  height: 50px !important;
  line-height: 50px !important;
}

.el-menu.el-menu--popup {
  .el-menu-item {
    height: 50px !important;
    line-height: 50px !important;
  }
}
</style>
