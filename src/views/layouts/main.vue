<script setup>

import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import Footer from "@/components/Footer.vue";
import TabView from "@/components/TabView.vue";

import "@/assets/font-awesome/less/font-awesome.less";
import "@/assets/bootstrap/less/bootstrap.less";
import "@/assets/AdminLTE/AdminLTE.less";
import "@/assets/AdminLTE/skins/skin-blue-light.less";

document.body.classList = 'skin-blue-light fixed sidebar-mini sidebar-mini-expand-feature';

</script>

<template>
  <div class="wrapper">
    <Header></Header>
    <Aside></Aside>
    <div class="content-wrapper" style="min-height: calc(100vh - 50px);">
      <TabView />
      <router-view/>
    </div>
    <Footer></Footer>
  </div>
</template>

<style scoped>
.content-wrapper{
  background: #fff;
}
</style>