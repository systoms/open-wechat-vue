<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useTabStore } from '@/store/tab'
import { watch, ref,onMounted,onUnmounted} from 'vue'

const route = useRoute()
const router = useRouter()
const tabStore = useTabStore()

// 右键菜单相关
const contextMenu = ref(null)
const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const currentContextTab = ref(null)

// 监听路由变化，添加新标签
watch(() => route.path, (newPath) => {
  tabStore.addTab({
    path: newPath,
    title: route.meta.title || 'Unnamed Page',
    name: route.name
  })
}, { immediate: true })

// 切换标签
const switchTab = (path) => {
  tabStore.activateTab(path)
  router.push(path)
}

// 关闭标签
const closeTab = (path) => {
  tabStore.removeTab(path)
  if (path === route.path) {
    const lastTab = tabStore.tabs[tabStore.tabs.length - 1]
    if (lastTab) {
      router.push(lastTab.path)
    }
  }
}

// 处理右键菜单
const handleContextMenu = (e, tab) => {
  e.preventDefault()
  currentContextTab.value = tab
  contextMenuPosition.value = {
    x: e.clientX,
    y: e.clientY
  }
  showContextMenu.value = true
}

// 关闭右键菜单
const closeContextMenu = () => {
  showContextMenu.value = false
}

// 右键菜单操作
const contextMenuActions = {
  closeTab: () => {
    if (currentContextTab.value) {
      closeTab(currentContextTab.value.path)
    }
    closeContextMenu()
  },
  closeOthers: () => {
    if (currentContextTab.value) {
      tabStore.closeOtherTabs(currentContextTab.value.path)
      if (route.path !== currentContextTab.value.path) {
        router.push(currentContextTab.value.path)
      }
    }
    closeContextMenu()
  },
  closeRight: () => {
    if (currentContextTab.value) {
      tabStore.closeRightTabs(currentContextTab.value.path)
      if (!tabStore.tabs.some(tab => tab.path === route.path)) {
        router.push(currentContextTab.value.path)
      }
    }
    closeContextMenu()
  }
}

// 点击页面其他地方关闭右键菜单
const handleClickOutside = (e) => {
  if (contextMenu.value && !contextMenu.value.contains(e.target)) {
    closeContextMenu()
  }
}

// 监听全局点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="content-tabs">
    <nav class="page-tabs">
      <div class="page-tabs-content">
        <a v-for="tab in tabStore.tabs"
           :key="tab.path"
           :class="['tab', { active: tab.path === tabStore.activeTab }]"
           @click="switchTab(tab.path)"
           @contextmenu="handleContextMenu($event, tab)">
          {{ tab.title }}
          <i v-if="tabStore.tabs.length > 1"
             class="fa fa-times-circle"
             @click.stop="closeTab(tab.path)">
          </i>
        </a>
      </div>
    </nav>

    <!-- 右键菜单 -->
    <div ref="contextMenu"
         v-show="showContextMenu"
         class="context-menu"
         :style="{
           left: contextMenuPosition.x + 'px',
           top: contextMenuPosition.y + 'px'
         }">
      <ul>
        <li @click="contextMenuActions.closeTab">
          <i class="fa fa-times"></i> 关闭标签
        </li>
        <li @click="contextMenuActions.closeOthers">
          <i class="fa fa-times-circle"></i> 关闭其他标签
        </li>
        <li @click="contextMenuActions.closeRight">
          <i class="fa fa-times-circle-o"></i> 关闭右侧标签
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.content-tabs {
  position: relative;
  height: 42px;
  background: #fafafa;
  line-height: 40px;
  border-bottom: 2px solid #e7eaec;
}

.page-tabs {
  height: 40px;
  overflow: hidden;
  position: relative;
}

.page-tabs-content {
  float: left;
}

.tab {
  position: relative;
  background: #fafafa;
  margin-right: 1px;
  padding: 0 15px;
  display: inline-block;
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.tab.active {
  background: #fff;
  color: #23508e;
  border-bottom: 2px solid #23508e;
  z-index: 1;
}

.tab i {
  margin-left: 5px;
  font-size: 12px;
}

.tab i:hover {
  color: #c00;
}

/* 修改右键菜单样式 */
.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #e7eaec;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  font-size: 13px;
}

.context-menu ul {
  list-style: none;
  padding: 2px 0;
  margin: 0;
}

.context-menu li {
  padding: 5px 15px;
  cursor: pointer;
  white-space: nowrap;
  line-height: 20px;
}

.context-menu li:hover {
  background: #f5f5f5;
}

.context-menu i {
  margin-right: 5px;
  width: 14px;
  text-align: center;
}

/* 标签hover效果 */
.tab:hover {
  background: #f5f5f5;
}
</style> 