import { defineStore } from "pinia";
import { getInfo } from '@/api/permission/user';

export const useMenuStore = defineStore('menu', {
    state: () => ({
        topMenus: [],
        currentTopMenu: null,
        selectedMenuIds: []
    }),
    actions: {
        setTopMenus(menus) {
            this.topMenus = menus
            if (menus.length > 0) {
                this.setCurrentTopMenu(menus[0])
            }
        },
        setCurrentTopMenu(menu) {
            this.currentTopMenu = menu
            this.selectedMenuIds = []
        },
        toggleMenu(menuId) {
            const index = this.selectedMenuIds.indexOf(menuId)
            if (index === -1) {
                this.selectedMenuIds.push(menuId)
            } else {
                this.selectedMenuIds.splice(index, 1)
            }
        },
        clearMenus() {
            this.topMenus = []
            this.currentTopMenu = null
        }
    }
});