<script setup>
import {onMounted} from 'vue';
import {useMenuStore} from '@/store/system';
import {useRouter} from 'vue-router';
import {useTabStore} from '@/store/tab';

const router = useRouter();
const menuStore = useMenuStore();
const tabStore = useTabStore();
const {initMenu, toggleMenu} = menuStore;

const handleMenuClick = (menu) => {
  toggleMenu(menu.id);
  if (menu.path) {
    tabStore.addTab({
      path: menu.path,
      title: menu.name,
      name: menu.name
    });
    router.push(menu.path);
  }
};

onMounted(() => {
  initMenu();
});
</script>

<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <ul class="sidebar-menu" data-widget="tree">
        <template v-for="(menu, index) in menuStore.menus" :key="index">
          <!-- Header menu item -->
          <li v-if="menu.type === 0" class="header">
            {{ menu.name }}
          </li>
          
          <!-- Regular menu item with potential children -->
          <li v-if="menu.type === 1" 
              :class="{
                treeview: true,
                active: menu.selected,
                'menu-open': menu.selected && menu.children?.length
              }">
            <a @click.prevent="handleMenuClick(menu)">
              <i :class="menu.icon"></i>
              <span>{{ menu.name }}</span>
              <span v-if="menu.children?.length" class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
            </a>
            
            <!-- Submenu items -->
            <ul v-if="menu.children?.length" class="treeview-menu">
              <li v-for="(subMenu, subIndex) in menu.children"
                  :key="subIndex"
                  :class="{active: subMenu.selected}"
                  @click.prevent="handleMenuClick(subMenu)">
                <a>
                  <i :class="subMenu.icon"></i>
                  {{ subMenu.name }}
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