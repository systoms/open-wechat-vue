<template>
  <div class="button-config">
    <div class="config-item">
      <label>按钮文本</label>
      <input type="text" v-model="localConfig.text" @input="updateConfig">
    </div>
    
    <div class="config-item">
      <label>按钮类型</label>
      <div class="button-types">
        <button 
          v-for="type in ['default', 'primary', 'danger']"
          :key="type"
          :class="['type-btn', type, { active: localConfig.type === type }]"
          @click="setType(type)">
          {{ getTypeText(type) }}
        </button>
      </div>
    </div>
    
    <div class="config-item">
      <label>字体大小</label>
      <div class="size-control">
        <input type="number" v-model.number="localConfig.fontSize" @input="updateConfig">
        <div class="size-buttons">
          <button @click="adjustSize(-1)">-</button>
          <button @click="adjustSize(1)">+</button>
        </div>
      </div>
    </div>
    
    <div class="config-item">
      <label>按钮宽度</label>
      <select v-model="localConfig.width" @change="updateConfig">
        <option value="auto">自适应</option>
        <option value="100%">撑满</option>
      </select>
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
      <input type="number" v-model.number="localConfig.padding" @input="updateConfig">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonConfig',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localConfig: {
        text: '按钮',
        type: 'default',
        fontSize: 14,
        width: 'auto',
        align: 'center',
        padding: 10,
        ...this.value
      }
    }
  },
  methods: {
    updateConfig() {
      this.$emit('update', { ...this.localConfig })
    },
    setType(type) {
      this.localConfig.type = type
      this.updateConfig()
    },
    setAlign(align) {
      this.localConfig.align = align
      this.updateConfig()
    },
    adjustSize(delta) {
      this.localConfig.fontSize = Math.max(12, Math.min(24, this.localConfig.fontSize + delta))
      this.updateConfig()
    },
    getTypeText(type) {
      const typeMap = {
        default: '默认',
        primary: '主要',
        danger: '危险'
      }
      return typeMap[type]
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
.button-config {
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

.button-types {
  display: flex;
  gap: 8px;
}

.type-btn {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.type-btn.default {
  background: #fff;
  color: #333;
}

.type-btn.primary {
  background: #007aff;
  color: #fff;
  border-color: #007aff;
}

.type-btn.danger {
  background: #ff3b30;
  color: #fff;
  border-color: #ff3b30;
}

.type-btn.active {
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.size-control {
  display: flex;
  gap: 10px;
  align-items: center;
}

.size-control input {
  width: 60px;
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
</style> 