<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useTabStore } from '@/store/tab'
import { watch } from 'vue'

const route = useRoute()
const router = useRouter()
const tabStore = useTabStore()

// 监听路由变化，添加新标签
watch(() => route.path, (newPath) => {
  const tab = {
    path: newPath,
    title: route.meta.title || route.name || 'Unnamed Page',
    name: route.name
  }
  tabStore.addTab(tab)
}, { immediate: true })

// 切换标签
const switchTab = (path) => {
  tabStore.setActiveTab(path)
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
</script>

<template>
  <div class="content-tabs">
    <nav class="page-tabs">
      <div class="page-tabs-content">
        <a v-for="tab in tabStore.tabs"
           :key="tab.path"
           :class="['tab', { active: tab.path === tabStore.activeTab }]"
           @click="switchTab(tab.path)">
          {{ tab.title }}
          <i v-if="tabStore.tabs.length > 1"
             class="fa fa-times"
             @click.stop="closeTab(tab.path)">
          </i>
        </a>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.content-tabs {
  position: relative;
  height: 40px;
  background: #fff;
  line-height: 40px;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.page-tabs {
  height: 40px;
  overflow: hidden;
  position: relative;
  padding: 0 10px;
}

.page-tabs-content {
  float: left;
}

.tab {
  position: relative;
  background: #fafafa;
  margin-right: 4px;
  padding: 0 26px 0 15px;
  display: inline-block;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  color: #666;
  font-size: 13px;
  margin-top: 4px;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab:hover {
  background: #f4f4f4;
  color: #333;
}

.tab.active {
  background: #fff;
  color: #23508e;
  border-color: #23508e;
  z-index: 1;
}

.tab i {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #999;
  transition: all 0.2s ease;
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  border-radius: 50%;
}

.tab i:hover {
  color: #fff;
  background-color: #ff4d4f;
}

/* 添加动画效果 */
.tab {
  animation: tabFadeIn 0.2s ease-out;
}

@keyframes tabFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 优化滚动条 */
.page-tabs {
  overflow-x: auto;
  overflow-y: hidden;
}

.page-tabs::-webkit-scrollbar {
  height: 2px;
}

.page-tabs::-webkit-scrollbar-track {
  background: transparent;
}

.page-tabs::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
}

.page-tabs:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
</style> 