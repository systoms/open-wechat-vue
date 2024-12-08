<template>
  <div class="list-preview" :style="containerStyle">
    <div class="list-container">
      <div v-for="(item, index) in config.items" 
           :key="index" 
           class="list-item"
           :class="{ 'with-arrow': config.showArrow }">
        <img v-if="item.image" :src="item.image" :alt="item.title">
        <div class="item-content">
          <div class="item-title">{{ item.title }}</div>
          <div v-if="item.desc" class="item-desc">{{ item.desc }}</div>
        </div>
        <i v-if="config.showArrow" class="arrow">›</i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListPreview',
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
    }
  }
}
</script>

<style scoped>
.list-container {
  background: #fff;
  border-radius: 8px;
}
.list-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
}
.list-item:last-child {
  border-bottom: none;
}
.list-item img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
}
.item-content {
  flex: 1;
}
.item-title {
  font-size: 14px;
  color: #333;
}
.item-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
.arrow {
  color: #ccc;
  font-size: 16px;
}
</style> 