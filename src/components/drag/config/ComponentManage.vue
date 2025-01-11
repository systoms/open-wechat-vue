<template>
  <div class="component-manage">
    <el-empty v-if="!usedComponents.length" description="暂无组件" />
    <div v-else class="component-list">
        <div v-for="(item, index) in usedComponents" 
            :key="item.id"
            class="component-item">
        <div class="item-info">
            <el-icon><component :is="getComponentIcon(item.icon)" /></el-icon>
            <span>{{ getComponentLabel(item) }}</span>
        </div>
        <div class="item-actions">
            <el-button-group>
            <el-button 
                type="primary" 
                link 
                :disabled="index === 0"
                @click="moveComponent(index, 'up')">
                <el-icon><ArrowUp /></el-icon>
            </el-button>
            <el-button 
                type="primary" 
                link 
                :disabled="index === usedComponents.length - 1"
                @click="moveComponent(index, 'down')">
                <el-icon><ArrowDown /></el-icon>
            </el-button>
            <el-button 
                type="danger" 
                link 
                @click="removeComponent(index)">
                <el-icon><Delete /></el-icon>
            </el-button>
            </el-button-group>
        </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowUp, ArrowDown, Delete } from '@element-plus/icons-vue'
import { it } from 'element-plus/es/locales.mjs'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const activeTab = ref('used')
const usedComponents = ref(props.modelValue)

// 获取组件图标
const getComponentIcon = (icon) => {
  // 这里可以根据组件类型返回对应的图标
  return icon
}

// 获取组件标签
const getComponentLabel = (item) => {
  // 这里可以根据组件类型返回对应的标签名
  console.log(item)
  return item.label
}

// 移动组件
const moveComponent = (index, direction) => {
  const newComponents = [...usedComponents.value]
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  const temp = newComponents[index]
  newComponents[index] = newComponents[targetIndex]
  newComponents[targetIndex] = temp
  usedComponents.value = newComponents
  emit('update:modelValue', newComponents)
}

// 删除组件
const removeComponent = (index) => {
  const newComponents = [...usedComponents.value]
  newComponents.splice(index, 1)
  usedComponents.value = newComponents
  emit('update:modelValue', newComponents)
}
</script>

<style lang="less" scoped>
.component-manage {
  .component-list {
    .component-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .item-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-icon {
          font-size: 16px;
          color: #409eff;
        }

        span {
          font-size: 14px;
          color: #303133;
        }
      }

      .item-actions {
        .el-button {
          padding: 4px;
        }
      }
    }
  }
}
</style> 