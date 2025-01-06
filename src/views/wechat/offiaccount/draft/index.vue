<template>
  <div class="page-container">
    <!-- 顶部工具栏 -->
    <div class="page-toolbar">
      <div class="left">
        <el-button type="primary" size="small" @click="handleBack">
          <el-icon><Back /></el-icon>
          返回
        </el-button>
      </div>
      <div class="center">
        <el-input
          v-model="pageName"
          size="small"
          placeholder="页面标题"
          class="page-title-input"
        />
      </div>
      <div class="right">
        <el-button type="primary" size="small" @click="handlePreview">
          <el-icon><View /></el-icon>
          预览
        </el-button>
        <el-button type="success" size="small" @click="handleSave">
          <el-icon><Check /></el-icon>
          保存
        </el-button>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-main">
      <!-- 左侧组件面板 -->
      <div class="left-panel">
        <div class="panel-title">组件</div>
        <div class="components-list">
          <div class="component-group">
            <div class="group-title">基础组件</div>
            <div class="group-content">
              <div class="component-item"
                   v-for="item in basicComponents"
                   :key="item.type"
                   draggable="true"
                   @dragstart="handleDragStart($event, item)">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
          <div class="component-group">
            <div class="group-title">表单组件</div>
            <div class="group-content">
              <div class="component-item"
                   v-for="item in formComponents"
                   :key="item.type"
                   draggable="true"
                   @dragstart="handleDragStart($event, item)">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间画布区域 -->
      <div class="center-panel">
        <div class="canvas-container"
             @dragover.prevent
             @drop="handleDrop($event)"
             ref="canvasRef">
          <div v-for="(widget, index) in widgets"
               :key="widget.id"
               class="widget-item"
               :class="{ active: currentWidget?.id === widget.id }"
               :style="getWidgetStyle(widget)"
               @click.stop="selectWidget(widget)">
            <div class="widget-content">
              <component :is="widget.component" v-bind="widget.props" />
            </div>
            <div class="widget-actions">
              <el-icon @click.stop="removeWidget(index)"><Delete /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="right-panel" v-if="currentWidget">
        <div class="panel-title">属性设置</div>
        <div class="panel-content">
          <component 
            :is="currentWidget.configComponent"
            v-model="currentWidget.props"
            @update:modelValue="updateWidgetProps"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Back,
  View,
  Check,
  Delete,
  Document,
  Edit,
  Picture,
  List,
  Location,
  VideoCamera
} from '@element-plus/icons-vue'

// 页面标题
const pageName = ref('')

// 当前选中的组件
const currentWidget = ref(null)

// 基础组件列表
const basicComponents = [
  {
    type: 'text',
    label: '文本',
    icon: Document,
    component: 'TextWidget',
    configComponent: 'TextConfig',
    defaultProps: {
      content: '文本内容'
    }
  },
  {
    type: 'image',
    label: '图片',
    icon: Picture,
    component: 'ImageWidget',
    configComponent: 'ImageConfig',
    defaultProps: {
      src: '',
      alt: ''
    }
  },
  // ... 其他基础组件
]

// 表单组件列表
const formComponents = [
  {
    type: 'input',
    label: '输入框',
    icon: Edit,
    component: 'InputWidget',
    configComponent: 'InputConfig',
    defaultProps: {
      placeholder: '请输入'
    }
  },
  // ... 其他表单组件
]

// 组件列表
const widgets = ref([])

// 处理组件拖拽开始
const handleDragStart = (e, component) => {
  e.dataTransfer.setData('componentType', component.type)
}

// 处理组件放置
const handleDrop = (e) => {
  const type = e.dataTransfer.getData('componentType')
  const component = [...basicComponents, ...formComponents].find(c => c.type === type)
  
  if (component) {
    const rect = e.target.getBoundingClientRect()
    const widget = {
      id: Date.now(),
      ...component,
      props: { ...component.defaultProps },
      style: {
        left: e.clientX - rect.left + 'px',
        top: e.clientY - rect.top + 'px'
      }
    }
    widgets.value.push(widget)
  }
}

// 选择组件
const selectWidget = (widget) => {
  currentWidget.value = widget
}

// 更新组件属性
const updateWidgetProps = (props) => {
  if (currentWidget.value) {
    currentWidget.value.props = props
  }
}

// 移除组件
const removeWidget = (index) => {
  widgets.value.splice(index, 1)
  if (currentWidget.value === widgets.value[index]) {
    currentWidget.value = null
  }
}
</script>

<style lang="less" scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.page-toolbar {
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .center {
    flex: 1;
    display: flex;
    justify-content: center;
    
    .page-title-input {
      width: 200px;
    }
  }
}

.page-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 250px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;

  .panel-title {
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #e4e7ed;
  }

  .components-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    .component-group {
      margin-bottom: 20px;

      .group-title {
        font-size: 13px;
        color: #909399;
        margin-bottom: 12px;
      }

      .group-content {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;

        .component-item {
          height: 60px;
          background: #f5f7fa;
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: move;
          transition: all 0.3s;

          &:hover {
            border-color: #409eff;
            color: #409eff;
          }

          .el-icon {
            font-size: 20px;
            margin-bottom: 4px;
          }

          span {
            font-size: 12px;
          }
        }
      }
    }
  }
}

.center-panel {
  flex: 1;
  background: #f5f7fa;
  padding: 20px;
  overflow: auto;

  .canvas-container {
    min-height: 100%;
    background: #fff;
    border-radius: 4px;
    position: relative;

    .widget-item {
      position: absolute;
      min-width: 100px;
      min-height: 40px;
      background: #fff;
      border: 1px solid transparent;
      
      &.active {
        border-color: #409eff;
      }

      .widget-actions {
        display: none;
        position: absolute;
        right: -30px;
        top: 0;
        
        .el-icon {
          padding: 4px;
          background: #f56c6c;
          color: #fff;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          
          &:hover {
            background: #f78989;
          }
        }
      }

      &:hover .widget-actions {
        display: block;
      }
    }
  }
}

.right-panel {
  width: 300px;
  background: #fff;
  border-left: 1px solid #e4e7ed;

  .panel-title {
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #e4e7ed;
  }

  .panel-content {
    padding: 16px;
  }
}
</style> 