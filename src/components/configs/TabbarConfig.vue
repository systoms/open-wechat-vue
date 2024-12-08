<template>
  <div class="tabbar-config">
    <!-- 移除显示选项，只保留 Tab 项配置 -->
    <div v-for="(item, index) in localValue.items" :key="index" class="tabbar-item-config">
      <div class="item-header">
        <span>标签 {{ index + 1 }}</span>
        <i class="delete-btn" @click="deleteItem(index)" v-if="localValue.items.length > 2">×</i>
      </div>
      <div class="config-row">
        <label>图标</label>
        <input v-model="item.icon" type="text" placeholder="输入emoji或图标">
      </div>
      <div class="config-row">
        <label>文本</label>
        <input v-model="item.text" type="text" placeholder="输入标签文本">
      </div>
      <div class="config-row">
        <label>链接</label>
        <input v-model="item.url" type="text" placeholder="/pages/xxx/index">
      </div>
    </div>
    
    <div class="add-item" @click="addItem" v-if="localValue.items.length < 5">
      <i>+</i> 添加标签项（最多5个）
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabbarConfig',
  props: {
    value: {
      type: Object,
      default: () => ({
        show: true,
        items: [
          { icon: '🏠', text: '首页', url: '/pages/home/index' },
          { icon: '👤', text: '我的', url: '/pages/user/index' }
        ]
      })
    }
  },
  data() {
    return {
      localValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.localValue = JSON.parse(JSON.stringify(newVal))
      },
      deep: true
    },
    localValue: {
      handler(val) {
        this.$emit('update', val)
      },
      deep: true
    }
  },
  methods: {
    addItem() {
      if (this.localValue.items.length < 5) {
        this.localValue.items.push({
          icon: '📦',
          text: '新标签',
          url: '/pages/new/index'
        })
      }
    },
    deleteItem(index) {
      if (this.localValue.items.length > 2) {
        this.localValue.items.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.tabbar-config {
  padding: 10px 0;
}

.tabbar-item-config {
  background: #f5f5f5;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.item-header span {
  font-weight: 500;
  color: #333;
}

.delete-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4d4f;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #fff1f0;
}

.config-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.config-row:last-child {
  margin-bottom: 0;
}

.config-row label {
  width: 60px;
  font-size: 14px;
  color: #666;
}

.config-row input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
}

.config-row input:hover {
  border-color: #409EFF;
}

.config-row input:focus {
  border-color: #409EFF;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.add-item {
  margin-top: 10px;
  padding: 8px;
  text-align: center;
  background: #f0f0f0;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-item:hover {
  background: #e0e0e0;
  color: #409EFF;
}

.add-item i {
  font-style: normal;
  margin-right: 4px;
}
</style> 