<template>
  <div class="swiper-preview" :style="containerStyle">
    <div class="swiper-container">
      <div class="swiper-items" :style="itemsStyle">
        <div v-for="(item, index) in config.items" 
             :key="index" 
             class="swiper-item">
          <img :src="item.image" :alt="item.title">
        </div>
      </div>
      <div class="swiper-dots" v-if="config.showDots">
        <span v-for="(item, index) in config.items" 
              :key="index" 
              class="dot"
              :class="{ active: index === 0 }">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwiperPreview',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    containerStyle() {
      return {
        padding: `${this.config.padding || 10}px`
      }
    },
    itemsStyle() {
      return {
        height: `${this.config.height || 200}px`
      }
    }
  }
}
</script>

<style scoped>
.swiper-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}
.swiper-items {
  display: flex;
  width: 100%;
}
.swiper-item {
  flex-shrink: 0;
  width: 100%;
}
.swiper-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.swiper-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
}
.dot.active {
  background: #fff;
}
</style> 