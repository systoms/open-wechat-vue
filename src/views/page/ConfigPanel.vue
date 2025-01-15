<template>
  <div class="config-panel">
    <div class="panel-header">{{ getPanelTitle }}</div>
    <div class="panel-content">
      <component
        v-if="currentConfigComponent"
        :is="currentConfigComponent"
        v-model="currentConfigData"
        @update:modelValue="handleConfigUpdate"
      />
      <el-empty v-else description="请选择组件" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  currentConfigComponent: {
    type: String,
    required: false
  },
  currentConfigData: {
    type: Object,
    required: false
  }
});

const emit = defineEmits(['update:modelValue']);

const getPanelTitle = computed(() => {
  return currentConfigComponent ? '组件配置' : '页面配置';
});

const handleConfigUpdate = (value) => {
  emit('update:modelValue', value);
};
</script>

<style scoped>
.config-panel {
  width: 300px;
  background-color: #fff;
  border-left: 1px solid #ccc;
  padding: 10px;
}

.panel-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.panel-content {
  min-height: 200px;
}
</style>