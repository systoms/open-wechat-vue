import { defineStore } from 'pinia'

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [],
    activeTab: null
  }),
  
  actions: {
    addTab(tab) {
      const existingTab = this.tabs.find(t => t.path === tab.path)
      if (!existingTab) {
        this.tabs.push(tab)
      }
      this.activeTab = tab.path // 使用 path 作为标识符
    },
    
    removeTab(path) {
      const index = this.tabs.findIndex(tab => tab.path === path)
      if (index !== -1) {
        this.tabs.splice(index, 1)
        // 如果关闭的是当前激活的标签，则激活最后一个标签
        if (path === this.activeTab && this.tabs.length > 0) {
          this.activeTab = this.tabs[this.tabs.length - 1].path
        }
      }
    },
    
    setActiveTab(path) {
      this.activeTab = path
    },
    
    clearTabs() {
      this.tabs = []
      this.activeTab = null
    }
  }
})