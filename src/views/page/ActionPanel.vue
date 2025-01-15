<template>
  <div class="action-panel">
    <el-button type="primary" class="action-btn" @click="handlePageConfig">
      <el-icon>
        <Setting />
      </el-icon>
      <span>页面设置</span>
    </el-button>
    <el-button type="primary" class="action-btn" @click="handleComponentManage">
      <el-icon>
        <Grid />
      </el-icon>
      <span>组件管理</span>
    </el-button>
    <el-button type="primary" class="action-btn" @click="handlePreview">
      <el-icon>
        <View />
      </el-icon>
      <span>&nbsp;预&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;览&nbsp;</span>
    </el-button>
    <el-button
      type="primary"
      class="action-btn"
      @click="handleSave"
      :loading="saving"
    >
      <el-icon>
        <Check />
      </el-icon>
      <span>&nbsp;保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存&nbsp;</span>
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Setting, Grid, View, Check } from '@element-plus/icons-vue';

const props = defineProps({
  saving: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['page-config', 'component-manage', 'preview', 'save']);

const handlePageConfig = () => {
  emit('page-config');
};

const handleComponentManage = () => {
  emit('component-manage');
};

const handlePreview = () => {
  emit('preview');
};

const handleSave = () => {
  emit('save');
};
</script>

<style scoped>
.action-panel {
  position: absolute;
  right: 340px;
  top: 47px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 90px;

  .action-btn {
    width: 90px;
    justify-content: flex-start;
    padding: 7px 8px;
    background: #fff;
    color: #606266;
    border: none;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    &:first-child {
      margin-right: auto;
    }

    &:not(:first-child) {
      margin-left: auto;
    }

    &:hover {
      color: #409eff;
      background: #ecf5ff;
      border: none;
    }

    :deep(.el-icon) {
      font-size: 14px;
    }

    span {
      font-size: 13px;
      font-weight: 400;
    }
  }
}
</style>