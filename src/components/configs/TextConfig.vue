<template>
  <div class="text-config">
    <div class="config-item">
      <label>文本内容</label>
      <textarea 
        v-model="localConfig.content" 
        @input="updateConfig"
        placeholder="请输入文本内容">
      </textarea>
    </div>
    
    <div class="config-item">
      <label>字体大小</label>
      <div class="size-control">
        <input 
          type="number" 
          v-model.number="localConfig.fontSize" 
          @input="updateConfig"
          min="12"
          max="72">
        <div class="size-buttons">
          <button @click="adjustSize(-1)">-</button>
          <button @click="adjustSize(1)">+</button>
        </div>
      </div>
    </div>
    
    <div class="config-item">
      <label>文字颜色</label>
      <input 
        type="color" 
        v-model="localConfig.color" 
        @input="updateConfig">
    </div>
    
    <div class="config-item">
      <label>对齐方式</label>
      <div class="align-buttons">
        <button 
          v-for="align in ['left', 'center', 'right']"
          :key="align"
          :class="{ active: localConfig.align === align }"
          @click="setAlign(align)">
          {{ getAlignText(align) }}
        </button>
      </div>
    </div>
    
    <div class="config-item">
      <label>内边距</label>
      <input 
        type="number" 
        v-model.number="localConfig.padding" 
        @input="updateConfig"
        min="0"
        max="100">
    </div>
    
    <div class="config-item">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          v-model="localConfig.bold" 
          @change="updateConfig">
        文字加粗
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextConfig',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localConfig: {
        content: '',
        fontSize: 14,
        color: '#333333',
        align: 'left',
        padding: 10,
        bold: false,
        ...this.value
      }
    }
  },
  methods: {
    updateConfig() {
      this.$emit('update', { ...this.localConfig })
    },
    adjustSize(delta) {
      this.localConfig.fontSize = Math.max(12, Math.min(72, this.localConfig.fontSize + delta))
      this.updateConfig()
    },
    setAlign(align) {
      this.localConfig.align = align
      this.updateConfig()
    },
    getAlignText(align) {
      const alignMap = {
        left: '左对齐',
        center: '居中',
        right: '右对齐'
      }
      return alignMap[align]
    }
  }
}
</script>

<style scoped>
.text-config {
  padding: 15px;
}

.config-item {
  margin-bottom: 15px;
}

.config-item label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.size-control {
  display: flex;
  gap: 10px;
  align-items: center;
}

.size-control input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.size-buttons {
  display: flex;
  gap: 4px;
}

.size-buttons button {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.align-buttons {
  display: flex;
  gap: 8px;
}

.align-buttons button {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.align-buttons button.active {
  background: #007aff;
  color: #fff;
  border-color: #007aff;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

input[type="color"] {
  width: 100%;
  height: 32px;
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>