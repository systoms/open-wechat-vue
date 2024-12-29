<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in features" :key="index">
        <el-card class="feature-card" shadow="hover" @click="handleClick(item)">
          <div class="feature-icon">
            <i :class="item.icon"></i>
          </div>
          <div class="feature-title">{{ item.title }}</div>
          <div class="feature-desc">{{ item.desc }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const appid = route.params.appid

const features = ref([
  {
    title: '菜单管理',
    desc: '自定义公众号菜单',
    icon: 'fa fa-bars',
    path: `/wechat/offiaccount/${appid}/menu`
  },
  {
    title: '草稿箱管理',
    desc: '管理图文素材草稿',
    icon: 'fa fa-file-text-o',
    path: `/wechat/offiaccount/${appid}/draft`
  },
  // 可以继续添加其他功能卡片
])

const handleClick = (item) => {
  router.push(item.path)
}
</script>

<style lang="less" scoped>
.dashboard-container {
  padding: 20px;
  
  .feature-card {
    cursor: pointer;
    text-align: center;
    height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 20px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .feature-icon {
      font-size: 40px;
      color: #409EFF;
      margin-bottom: 15px;
    }
    
    .feature-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .feature-desc {
      font-size: 13px;
      color: #909399;
    }
  }
}
</style> 