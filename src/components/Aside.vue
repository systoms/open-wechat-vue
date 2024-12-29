<script setup>
import { onMounted, computed, watch } from 'vue'
import { useMenuStore } from '@/store/system'
import { useRouter, useRoute } from 'vue-router'
import { useTabStore } from '@/store/tab'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const tabStore = useTabStore()

// 监听菜单数据变化
const menus = computed(() => menuStore.menus || [])

// 计算当前应该显示的侧边栏菜单
const sideMenus = computed(() => {
  const currentTopMenu = menuStore.currentTopMenu
  return (currentTopMenu?.children || []).map(menu => ({
    ...menu,
    selected: isMenuSelected(menu)
  }))
})

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

// 根据路由路径查找对应的顶级菜单
const findTopMenuByPath = (path) => {
  const currentMenus = menus.value
  if (!currentMenus?.length) return null

  for (const menu of currentMenus) {
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

// 监听菜单数据和路由变化，处理 tab
watch(
  [menus, () => route.path],
  ([newMenus, newPath]) => {
    if (newMenus?.length) {
      // 先找到并设置顶级菜单
      const topMenu = findTopMenuByPath(newPath)
      if (topMenu && (!menuStore.currentTopMenu || menuStore.currentTopMenu.id !== topMenu.id)) {
        menuStore.setCurrentTopMenu(topMenu)
      }

      // 查找当前路由对应的具体菜单项
      const findCurrentMenu = (menus) => {
        for (const menu of menus) {
          if (menu.redirect === newPath) return menu
          if (menu.children?.length) {
            const found = menu.children.find(child => {
              if (child.redirect === newPath) return true
              if (child.children?.length) {
                return child.children.some(grandChild => grandChild.redirect === newPath)
              }
              return false
            })
            if (found) return found
          }
        }
        return null
      }

      // 添加或激活 tab
      const currentMenu = findCurrentMenu(newMenus)
      if (currentMenu) {
        tabStore.addTab({
          path: currentMenu.redirect,
          title: currentMenu.label,
          name: currentMenu.label
        })
      }
    }
  },
  { immediate: true }
)

// 处理菜单点击
const handleMenuClick = (menu) => {
  if (menu.redirect) {
    const tab = {
      path: menu.redirect,
      title: menu.label,
      name: menu.label
    }
    // 添加或激活 tab
    tabStore.addTab(tab)
    tabStore.setActiveTab(tab.name) // 设置当前激活的标签
    router.push(menu.redirect)
  }
}

// 监听 activeTab 变化
watch(
  () => tabStore.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      const tab = tabStore.tabs.find(tab => tab.name === newActiveTab)
      if (tab && tab.path !== route.path) {
        router.push(tab.path)
      }
    }
  }
)
</script>

<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <ul class="sidebar-menu" data-widget="tree">
        <template v-for="(menu, index) in sideMenus" :key="index">
          <!-- Header menu item -->
          <li v-if="menu.type === 0" class="header">
            {{ menu.label }}
          </li>

          <!-- Regular menu item with potential children -->
          <li :class="{
            treeview: menu.children?.length > 0,
            active: menu.selected
          }">
            <a @click.prevent="handleMenuClick(menu)">
              <i :class="menu.icon"></i>
              <span>{{ menu.label }}</span>
              <span v-if="menu.children?.length" class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
            </a>

            <!-- Submenu items -->
            <ul v-if="menu.children?.length" class="treeview-menu">
              <li v-for="(subMenu, subIndex) in menu.children"
                  :key="subIndex"
                  :class="{ active: isMenuSelected(subMenu) }"
                  @click.prevent="handleMenuClick(subMenu)">
                <a>
                  <i :class="subMenu.icon"></i>
                  {{ subMenu.label }}
                </a>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </section>
  </aside>
</template>

<style scoped>

</style>