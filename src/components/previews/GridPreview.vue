<template>
  <div class="grid-container" :style="gridStyle">
    <div class="grid-wrapper" :style="wrapperStyle">
      <div v-for="(item, index) in config.items" 
           :key="index"
           class="grid-item"
           :style="itemStyle"
           :class="{ 'drop-target': isDropTarget === index }"
           @dragover.prevent="handleDragOver($event, index)"
           @dragleave="handleDragLeave(index)"
           @drop.stop.prevent="handleDrop($event, index)">
        <div class="grid-item-content">
          <div class="grid-icon">{{ item.icon }}</div>
          <div class="grid-text">{{ item.text }}</div>
          <component v-if="item.type" 
                    :is="getComponentName(item.type)"
                    :config="item.config">
          </component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Grid',
  props: {
    config: {
      type: Object,
      default: () => ({
        columnNum: 4,
        gutter: 0,
        items: []
      })
    }
  },
  data() {
    return {
      isDropTarget: null
    }
  },
  computed: {
    gridStyle() {
      return {
        padding: `${this.config.gutter}px`
      }
    },
    wrapperStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${this.config.columnNum}, 1fr)`,
        gap: `${this.config.gutter}px`
      }
    },
    itemStyle() {
      return {
        padding: `${this.config.gutter}px`
      }
    }
  },
  methods: {
    getComponentName(type) {
      return `preview-${type.toLowerCase()}`
    },
    
    handleDragOver(e, index) {
      this.isDropTarget = index
      e.dataTransfer.dropEffect = 'copy'
    },
    
    handleDragLeave(index) {
      if (this.isDropTarget === index) {
        this.isDropTarget = null
      }
    },
    
    handleDrop(e, index) {
      e.stopPropagation()
      this.isDropTarget = null
      const componentData = JSON.parse(e.dataTransfer.getData('component'))
      this.$set(this.config.items, index, {
        ...this.config.items[index],
        type: componentData.type,
        config: componentData.config
      })
      this.$emit('update:config', this.config)
    }
  }
}
</script>

<style scoped>
.grid-container {
  width: 100%;
  box-sizing: border-box;
}

.grid-wrapper {
  width: 100%;
}

.grid-item {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 80px;
}

.grid-item.drop-target {
  background: rgba(64, 158, 255, 0.1);
  border: 1px dashed #409EFF;
}

.grid-item-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.grid-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.grid-text {
  font-size: 12px;
  color: #333;
}
</style> 