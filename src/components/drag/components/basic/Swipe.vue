<template>
  <van-swipe class="my-swipe" :autoplay="modelValue.autoplay" indicator-color="white">
    <van-swipe-item v-for="(image, index) in modelValue.images" :key="index">
      <img :src="image.url" class="swipe-image" :alt="image.alt || `轮播图${index + 1}`">
    </van-swipe-item>
  </van-swipe>
</template>

<script setup>
import {Swipe as VanSwipe, SwipeItem as VanSwipeItem} from 'vant'
import {Picture} from "@element-plus/icons-vue";
import {defineOptions} from 'vue'

defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      autoplay: 3000,
      images: [
        {url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', alt: '图片1'},
        {url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg', alt: '图片2'},
        {url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg', alt: '图片3'},
      ]
    })
  },
  type: {
    type: String,
    default: () => "vant-swipe"
  },
  label: {
    type: String,
    default: () => "轮播图"
  },
  description: {
    type: String,
    default: () => "用于循环播放图片、视频等内容"
  },
  icon: {
    type: Object,
    default: () => Picture
  },
})
</script>

<style scoped>
.my-swipe {
  height: 200px;
  margin: 5px 10px;
  border-radius: 5px;
}

.swipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>