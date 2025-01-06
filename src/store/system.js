import { defineStore } from "pinia";
import { getInfo } from '@/api/permission/user';

export const useMenuStore = defineStore('menu', {
    state: () => ({
        menus: []
    }),
    actions: {
        setMenus(menus) {
            this.menus = menus
        },
        clearMenus() {
            this.menus = []
        }
    }
});