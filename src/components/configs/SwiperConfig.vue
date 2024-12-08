<template>
  <div class="swiper-config">
    <div class="config-item">
      <div class="item-header">
        <label>轮播图列表</label>
        <button class="add-btn" @click="addItem">添加图片</button>
      </div>
      
      <div class="items-container">
        <div v-for="(item, index) in localConfig.items" 
             :key="index" 
             class="swiper-item">
          <div class="item-header">
            <span>图片 {{ index + 1 }}</span>
            <i class="delete-btn" @click="removeItem(index)">×</i>
          </div>
          <div class="item-content">
            <div class="form-item">
              <label>图片地址</label>
              <div class="image-input">
                <input type="text" 
                       v-model="item.image" 
                       @input="updateConfig"
                       placeholder="请输入图片URL">
                <button @click="openUploader(index)">上传</button>
              </div>
            </div>
            <div class="form-item">
              <label>标题</label>
              <input type="text" 
                     v-model="item.title" 
                     @input="updateConfig"
                     placeholder="请输入标题">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="config-item">
      <label>轮播高度</label>
      <div class="size-control">
        <input type="number" 
               v-model.number="localConfig.height" 
               @input="updateConfig"
               min="100"
               max="500">
        <span class="unit">px</span>
      </div>
    </div>

    <div class="config-item">
      <label>内边距</label>
      <div class="size-control">
        <input type="number" 
               v-model.number="localConfig.padding" 
               @input="updateConfig"
               min="0"
               max="100">
        <span class="unit">px</span>
      </div>
    </div>

    <div class="config-item">
      <label class="checkbox-label">
        <input type="checkbox" 
               v-model="localConfig.showDots" 
               @change="updateConfig">
        显示指示点
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwiperConfig',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localConfig: {
        items: [],
        height: 200,
        padding: 10,
        showDots: true,
        ...this.value
      }
    }
  },
  methods: {
    updateConfig() {
      this.$emit('update', { ...this.localConfig })
    },
    addItem() {
      this.localConfig.items.push({
        image: '',
        title: ''
      })
      this.updateConfig()
    },
    removeItem(index) {
      this.localConfig.items.splice(index, 1)
      this.updateConfig()
    },
    openUploader(index) {
      // TODO: 实现图片上传功能
      console.log('打开图片上传器', index)
    }
  }
}
</script>

<style scoped>
.swiper-config {
  padding: 15px;
}

.config-item {
  margin-bottom: 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-header label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.add-btn {
  padding: 4px 12px;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.swiper-item {
  background: #f5f5f5;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
}

.swiper-item .item-header {
  margin-bottom: 12px;
}

.delete-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  cursor: pointer;
  font-style: normal;
}

.form-item {
  margin-bottom: 12px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #666;
}

.image-input {
  display: flex;
  gap: 8px;
}

.image-input input {
  flex: 1;
}

.image-input button {
  padding: 4px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.size-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-control input {
  width: 80px;
}

.unit {
  color: #666;
  font-size: 13px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
</style> 