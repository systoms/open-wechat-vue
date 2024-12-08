<template>
  <div class="image-config">
    <div class="config-item">
      <label>图片地址</label>
      <div class="image-upload">
        <input 
          type="text" 
          v-model="localConfig.src" 
          @input="updateConfig"
          placeholder="请输入图片URL">
        <button @click="openUploader">上传</button>
      </div>
    </div>
    
    <div class="config-item">
      <label>显示模式</label>
      <select v-model="localConfig.mode" @change="updateConfig">
        <option value="cover">填充</option>
        <option value="contain">适应</option>
        <option value="fill">拉伸</option>
        <option value="none">原始</option>
      </select>
    </div>
    
    <div class="config-item">
      <label>宽度</label>
      <input 
        type="text" 
        v-model="localConfig.width" 
        @input="updateConfig"
        placeholder="支持px/%">
    </div>
    
    <div class="config-item">
      <label>高度</label>
      <input 
        type="text" 
        v-model="localConfig.height" 
        @input="updateConfig"
        placeholder="支持px/%">
    </div>
    
    <div class="config-item">
      <label>圆角</label>
      <input 
        type="number" 
        v-model.number="localConfig.borderRadius" 
        @input="updateConfig"
        min="0"
        max="100">
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
  </div>
</template>

<script>
export default {
  name: 'ImageConfig',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localConfig: {
        src: '',
        mode: 'cover',
        width: '100%',
        height: '200px',
        borderRadius: 0,
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
    },
    openUploader() {
      // TODO: 实现图片上传功能
      console.log('打开图片上传')
    }
  }
}
</script>

<style scoped>
.image-config {
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

.image-upload {
  display: flex;
  gap: 8px;
}

.image-upload input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.image-upload button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

select, input[type="text"], input[type="number"] {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
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