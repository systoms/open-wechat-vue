import { defineStore } from 'pinia'
import { useMenuStore } from './system'

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [],
    activeTab: ''
  }),
  
  actions: {
    addTab(tab) {
      // 从菜单store获取菜单信息
      const menuStore = useMenuStore()
      const currentTopMenu = menuStore.currentTopMenu
      
      // 只在当前顶部菜单的子菜单中查找
      const menuInfo = currentTopMenu ? 
        this.findMenuByPath(currentTopMenu.children || [], tab.path) : 
        null
      
      // 如果在当前可见菜单中找不到，则不添加tab
      if (!menuInfo) {
        return
      }

      // 使用菜单信息更新tab
      tab.title = menuInfo.label

      const exists = this.tabs.some(t => t.path === tab.path)
      if (!exists) {
        this.tabs.push(tab)
      }
      this.activeTab = tab.name
    },

    findMenuByPath(menus, path) {
      for (const menu of menus) {
        if (menu.redirect === path) {
          return menu
        }
        if (menu.children) {
          const found = this.findMenuByPath(menu.children, path)
          if (found) return found
        }
      }
      return null
    },
    
    removeTab(tabName) {
      const index = this.tabs.findIndex(tab => tab.name === tabName)
      if (index > -1) {
        this.tabs.splice(index, 1)
        // 如果删除的是当前激活的标签，则激活前一个标签
        if (this.activeTab === tabName) {
          const newActiveTab = this.tabs[index - 1] || this.tabs[index] || this.tabs[0]
          if (newActiveTab) {
            this.activeTab = newActiveTab.name
          }
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
    },

    // 清除所有标签页
    clearTabs() {
      this.tabs = []
      this.activeTab = ''
    },

    setActiveTab(tabName) {
      this.activeTab = tabName
    }
  }
})