<template>
  <el-form label-position="top">
    <el-form-item label="页面标题">
      <el-input v-model="pageConfig.title" placeholder="请输入页面标题" />
    </el-form-item>
    <el-form-item label="页面描述">
      <el-input 
        v-model="pageConfig.description" 
        type="textarea" 
        :rows="3"
        placeholder="请输入页面描述" 
      />
    </el-form-item>
    <el-form-item label="页面状态">
      <el-switch
        v-model="pageConfig.enabled"
        active-text="启用"
        inactive-text="禁用"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      title: '页面标题',
      description: '页面描述',
      enabled: true
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const pageConfig = ref({ ...props.modelValue })

watch(pageConfig.value, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })
</script> 