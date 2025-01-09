<template>
  <div class="components-panel">
    <div class="panel-header">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="基础组件" name="basic">
          <div class="components-grid">
            <div class="component-item" 
                 v-for="item in basicComponents" 
                 :key="item.type"
                 draggable="true"
                 @dragstart="handleDragStart($event, item)">
              <div class="item-icon">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="item-label">{{ item.label }}</div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="业务组件" name="business">
          <div class="components-grid">
            <div class="component-item"
                 v-for="item in businessComponents"
                 :key="item.type"
                 draggable="true"
                 @dragstart="handleDragStart($event, item)">
              <div class="item-icon">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="item-label">{{ item.label }}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import {
  ArrowLeft,
  Document,
  Picture,
  List,
  Edit,
  Grid,
  View,
  Check,
  Setting,
  Delete
} from '@element-plus/icons-vue'
import {  TreeSelect as VanTreeSelect,
  // 业务组件
  AddressEdit as VanAddressEdit, AddressList as VanAddressList, Area as VanArea, Card as VanCard, ContactCard as VanContactCard, ContactEdit as VanContactEdit, ContactList as VanContactList, Coupon as VanCoupon, CouponCell as VanCouponCell, CouponList as VanCouponList, SubmitBar as VanSubmitBar
} from 'vant'

import VantSwipe from './components/swipe/Component.vue';
import VantSwipeConfig from './components/swipe/Config.vue';

const emit = defineEmits(['dragstart'])
const activeCollapse = ref(['basic'])

// 处理拖拽开始
const handleDragStart = (e, component) => {
  e.dataTransfer.setData('componentType', component.type)
  e.dataTransfer.effectAllowed = 'move'
  emit('dragstart', e, component)
}


// 基础组件
const basicComponents = [
  {
    type: 'vant-swipe',
    label: '轮播图',
    icon: Picture,
    component: VantSwipe,
    configComponent: VantSwipeConfig,
    defaultProps: {
      images: [
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', alt: '图片1' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg', alt: '图片2' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg', alt: '图片3' },
      ]
    }
  },    
  {
    type: 'vant-tree-select',
    label: '分类选择',
    icon: Document,
    component: VanTreeSelect,
    defaultProps: {
      items: [{ text: '分类1' }]
    }
  },

  // 业务组件
  {
    type: 'vant-address-edit',
    label: '地址编辑',
    icon: Document,
    component: VanAddressEdit,
    defaultProps: {}
  },
  {
    type: 'vant-address-list',
    label: '地址列表',
    icon: Document,
    component: VanAddressList,
    defaultProps: {
      list: []
    }
  },
  {
    type: 'vant-area',
    label: '省市区选择',
    icon: Document,
    component: VanArea,
    defaultProps: {}
  },
  {
    type: 'vant-card',
    label: '商品卡片',
    icon: Document,
    component: VanCard,
    defaultProps: {
      price: '2.00',
      title: '商品标题'
    }
  },
  {
    type: 'vant-contact-card',
    label: '联系人卡片',
    icon: Document,
    component: VanContactCard,
    defaultProps: {
      type: 'add'
    }
  },
  {
    type: 'vant-coupon-cell',
    label: '优惠券单元格',
    icon: Document,
    component: VanCouponCell,
    defaultProps: {}
  },
  {
    type: 'vant-coupon-list',
    label: '优惠券列表',
    icon: Document,
    component: VanCouponList,
    defaultProps: {
      coupons: []
    }
  },
  {
    type: 'vant-submit-bar',
    label: '提交订单栏',
    icon: Document,
    component: VanSubmitBar,
    defaultProps: {
      price: 3050
    }
  }
]

// 业务组件
const businessComponents = [
  {
    type: 'form',
    label: '表单',
    icon: Edit,
    component: 'form',
    defaultProps: { 
      innerHTML: '<div style="padding: 10px;">表单内容</div>'
    }
  }
]

// 暴露组件数据和方法
defineExpose({
  basicComponents,
  businessComponents
})
</script>

<style lang="less" scoped>
.components-panel {
  width: 280px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #dcdfe6;
  overflow-y: auto;
  
  .panel-header {
    padding: 0;
  }

  :deep(.el-collapse) {
    border: none;

    .el-collapse-item__header {
      padding: 0 16px;
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      background-color: #f5f7fa;
      border-bottom: 1px solid #dcdfe6;
    }

    .el-collapse-item__content {
      padding: 0;
    }
  }
  
  .components-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 16px;
    background-color: #fff;
  }
  
  .component-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80px;
    cursor: move;
    transition: all 0.3s;
    border-radius: 4px;
    padding: 8px;
    
    &:hover {
      background-color: #f5f7fa;
    }
    
    .item-icon {
      font-size: 24px;
      color: #606266;
      margin-bottom: 8px;
      
      .el-icon {
        width: 24px;
        height: 24px;
      }
    }
    
    .item-label {
      font-size: 12px;
      color: #606266;
      text-align: center;
      line-height: 1.2;
    }
  }
}
</style> 