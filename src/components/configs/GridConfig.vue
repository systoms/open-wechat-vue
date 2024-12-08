<template>
  <div class="grid-config">
    <div class="config-row">
      <label>列数</label>
      <input type="number" v-model.number="localValue.columnNum" min="2" max="5" @input="updateConfig">
    </div>
    <div class="config-row">
      <label>边距</label>
      <input type="number" v-model.number="localValue.gutter" min="0" max="20" @input="updateConfig">
    </div>
    <div class="grid-items">
      <div v-for="(item, index) in localValue.items" :key="index" class="grid-item-config">
        <div class="item-header">
          <span>宫格项 {{ index + 1 }}</span>
          <i class="delete-btn" @click="deleteItem(index)" v-if="localValue.items.length > 2">×</i>
        </div>
        <div class="config-row">
          <label>图标</label>
          <input v-model="item.icon" type="text" @input="updateConfig">
        </div>
        <div class="config-row">
          <label>文本</label>
          <input v-model="item.text" type="text" @input="updateConfig">
        </div>
      </div>
    </div>
    <div class="add-item" @click="addItem" v-if="localValue.items.length < 8">
      <i>+</i> 添加宫格项（最多8个）
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridConfig',
  props: {
    value: {
      type: Object,
      default: () => ({
        columnNum: 4,
        gutter: 0,
        items: [
          { icon: '📱', text: '选项1' },
          { icon: '💻', text: '选项2' },
          { icon: '🖥️', text: '选项3' },
          { icon: '📟', text: '选项4' }
        ]
      })
    }
  },
  data() {
    return {
      localValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  methods: {
    updateConfig() {
      this.$emit('update', this.localValue)
    },
    addItem() {
      if (this.localValue.items.length < 8) {
        this.localValue.items.push({
          icon: '📦',
          text: '新选项'
        })
        this.updateConfig()
      }
    },
    deleteItem(index) {
      if (this.localValue.items.length > 2) {
        this.localValue.items.splice(index, 1)
        this.updateConfig()
      }
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.localValue = JSON.parse(JSON.stringify(newVal))
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.grid-config {
  padding: 10px 0;
}

.config-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
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
}

.config-row input:hover {
  border-color: #409EFF;
}

.config-row input:focus {
  border-color: #409EFF;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.grid-item-config {
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