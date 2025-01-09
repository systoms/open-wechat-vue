<template>
  <el-dialog
    v-model="visible"
    title="页面预览"
    width="375px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div class="preview-container">
      <div class="preview-header">
        <div class="header-back">
          <el-icon><ArrowLeft /></el-icon>
        </div>
        <div class="header-title">
          <span>{{ pageTitle || '页面标题' }}</span>
        </div>
      </div>
      <div class="preview-content">
        <template v-for="(item, index) in previewItems" :key="item.id">
          <component :is="item.component" v-bind="item.props" />
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'

const props = defineProps({
  pageTitle: {
    type: String,
    default: ''
  }
})

const visible = ref(false)
const previewItems = ref([])

// 打开预览
const open = (items) => {
  previewItems.value = items
  visible.value = true
}

// 关闭预览
const close = () => {
  visible.value = false
  previewItems.value = []
}

defineExpose({
  open,
  close
})
</script>

<style lang="less" scoped>
.preview-container {
  background: #f7f8fa;
  min-height: 667px;
  position: relative;
  
  .preview-header {
    height: 44px;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 100;
    
    .header-back {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .header-title {
      flex: 1;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      margin: 0 24px;
    }
  }
}

:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8vh !important;
  
  .el-dialog__header {
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #dcdfe6;
  }
  
  .el-dialog__body {
    padding: 0;
  }
}
</style> 