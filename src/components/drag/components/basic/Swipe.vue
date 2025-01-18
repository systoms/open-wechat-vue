<template>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.url" class="swipe-image" :alt="image.alt || `轮播图${index + 1}`">
      </van-swipe-item>
    </van-swipe>
  </template>
  
  <script setup>
  import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant'
  
  defineProps({
    images: {
      type: Array,
      default: () => ([])
    }
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