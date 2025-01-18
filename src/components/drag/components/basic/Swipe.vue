<template>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.url" class="swipe-image" :alt="image.alt || `轮播图${index + 1}`">
      </van-swipe-item>
    </van-swipe>
  </template>
  
  <script setup>
  import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant'
  import {Picture} from "@element-plus/icons-vue";
  import { defineOptions } from 'vue'

  const createDefaultSwipeProps = () => ({
    autoplay: 3000,
    images: [
      {url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', alt: '图片1'},
      {url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg', alt: '图片2'},
      {url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg', alt: '图片3'},
    ]
  })

  defineProps({
    images: {
      type: Array,
      default: () => ([])
    }
  })
  defineExpose({
    __config: {
      type: 'vant-swipe',
      label: '轮播图',
      description: '用于循环播放图片、视频等内容',
      icon: Picture,
      getDefaultProps: createDefaultSwipeProps
    }
  });
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