<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore } from '@/store/system'
import { useTabStore } from '@/store/tab'
import { useLayoutStore } from '@/store/layout'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const tabStore = useTabStore()
const layoutStore = useLayoutStore()

// 直接使用所有菜单，不再区分顶部和侧边
const allMenus = computed(() => menuStore.menus || [])

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
  <aside class="main-sidebar" :class="{ 'sidebar-collapse': layoutStore.sidebarCollapsed }">
    <section class="sidebar">
      <div class="sidebar-menu-wrapper">
        <ul class="sidebar-menu" data-widget="tree">
          <template v-for="(menu, index) in allMenus" :key="index">
            <!-- Header menu item -->
            <li v-if="menu.type === 0" class="header">
              {{ menu.label }}
            </li>

            <!-- Regular menu item with potential children -->
            <li :class="{
              treeview: menu.children?.length > 0,
              active: isMenuSelected(menu),
              'menu-open': isMenuOpen(menu)
            }">
              <a @click.prevent="handleMenuClick(menu)">
                <i :class="menu.icon"></i>
                <span>{{ menu.label }}</span>
                <span v-if="menu.children?.length" class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </a>

              <!-- Submenu items -->
              <ul v-if="menu.children?.length" class="treeview-menu" :style="{ display: isMenuOpen(menu) ? 'block' : 'none' }">
                <li v-for="(subMenu, subIndex) in menu.children"
                    :key="subIndex"
                    :class="{ active: isMenuSelected(subMenu) }"
                    @click.prevent="handleMenuClick(subMenu)">
                  <a>
                    <i :class="subMenu.icon"></i>
                    {{ subMenu.label }}
                  </a>

                  <!-- 三级菜单 -->
                  <ul v-if="subMenu.children?.length" class="treeview-menu">
                    <li v-for="(grandChild, grandChildIndex) in subMenu.children"
                        :key="grandChildIndex"
                        :class="{ active: isMenuSelected(grandChild) }"
                        @click.prevent="handleMenuClick(grandChild)">
                      <a>
                        <i :class="grandChild.icon"></i>
                        {{ grandChild.label }}
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </section>
  </aside>
</template>

<style lang="less" scoped>
.main-sidebar {
  transition: width 0.3s ease-in-out;
  width: 230px;

  &.sidebar-collapse {
    width: 50px;
    
    .logo-lg {
      display: none;
    }
    
    .logo-mini {
      display: block;
    }
    
    .sidebar {
      .sidebar-menu {
        > li {
          > a {
            padding: 12px 5px;
            
            > span {
              display: none;
            }
            
            > .pull-right-container {
              display: none;
            }
          }
          
          &:hover {
            > a {
              > span {
                display: block;
                position: absolute;
                left: 50px;
                top: 0;
                margin-left: -3px;
                padding: 12px 5px 12px 20px;
                min-width: 180px;
                background: #2c3b41;
              }
              
              > .pull-right-container {
                display: block;
                position: absolute;
                left: 230px;
                top: 50%;
                transform: translateY(-50%);
              }
            }
            
            > .treeview-menu {
              display: block !important;
              position: absolute;
              left: 50px;
              top: 41px;
              margin-left: -3px;
              min-width: 180px;
              background: #2c3b41;
            }
          }
        }
      }
    }
  }
}

.main-sidebar {
  .sidebar {
    height: 100%;
    overflow: hidden;
    
    .sidebar-menu-wrapper {
      height: calc(100vh - 50px);
      overflow-y: auto;
      overflow-x: hidden;

      // 更细的滚动条样式
      &::-webkit-scrollbar {
        width: 2px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.08);
        border-radius: 1px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.15);
      }
    }
  }
}

// 修改悬停时的滚动条样式
.sidebar:hover {
  .sidebar-menu-wrapper {
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
