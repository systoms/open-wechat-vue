import { defineStore } from "pinia";
import { getSystemMenu } from '@/api/system';

export const useMenuStore = defineStore('menus', {
    state: () => ({
        menus: [],
        oldMenus: [],
        menuKeyword: '',
        isSearch: false,
    }),
    actions: {
        async initMenu() {
            try {
                const response = await getSystemMenu();
                this.menus = this.addFieldToMenus(response.data.menus, 'selected', false);
                console.log('Success:', this.menus);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        },
        addFieldToMenus(menuArray, newFieldName, newFieldValue) {
            const stack = [...menuArray];

            while (stack.length > 0) {
                const currentMenu = stack.pop();

                // 在当前对象上新增字段
                currentMenu[newFieldName] = newFieldValue;

                // 如果存在子菜单，将子菜单添加到栈中
                if (currentMenu.children) {
                    stack.push(...currentMenu.children);
                }
            }

            return menuArray;
        },
        searchMenus() {
            if (!this.isSearch) {
                this.oldMenus = this.menus;
                this.isSearch = true;
            }
            if (this.menuKeyword === '') {
                this.menus = this.oldMenus;
                this.isSearch = false;
                return;
            }

            const regex = new RegExp(this.menuKeyword, 'i');  // 'i' 标志表示忽略大小写

            this.menus = this.oldMenus.map(menu => {
                // 判断一级菜单是否匹配
                let searchMenuResult = regex.test(menu.name);

                if (menu.children) {
                    // 处理二级菜单，保留匹配的子菜单
                    menu.children = menu.children.map(subMenu => {
                        if (regex.test(subMenu.name)) {
                            searchMenuResult = true;
                            return subMenu; // 保留匹配的子菜单
                        }
                        return undefined; // 不匹配的子菜单返回 undefined
                    }).filter(subMenu => subMenu !== undefined); // 过滤掉 undefined
                }

                // 如果一级菜单或其子菜单有匹配项，保留该菜单
                if (searchMenuResult) {
                    return menu;
                }
                return undefined; // 不匹配的一级菜单返回 undefined
            }).filter(menu => menu !== undefined); // 过滤掉 undefined
        },
        toggleMenu(menuId) {
            this.menus.map(menu => {
                // 检查当前菜单是否匹配
                if (menu.id === menuId) {
                    menu.selected = !menu.selected; // 切换选中状态
                } else {
                    menu.selected = false;
                }

                // 如果有子菜单，遍历子菜单
                if (menu.children) {
                    menu.children = menu.children.map(subMenu => {
                        if (subMenu.id === menuId) {
                            subMenu.selected = !subMenu.selected; // 切换选中状态
                            menu.selected = true; // 设置父菜单的 `subMenu` 字段为 `true`
                        } else {
                            subMenu.selected = false;
                        }
                        return subMenu;
                    });
                }

                return menu;
            });
        },
        highlightCurrentMenu(menuId) {
            // this.menus.forEach(menu => {
            //     if (menu.id === menuId) {
            //         this.expandedMenuKeys.add(menu.id);
            //     }
            //     if (menu.children) {
            //         menu.children.forEach(subMenu => {
            //             if (subMenu.id === menuId) {
            //                 this.expandedMenuKeys.add(subMenu.id);
            //                 this.expandedMenuKeys.add(menu.id);
            //             }
            //         });
            //     }
            // });
        },
        findMenuByUrl(url) {
            const findInMenus = (menus) => {
                for (const menu of menus) {
                    if (menu.url === url) {
                        return menu
                    }
                    if (menu.children?.length) {
                        const found = findInMenus(menu.children)
                        if (found) return found
                    }
                }
                return null
            }

            return findInMenus(this.menus)
        }
    },
});