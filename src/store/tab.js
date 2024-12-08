import { defineStore } from 'pinia'
import { useMenuStore } from './system'

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [],
    activeTab: null
  }),
  
  actions: {
    addTab(tab) {
      // 从菜单store获取菜单信息
      const menuStore = useMenuStore()
      const menuInfo = menuStore.findMenuByUrl(tab.path)
      
      // 如果找到菜单信息，使用菜单的名称
      if (menuInfo) {
        tab.title = menuInfo.name
      }

      const exists = this.tabs.some(t => t.path === tab.path)
      if (!exists) {
        this.tabs.push(tab)
      }
      this.activeTab = tab.path
    },
    
    removeTab(path) {
      const index = this.tabs.findIndex(tab => tab.path === path)
      if (index !== -1) {
        this.tabs.splice(index, 1)
        // 如果关闭的是当前激活的标签，切换到最后一个标签
        if (path === this.activeTab && this.tabs.length > 0) {
          this.activeTab = this.tabs[this.tabs.length - 1].path
        }
      }
    },

    // 激活指定标签
    activateTab(path) {
      this.activeTab = path
    },

    // 关闭其他标签
    closeOtherTabs(path) {
      const tab = this.tabs.find(t => t.path === path)
      if (tab) {
        this.tabs = [tab]
        this.activeTab = tab.path
      }
    },

    // 关闭右侧标签
    closeRightTabs(path) {
      const index = this.tabs.findIndex(t => t.path === path)
      if (index > -1) {
        this.tabs = this.tabs.slice(0, index + 1)
        if (this.activeTab !== path && !this.tabs.some(t => t.path === this.activeTab)) {
          this.activeTab = path
        }
      }
    }
  }
})