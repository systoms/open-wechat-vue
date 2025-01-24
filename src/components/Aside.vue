<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useMenuStore} from '@/store/system'
import {useTabStore} from '@/store/tab'
import {useLayoutStore} from '@/store/layout'
import {Position} from "@element-plus/icons-vue";

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const tabStore = useTabStore()
const layoutStore = useLayoutStore()

// 直接使用所有菜单，不再区分顶部和侧边
// 移除 console.log
const allMenus = computed(() => menuStore.menus || [])

// 优化菜单选中逻辑
const isMenuSelected = (menu) => {
  const currentPath = route.path
  const checkPath = (item) => item.redirect === currentPath

  return checkPath(menu) ||
      menu.children?.some(child =>
          checkPath(child) || child.children?.some(checkPath)
      )
}

// 优化菜单点击处理
const handleMenuClick = (menu) => {
  if (!menu.children?.length && menu.redirect) {
    const tab = {
      path: menu.redirect,
      title: menu.label,
      name: menu.label
    }
    tabStore.addTab(tab)
    tabStore.setActiveTab(tab.name)
    router.push(menu.redirect)
  }
}

// 存储展开的菜单
const openedMenus = ref([])

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
      :class="{'el-aside-collapse':layoutStore.sidebarCollapsed}"
  >
    <el-scrollbar height="calc(100vh - 50px)">
      <el-menu
          :default-active="route.path"
          :collapse="layoutStore.sidebarCollapsed"
          :unique-opened="true"
          background-color="#f4f4f5"
          text-color="#444"
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
            <i :class="menu.icon"></i>
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
              <i :class="menu.icon"></i>
              <span>{{ menu.label }}</span>
            </template>

            <!-- 递归渲染子菜单 -->
            <template v-for="subMenu in menu.children" :key="subMenu.id">
              <!-- 二级菜单项 -->
              <el-menu-item
                  background-color="#545c64"
                  v-if="!subMenu.children?.length"
                  :index="subMenu.redirect"
                  @click="handleMenuClick(subMenu)"
              >
                <i :class="subMenu.icon"></i>
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
                  <i :class="subMenu.icon"></i>
                  <span>{{ subMenu.label }}</span>
                </template>

                <el-menu-item
                    v-for="grandChild in subMenu.children"
                    :key="grandChild.id"
                    :index="grandChild.redirect"
                    @click="handleMenuClick(grandChild)"
                >
                  <i :class="grandChild.icon"></i>
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

<style>
:root {
  --aside-width: 230px;
  --aside-collapse-width: 50px;
  --aside-border-color: #d2d6de;
}
</style>
<style lang="less" scoped>

.el-menu-vertical:not(.el-menu--collapse) {
  width: var(--aside-width);
  min-height: 400px;
}

.el-menu-vertical.el-menu--collapse {
  width: var(--aside-collapse-width);
  min-height: 400px;
}

.el-aside {
  width: var(--aside-collapse-width);
  border-right: 1px solid var(--aside-border-color);

  &:not(.el-aside-collapse) {
    width: var(--aside-width);
  }
}

.el-menu-vertical, .el-menu--vertical {
  border-right: none;

  .el-menu-item-styles() {
    height: 44px;
    line-height: 44px;
    padding-left: 20px !important;
    color: #444 !important;
  }

  .el-menu-item, .el-sub-menu :deep(.el-sub-menu__title) {
    height: 44px;
    display: block;
    padding: 12px 5px 12px 15px;
    position: relative;
    line-height: unset;

    * {
      vertical-align: middle;
    }

    i.fa {
      display: inline-block;
      width: 20px;
    }

    &:hover, &.is-active {
      background-color: #f4f4f5;
    }

    .el-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      text-align: center;
      font-size: 16px;

      &.el-sub-menu__icon-arrow {
        position: absolute;
        right: 10px;
        font-size: 14px;
        top: 50%;
        margin-top: -7px;
        width: unset;
        height: unset;
        transform: rotateZ(90deg);
      }
    }

  }
}

//.el-aside {
//  background-color: #f9fafc;
//  transition: width 0.3s;
//  border-right: 1px solid #d2d6de;
//
//  :root {
//    --el-menu-text-color: #333; // 修改字体颜色为深灰色
//  }
//
//  .el-menu-vertical {
//    border-right: none;
//    background-color: #f7f8fa;
//    color: var(--el-menu-text-color); // 使用变量定义的颜色
//    width: 230px;
//
//    :deep(.el-menu-item), :deep(.el-sub-menu__title) {
//      height: 44px;
//      line-height: 44px;
//      padding-left: 20px !important;
//      color: #444 !important;
//
//      &:hover, &.is-active {
//        background-color: #f4f4f5;
//        color: #000 !important;
//      }
//
//      .el-icon {
//        width: 20px;
//        height: 20px;
//        margin-right: 10px;
//        text-align: center;
//        font-size: 16px;
//      }
//    }
//
//    :deep(.el-sub-menu) {
//      &.is-active > .el-sub-menu__title {
//        color: #409EFF;
//      }
//    }
//  }
//}
//
//:deep(.el-menu--popup) {
//  min-width: 200px !important;
//  background-color: #304156;
//
//  .el-menu-item {
//    height: 44px !important;
//    line-height: 44px !important;
//    padding: 0 15px !important;
//
//    &:hover, &.is-active {
//      background-color: #f4f4f5;
//      color: #000 !important;
//    }
//  }
//}
//
//:deep(.el-popper) {
//  border: none !important;
//  padding: 0 !important;
//  margin: 0 !important;
//
//  .el-menu {
//    border: none !important;
//    margin: 0 !important;
//    padding: 0 !important;
//    background: #f4f4f5;
//  }
//}
//
//
//:deep(.el-sub-menu) {
//  &.is-active {
//    .el-menu {
//      background: #f4f4f5 !important;
//
//      .el-menu-item {
//        background: #f4f4f5 !important;
//      }
//    }
//  }
//}
//
//
//:deep(.el-sub-menu__title), :deep(.el-menu-item) {
//  i.fa {
//    display: inline-block;
//    width: 20px;
//  }
//
//  * {
//    vertical-align: middle;
//  }
//}
//


</style>
