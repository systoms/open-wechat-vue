<template>
  <div class="page-container">
    <!-- 顶部操作栏 -->
    <div class="page-header">
      <el-button 
        type="primary" 
        plain 
        size="small" 
        @click="handleBack"
        icon="el-icon-arrow-left"
      >
        返回功能页
      </el-button>
      
      <el-divider direction="vertical" />
      
      <!-- 其他操作按钮 -->
      <el-button type="primary" size="small">
        新增草稿
      </el-button>
    </div>
    
    <!-- 页面主体内容 -->
    <div class="page-content">
      <!-- 你的页面内容 -->
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useTabStore } from '@/store/tab'

const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()

const handleBack = () => {
  // 获取当前appid
  const appid = route.params.appid
  
  // 关闭当前标签页
  tabStore.removeTab(route.path)
  
  // 返回到功能页
  router.push(`/wechat/offiaccount/${appid}/dashboard`)
}
</script>

<style lang="less" scoped>
.page-container {
  padding: 16px;
  
  .page-header {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .page-content {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
  }
}
</style> 