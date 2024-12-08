<template>
  <div class="wx-page-editor" @click.self="handleEditorClick">
    <!-- 修改按钮组 -->
    <div class="action-buttons">
      <div class="action-btn save-btn" @click="handleSave">
        <i>💾</i> 保存
      </div>
      <div class="action-btn preview-btn" @click="showPreview = true">
        <i>👁️</i> 预览
      </div>
      <div class="action-btn settings-btn" @click="showPageSettings = true">
        <i>⚙️</i> 配置
      </div>
    </div>

    <!-- 页面配置弹窗 -->
    <div class="page-settings-modal" v-if="showPageSettings">
      <div class="modal-content">
        <div class="modal-header">
          <h3>页面配置</h3>
          <span class="close-btn" @click="showPageSettings = false">×</span>
        </div>
        <div class="modal-body">
          <div class="settings-item">
            <label>页面标题</label>
            <input type="text" v-model="pageConfig.title">
          </div>
          <div class="settings-item">
            <label>背景颜色</label>
            <input type="color" v-model="pageConfig.backgroundColor">
          </div>
          <div class="settings-item">
            <label>显示底部导航栏</label>
            <input type="checkbox" v-model="pageConfig.showTabbar">
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showPageSettings = false">取消</button>
          <button class="primary" @click="savePageSettings">确定</button>
        </div>
      </div>
    </div>

    <!-- 左侧组件列表 -->
    <div class="component-list">
      <div class="component-category" v-for="(category, index) in components" :key="index">
        <div class="category-title">{{ category.name }}</div>
        <div class="component-items">
          <div class="component-item"
               v-for="item in category.items"
               :key="item.type"
               @click="addComponent(item.type)"
               draggable="true"
               @dragstart="dragStart($event, item.type)">
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间画布区域 -->
    <div class="editor-canvas"
         @dragover.prevent
         @drop="handleDrop"
         @click.self="handleCanvasClick">
      <div class="phone-wrapper">
        <img class="phone-frame" src="@/assets/iphone-frame.png" alt="iPhone frame" />
        <div class="phone-content"
             @click.self="handleContentClick"
             :style="{ backgroundColor: pageConfig.backgroundColor }"
             :class="{ 'drag-over': isDraggingOver }"
             @dragover.prevent="handleCanvasDragover"
             @dragleave="handleCanvasDragleave"
             @drop="handleDrop">
          <TransitionGroup name="component" tag="div">
            <template v-for="(comp, index) in pageData" :key="index">
              <div class="component-wrapper"
                   :class="{ 
                     active: currentIndex === index,
                     dragging: draggingIndex === index 
                   }"
                   draggable="true"
                   @dragstart="handleDragStart($event, index)"
                   @dragend="handleDragEnd"
                   @dragover.prevent="handleDragOver($event, index)"
                   @dragleave="handleDragLeave"
                   @drop.stop="handleDrop($event, index)"
                   @click.stop="selectComponent(index)">
                <component :is="getPreviewComponent(comp.type)"
                          :config="comp.config"
                          class="preview-component">
                </component>
                
                <div class="component-actions" v-show="currentIndex === index">
                  <i class="icon-up" @click.stop="moveComponent(index, -1)" title="上移">↑</i>
                  <i class="icon-down" @click.stop="moveComponent(index, 1)" title="下移">↓</i>
                  <i class="icon-delete" @click.stop="deleteComponent(index)" title="删除">×</i>
                </div>
                
                <div class="drag-indicator" 
                     v-if="dragoverIndex === index && (draggingNewComponent || draggingIndex !== null)">
                </div>
              </div>
            </template>
          </TransitionGroup>
        </div>
        <!-- 添加固定的底部 tabbar -->
        <div class="phone-tabbar" 
             v-if="tabbarConfig.show"
             :class="{ active: currentIndex === 'tabbar' }"
             @click.stop="selectComponent('tabbar')">
          <div class="tabbar-items">
            <div v-for="(item, index) in tabbarConfig.items" 
                 :key="index" 
                 class="tabbar-item">
              <i class="tabbar-icon">{{ item.icon }}</i>
              <span class="tabbar-text">{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧属性配置面板 -->
    <div class="props-panel">
      <template v-if="currentComponent">
        <div class="panel-header">
          {{ currentComponent.type }} 配置
        </div>
        <div class="panel-content">
          <component :is="currentComponent.type + 'Config'"
                    :value="currentComponent.config"
                    @update="updateComponentConfig">
          </component>
        </div>
      </template>
      <template v-else-if="currentIndex === 'tabbar'">
        <div class="panel-header">
          底部导航配置
        </div>
        <div class="panel-content">
          <TabbarConfig
            :value="tabbarConfig"
            @update="updateTabbarConfig">
          </TabbarConfig>
        </div>
      </template>
      <template v-else>
        <div class="panel-empty-state">
          <i class="empty-icon">📝</i>
          <p>请选择或添加组件进行配置</p>
        </div>
      </template>
    </div>

    <!-- 简化预览模态框 -->
    <div class="preview-modal" v-if="showPreview" @click.self="showPreview = false">
      <div class="phone-wrapper">
        <img class="phone-frame" src="@/assets/iphone-frame.png" alt="iPhone frame" />
        <div class="phone-content"
             :style="{ backgroundColor: pageConfig.backgroundColor }">
          <component v-for="(comp, index) in pageData"
                    :key="index"
                    :is="getPreviewComponent(comp.type)"
                    :config="comp.config"
                    class="preview-component">
          </component>
        </div>
        <div class="phone-tabbar" v-if="tabbarConfig.show">
          <div class="tabbar-items">
            <div v-for="(item, index) in tabbarConfig.items" 
                 :key="index" 
                 class="tabbar-item">
              <i class="tabbar-icon">{{ item.icon }}</i>
              <span class="tabbar-text">{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 添加新的关闭按钮 -->
      <div class="preview-close-button" @click="showPreview = false">
        <i>✕</i>
        <span>关闭预览</span>
      </div>
    </div>
  </div>
</template>

<script>
import TextPreview from '@/components/previews/TextPreview.vue'
import ImagePreview from '@/components/previews/ImagePreview.vue'
import ButtonPreview from '@/components/previews/ButtonPreview.vue'
import SwiperPreview from '@/components/previews/SwiperPreview.vue'
import GridPreview from '@/components/previews/GridPreview.vue'
import ListPreview from '@/components/previews/ListPreview.vue'
import TextConfig from '@/components/configs/TextConfig.vue'
import ImageConfig from '@/components/configs/ImageConfig.vue'
import ButtonConfig from '@/components/configs/ButtonConfig.vue'
import SwiperConfig from '@/components/configs/SwiperConfig.vue'
import GridConfig from '@/components/configs/GridConfig.vue'
import ListConfig from '@/components/configs/ListConfig.vue'
import TabbarConfig from '@/components/configs/TabbarConfig.vue'

export default {
  name: 'WxPageEditor',
  components: {
    TextPreview,
    ImagePreview,
    ButtonPreview,
    SwiperPreview,
    GridPreview,
    ListPreview,
    TextConfig,
    ImageConfig,
    ButtonConfig,
    SwiperConfig,
    GridConfig,
    ListConfig,
    TabbarConfig
  },
  data() {
    return {
      components: [
        {
          name: '基础组件',
          items: [
            { type: 'text', label: '文本', icon: 'icon-text' },
            { type: 'image', label: '图片', icon: 'icon-image' },
            { type: 'button', label: '按钮', icon: 'icon-button' }
          ]
        },
        {
          name: '容器组件',
          items: [
            { type: 'swiper', label: '轮播图', icon: 'icon-swiper' },
            { type: 'grid', label: '宫格', icon: 'icon-grid' },
            { type: 'list', label: '列表', icon: 'icon-list' }
          ]
        }
      ],
      pageData: [], // 页面组件数据
      currentIndex: null,
      showPageSettings: false,
      pageConfig: {
        title: '新建页面',
        backgroundColor: '#ffffff',
        showTabbar: true
      },
      // 修改组件默认配置
      defaultConfigs: {
        text: {
          content: '点击编辑文本',
          fontSize: 14,
          color: '#333333',
          align: 'left',
          padding: 10,
          bold: false
        },
        image: {
          src: 'https://placeholder.com/300x200',
          mode: 'aspectFill',
          width: '100%',
          height: '200px',
          align: 'center',
          padding: 10
        },
        button: {
          text: '按钮',
          type: 'default',
          fontSize: 14,
          width: 'auto',
          align: 'center',
          padding: 10
        },
        swiper: {
          items: [],
          height: 200,
          padding: 10,
          showDots: true
        },
        grid: {
          items: [],
          columns: 4,
          gap: 10,
          padding: 10
        },
        list: {
          items: [],
          showArrow: true,
          padding: 10
        }
      },
      draggingIndex: null, // 当前拖拽的组件索引
      dragoverIndex: null, // 拖拽悬停的位置索引
      isDraggingOver: false, // 添加拖拽悬停状态
      draggingNewComponent: false, // 新增：标记是否在拖入新组件
      tabbarConfig: {
        show: true,
        items: [
          { icon: '🏠', text: '首页', url: '/pages/home/index' },
          { icon: '📝', text: '分类', url: '/pages/category/index' },
          { icon: '🛒', text: '购物车', url: '/pages/cart/index' },
          { icon: '👤', text: '我的', url: '/pages/user/index' }
        ]
      },
      showPreview: false
    }
  },
  computed: {
    currentComponent() {
      return this.currentIndex !== null && typeof this.currentIndex === 'number' 
        ? this.pageData[this.currentIndex] 
        : null
    }
  },
  methods: {
    addComponent(type) {
      const component = this.createComponent(type)
      this.pageData.push(component)
      this.currentIndex = this.pageData.length - 1
    },

    createComponent(type) {
      return {
        type,
        config: { ...this.defaultConfigs[type] }
      }
    },

    selectComponent(index) {
      // 阻止事件冒泡
      event?.stopPropagation();
      console.log('选中组件:', index);
      this.currentIndex = index;
    },

    updateComponentConfig(config) {
      if (this.currentIndex !== null) {
        this.pageData[this.currentIndex].config = {
          ...this.pageData[this.currentIndex].config,
          ...config
        }
      }
    },

    moveComponent(index, direction) {
      const newIndex = index + direction
      // 检查是否超出边界
      if (newIndex < 0 || newIndex >= this.pageData.length) return
      
      // 创建组交换位置
      const newPageData = [...this.pageData]
      const temp = newPageData[index]
      newPageData[index] = newPageData[newIndex]
      newPageData[newIndex] = temp
      
      // 更新整个数组
      this.pageData = newPageData
      
      // 更新当前选中的组件索引
      this.currentIndex = newIndex
    },

    deleteComponent(index) {
      this.pageData.splice(index, 1)
      this.currentIndex = null
    },

    dragStart(event, type) {
      event.stopPropagation()
      event.dataTransfer.setData('componentType', type)
      this.draggingNewComponent = true
      this.draggingIndex = null
    },

    handleDrop(event, index) {
      event.preventDefault()
      event.stopPropagation()
      
      // 获取拖拽的组件类型
      const componentType = event.dataTransfer.getData('componentType')
      
      // 如果是从组表拖入新组件
      if (componentType && this.draggingNewComponent) {
        const component = this.createComponent(componentType)
        this.pageData.splice(typeof index === 'number' ? index : this.pageData.length, 0, component)
        this.currentIndex = typeof index === 'number' ? index : this.pageData.length - 1
      }
      
      // 重置所有状态
      this.dragoverIndex = null
      this.draggingNewComponent = false
      this.draggingIndex = null
      this.isDraggingOver = false
    },

    savePageSettings() {
      // 应用页面配置
      this.applyPageSettings()
      this.showPageSettings = false
    },

    applyPageSettings() {
      // 应用页面样式
      const phoneContent = document.querySelector('.phone-content')
      if (phoneContent) {
        phoneContent.style.backgroundColor = this.pageConfig.backgroundColor
      }
    },

    // 导出页面配置和组件数据
    exportPage() {
      return {
        config: this.pageConfig,
        components: this.pageData
      }
    },

    // 获取预览组件名称
    getPreviewComponent(type) {
      const componentMap = {
        text: 'TextPreview',
        image: 'ImagePreview',
        button: 'ButtonPreview',
        swiper: 'SwiperPreview',
        grid: 'GridPreview',
        list: 'ListPreview'
      }
      return componentMap[type]
    },

    handleDragStart(event, index) {
      event.stopPropagation()
      this.draggingIndex = index
      event.dataTransfer.effectAllowed = 'move'
    },
    
    handleDragEnd(event) {
      event.preventDefault()
      event.stopPropagation()
      this.draggingIndex = null
      this.dragoverIndex = null
    },

    // 添加拖动过程中的处理
    handleDragOver(event, index) {
      event.preventDefault()
      // 允许新组件和已有组件的拖动都显示位置指示器
      if (this.draggingNewComponent || this.draggingIndex !== null) {
        this.dragoverIndex = index
      }
    },

    handleDragLeave(event) {
      event.preventDefault()
      // 只在真正离开容器时重置
      if (!event.relatedTarget?.closest('.component-wrapper')) {
        this.dragoverIndex = null
      }
    },

    // 简化导出配置方法
    exportConfig() {
      const config = {
        pageConfig: this.pageConfig,
        components: this.pageData,
        tabbarConfig: this.tabbarConfig
      }
      
      console.log('页面配置：', config)
      return config // 返回配置对象，方便外部调用时获取
    },
    
    // 触发组件选择
    triggerImport() {
      this.$refs.fileInput.click()
    },
    
    // 处理导入
    handleImport(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result)
          this.importConfig(config)
        } catch (error) {
          alert('配置文件格式错误')
        }
      }
      reader.readAsText(file)
      
      // 清理文件输入，允许重复导入相同文件
      event.target.value = ''
    },
    
    // 导入配置
    importConfig(config) {
      if (!config.pageConfig || !config.components) {
        alert('配置文件格式错误')
        return
      }
      
      // 更新页面配置
      this.pageConfig = {
        ...this.pageConfig, // 保留默认值
        ...config.pageConfig
      }
      
      // 更新组件数据
      this.pageData = config.components.map(comp => ({
        type: comp.type,
        config: {
          ...this.defaultConfigs[comp.type], // 保留默认值
          ...comp.config
        }
      }))
      
      // 更新 tabbar 配置
      if (config.tabbarConfig) {
        this.tabbarConfig = config.tabbarConfig
      }
      
      // 重置选中状态
      this.currentIndex = null
    },
    
    handleCanvasDragover(event) {
      event.preventDefault()
    },
    
    handleCanvasDragleave(event) {
      event.preventDefault()
      this.dragoverIndex = null
      this.isDraggingOver = false
    },

    updateTabbarConfig(config) {
      console.log('更新 tabbar 配置:', config)
      this.tabbarConfig = config
    },

    handleSave() {
      const config = this.exportConfig()
      // 这里可以根据需要处��保存逻辑
      console.log('保存配置：', config)
      // 可以触发组件的保存事件
      this.$emit('save', config)
    },

    // 添加点击处理方法
    handleEditorClick() {
      this.currentIndex = null;
    },
    
    handleCanvasClick() {
      this.currentIndex = null;
    },
    
    handleContentClick() {
      this.currentIndex = null;
    }
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        console.log('currentIndex changed:', newVal, typeof newVal)
      },
      immediate: true
    },
    'pageConfig.showTabbar'(val) {
      this.tabbarConfig.show = val
    },
    'tabbarConfig.show'(val) {
      this.pageConfig.showTabbar = val
    }
  }
}
</script>

<style scoped>
.wx-page-editor {
  position: relative;
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

.component-list {
  width: 250px;
  background: #fff;
  border-right: 1px solid #eee;
  overflow-y: auto;
}

.component-category {
  padding: 10px;
}

.category-title {
  font-size: 14px;
  color: #666;
  padding: 5px 0;
}

.component-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
}

.editor-canvas {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.phone-wrapper {
  width: 375px;
  height: 812px;
  position: relative;
  margin: 20px;
  margin-top: 0;
}

.phone-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  object-fit: contain;
}

.phone-content {
  position: absolute;
  top: 38px;
  left: 18px;
  width: calc(100% - 36px);
  height: calc(100% - 76px);
  background: #fff;
  overflow-y: auto;
  padding-top: 43px;
  padding-bottom: 50px;
  border-top-left-radius: 43px;
  border-top-right-radius: 43px;
  border-bottom-left-radius: 43px;
  border-bottom-right-radius: 43px;
}

.component-wrapper {
  position: relative;
  margin: 4px 0;
  border: 1px dashed #dcdfe6;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
  padding: 2px;
}

.component-wrapper.active {
  border: 1px dashed #409EFF;
  background: rgba(64, 158, 255, 0.04);
}

/* 组件操作按钮样式 */
.component-actions {
  position: absolute;
  top: -1px;
  right: -1px;
  display: flex;
  z-index: 10;
}

.component-actions i {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  font-style: normal;
  font-size: 12px;
  margin-left: -1px;
  transition: all 0.2s;
}

.component-actions i:first-child {
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  margin-left: 0;
}

.component-actions i:last-child {
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.component-actions i:hover {
  background: #f5f7fa;
  z-index: 1; /* 确保悬浮时边框显示在上层 */
  position: relative;
  border-color: #c0c4cc;
}

.icon-up, .icon-down {
  color: #666;
}

.icon-up:hover, .icon-down:hover {
  color: #409EFF;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.icon-delete {
  color: #f56c6c;
}

.icon-delete:hover {
  background: #fef0f0;
  color: #f56c6c;
  border-color: #fbc4c4;
}

/* 拖动时的组件样式 */
.component-wrapper.dragging {
  opacity: 0.5;
  background: #f0f7ff;
  border: 1px dashed #409EFF;
}

/* 拖动指示线 */
.drag-indicator {
  position: absolute;
  left: -10px;
  right: -10px;
  height: 3px;
  background-color: #409EFF;
  pointer-events: none;
  z-index: 100;
}

.drag-indicator::before {
  content: '';
  position: absolute;
  left: -4px;
  top: -3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 组件移动动画 */
.component-move {
  transition: transform 0.3s ease-out;
}

/* 移除其他可能影响效果的样式 */
.component-wrapper:not(.dragging) {
  transition: all 0.2s ease-out;
}

/* 移除之前的样式 */
.phone-content.drag-over::after {
  display: none;
}

.props-panel {
  width: 300px;
  background: #fff;
  border-left: 1px solid #eee;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.page-settings-btn {
  display: none;
}

.save-btn {
  top: 20px;
  background: #4cd964; /* 使用绿色表示保存 */
}

.preview-btn {
  position: absolute;
  top: 20px;
  right: 340px;
  padding: 8px 16px;
  background: #67c23a;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1000;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.preview-btn i {
  font-style: normal;
}

/* 修改预览模态框样式 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

/* 预览关闭按钮 */
.preview-close-button {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.preview-close-button:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preview-close-button i {
  font-style: normal;
  font-size: 16px;
}

.preview-close-button span {
  font-weight: 500;
}

/* 移除不需要的样式 */
.preview-wrapper,
.preview-header,
.preview-content {
  display: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 美化滚动条 */
.preview-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.preview-content::-webkit-scrollbar-track {
  background: #f5f5f5;
}

/* 当视口高度小于 800px 时的样式 */
@media screen and (max-height: 800px) {
  .preview-wrapper {
    height: 100%;  /* 占满可用高度 */
  }
  
  .preview-content {
    min-height: 0;  /* 移除最小高度限制 */
  }
}

/* 修改操作按钮组样式 */
.action-buttons {
  position: fixed; /* 改为 fixed 位 */
  top: 50%;
  right: 340px;
  transform: translateY(-50%); /* 垂直居中 */
  display: flex;
  flex-direction: column; /* 改为竖向排列 */
  gap: 16px; /* 增加按钮之间的间距 */
  z-index: 1000;
}

.action-btn {
  width: 100px; /* 固定宽度 */
  padding: 12px 16px;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  opacity: 0.9;
  transform: translateX(-5px); /* 改为横向移动效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateX(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 保存按钮样式 */
.save-btn {
  background: #409EFF;
}

/* 预览按钮样式 */
.preview-btn {
  background: #67c23a;
}

/* 移除之前的单独预览按钮样式 */
.preview-btn {
  position: static;
}

/* 修改按钮样式 */
.action-btn.save-btn {
  background: #409EFF;
}

.action-btn.preview-btn {
  background: #67c23a;
}

.action-btn.settings-btn {
  background: #909399; /* 设置按钮使用灰色调 */
}

/* 通用 tabbar 样式（编辑和预览共用） */
.phone-tabbar {
  position: absolute;
  bottom: 38px;
  left: 17px;
  width: calc(100% - 34px);
  height: 50px;
  background: #fff;
  border-top: 1px solid #eee;
  z-index: 9;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-sizing: border-box;
}

/* 修改选中效果，使用 1px 边框 */
.editor-canvas .phone-tabbar.active {
  border-top: 1px dashed #409EFF;
  background: rgba(64, 158, 255, 0.04);
  /* 调整边距和宽度以适应 1px 边框 */
  margin: 0;
  width: calc(100% - 34px);
}

.tabbar-items {
  display: flex;
  height: 100%;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box; /* 添加盒模型设置 */
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  padding: 0;
  box-sizing: border-box; /* 添加盒模型设置 */
  min-width: 0; /* 防止内容溢出 */
}

.tabbar-icon {
  font-size: 20px;
  margin-bottom: 2px;
  font-style: normal;
  line-height: 1;
  flex-shrink: 0; /* 防止图标缩小 */
}

.tabbar-text {
  font-size: 12px;
  line-height: 1.2;
  flex-shrink: 0; /* 防止文字缩小 */
  white-space: nowrap; /* 防止文字换行 */
}

/* 编辑模式下的特殊样式 */
.editor-canvas .phone-tabbar {
  cursor: pointer;
}

.editor-canvas .phone-tabbar.active {
  border-top: 1px solid #409EFF;
}

/* 预览模式下的特殊样式 */
.preview-modal .phone-content {
  padding-bottom: 70px;
}

.preview-modal .phone-tabbar {
  pointer-events: none; /* 预览模式下禁用交互 */
}

/* 新的关闭按钮样式 */
.preview-close-button {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.preview-close-button:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preview-close-button i {
  font-style: normal;
  font-size: 16px;
}

.preview-close-button span {
  font-weight: 500;
}

/* 预览模式下的手机尺寸 - 默认尺寸 */
.preview-modal .phone-wrapper {
  transform: scale(0.9);
  transform-origin: center center;
}

/* 根据不同的视口高度调整缩放比例 */
@media screen and (max-height: 900px) {
  .preview-modal .phone-wrapper {
    transform: scale(0.8);
  }
}

@media screen and (max-height: 800px) {
  .preview-modal .phone-wrapper {
    transform: scale(0.7);
  }
}

@media screen and (max-height: 700px) {
  .preview-modal .phone-wrapper {
    transform: scale(0.6);
  }
}

/* 低于 600px 时不再缩放 */
@media screen and (max-height: 600px) {
  .preview-modal .phone-wrapper {
    transform: none;
  }
  
  .preview-modal {
    overflow-y: auto;
    padding: 20px 0;
  }
}

/* 预览模态框样式 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

/* 添加空状态样式 */
.panel-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  padding: 20px;
}

.panel-empty-state .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  font-style: normal;
}

.panel-empty-state p {
  font-size: 14px;
  margin: 0;
  text-align: center;
}

</style> 