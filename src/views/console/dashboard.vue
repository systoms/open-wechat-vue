<script setup>
import { ref, onMounted } from 'vue'

// 模拟数据
const stats = ref({
  totalUsers: 12345,
  userGrowth: 5.2,
  totalOrders: 8765,
  orderGrowth: -2.1,
  totalRevenue: 1234567,
  revenueGrowth: 12.5,
  activeUsers: 328
})

const chartTimeRange = ref('month')

// 格式化数字
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 获取数据的方法
const fetchDashboardData = async () => {
  try {
    // 这里添加实际的API调用
    // const { data } = await getDashboardStats()
    // stats.value = data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
              <el-tag size="small" type="success">日</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="main-num">{{ stats.totalUsers }}</div>
            <div class="sub-info">
              <span>较昨日</span>
              <span :class="stats.userGrowth >= 0 ? 'up' : 'down'">
                {{ Math.abs(stats.userGrowth) }}%
                <i :class="stats.userGrowth >= 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总订单数</span>
              <el-tag size="small" type="warning">月</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="main-num">{{ stats.totalOrders }}</div>
            <div class="sub-info">
              <span>较上月</span>
              <span :class="stats.orderGrowth >= 0 ? 'up' : 'down'">
                {{ Math.abs(stats.orderGrowth) }}%
                <i :class="stats.orderGrowth >= 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总收入</span>
              <el-tag size="small" type="danger">年</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="main-num">¥{{ formatNumber(stats.totalRevenue) }}</div>
            <div class="sub-info">
              <span>较去年</span>
              <span :class="stats.revenueGrowth >= 0 ? 'up' : 'down'">
                {{ Math.abs(stats.revenueGrowth) }}%
                <i :class="stats.revenueGrowth >= 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>活跃度</span>
              <el-tag size="small" type="info">实时</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="main-num">{{ stats.activeUsers }}</div>
            <div class="sub-info">
              <span>在线用户</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <el-radio-group v-model="chartTimeRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里需要引入图表组件 -->
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户分布</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里需要引入图表组件 -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less" scoped>
.dashboard-container {
  padding: 20px;

  .el-row {
    margin-bottom: 20px;
  }

  .stat-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #606266;
    }

    .card-content {
      text-align: center;
      padding: 10px 0;

      .main-num {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 10px;
      }

      .sub-info {
        font-size: 12px;
        color: #909399;

        .up {
          color: #67c23a;
        }

        .down {
          color: #f56c6c;
        }
      }
    }
  }

  .chart-row {
    margin-top: 20px;

    .chart-container {
      height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .el-card {
    margin-bottom: 20px;
  }
}
</style>