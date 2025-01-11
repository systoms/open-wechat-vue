<template>
  <div class="page-container">
    <div class="page-content">
      <!-- 使用组件面板组件 -->
      <components-panel
          @dragstart="handleComponentDragStart"
          ref="componentsPanelRef"
      />

      <!-- 中间预览区域 -->
      <section class="preview-panel">
        <section class="preview-wrapper">
          <img src="@/assets/phone.png" class="status-bar" alt="phone status"/>
          <div class="preview-header">
            <div class="header-back">
              <el-icon>
                <ArrowLeft/>
              </el-icon>
            </div>
            <div class="header-title">
              <span>{{ pageTitle || '页面标题' }}</span>
            </div>
          </div>
          <!-- 内层容器用于滚动 -->
          <section class="preview-container"
                   @dragover="handlePreviewDragOver"
                   @drop.prevent="handleDrop"
                   @dragend.prevent="handleDragEnd"
                   ref="canvasRef">
            <section class="canvas-content">
              <template v-for="(item, index) in canvasItems" :key="item.id">
                <!-- 在每个组件前显示放置区域 -->
                <div v-if="showDropArea && dropAreaIndex === index"
                     class="placementarea">
                  <div class="drop-text">组件放置区域</div>
                  <div class="drop-desc">松开鼠标，完成组件插入</div>
                </div>

                <div class="canvas-item"
                     :class="{ active: currentItem?.id === item.id }"
                     :style="getItemStyle(item)"
                     @click="selectItem(item)">
                  <component :is="item.component" v-bind="item.props"/>
                  <div class="component-tag">
                    <span>{{ getComponentLabel(item.type) }}</span>
                    <el-icon class="delete-icon" @click.stop="removeItem(index)">
                      <Delete/>
                    </el-icon>
                    <div class="tag-arrow"></div>
                  </div>
                </div>
              </template>

              <!-- 在末尾显示放置区域 -->
              <div v-if="showDropArea && dropAreaIndex === canvasItems.length"
                   class="placementarea">
                <div class="drop-text">组件放置区域</div>
                <div class="drop-desc">松开鼠标，完成组件插入</div>
              </div>
            </section>
          </section>
        </section>
      </section>

      <!-- 操作按钮 - 浮动样式 -->
      <div class="action-panel">
        <el-button type="primary" class="action-btn" @click="handlePageConfig">
          <el-icon>
            <Setting/>
          </el-icon>
          <span>页面设置</span>
        </el-button>
        <el-button type="primary" class="action-btn" @click="handleComponentManage">
          <el-icon>
            <Grid/>
          </el-icon>
          <span>组件管理</span>
        </el-button>
        <el-button type="primary" class="action-btn" @click="handlePreview">
          <el-icon>
            <View/>
          </el-icon>
          <span>&nbsp;预&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;览&nbsp;</span>
        </el-button>
        <el-button
            type="primary"
            class="action-btn"
            @click="handleSave"
            :loading="saving">
          <el-icon>
            <Check/>
          </el-icon>
          <span>&nbsp;保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存&nbsp;</span>
        </el-button>
      </div>

      <!-- 右侧配置面板 -->
      <div class="config-panel">
        <div class="panel-header">{{ getPanelTitle }}</div>
        <div class="panel-content">
          <component
              v-if="currentConfigComponent"
              :is="currentConfigComponent"
              v-model="currentConfigData"
              @update:modelValue="handleConfigUpdate"
          />
          <el-empty v-else description="请选择组件"/>
        </div>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <preview-dialog
        ref="previewDialogRef"
        :page-title="pageTitle"
    />
  </div>
</template>

<script setup>
import 'vant/lib/index.css';
import {computed, markRaw, onMounted, ref, shallowRef, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElLoading, ElMessage} from 'element-plus'
import {readPage, savePage, updatePage} from '@/api/page'
import {ArrowLeft, Check, Delete, Grid, Setting, View} from '@element-plus/icons-vue'
import PreviewDialog from '@/components/PreviewDialog.vue'
import ComponentsPanel from '@/components/drag/ComponentsPanel.vue'
import PageConfig from '@/components/drag/config/PageConfig.vue'
import ComponentManage from '@/components/drag/config/ComponentManage.vue'

const componentsPanelRef = shallowRef(null)
const basicComponents = shallowRef([])
const businessComponents = shallowRef([])

const route = useRoute()
const router = useRouter()

// 获取路由参数
const pageId = route.query.id
const saving = ref(false)

// 页面配置数据 - 使用 PageConfig 的默认值
const pageConfig = ref({
  title: '页面标题',
  description: '页面描述',
  enabled: true
})

// 画布中的组件列表
const canvasItems = shallowRef([])
// 当前选中的组件
const currentItem = shallowRef(null)
// 画布引用
const canvasRef = shallowRef(null)

// 记录当前悬停的目标索引
let currentHoverIndex = -1

// 添加响应式变量
const showDropArea = ref(false)
const dropAreaIndex = ref(-1)
const isDragging = ref(false)

// 获取页面标题
const pageTitle = computed(() => pageConfig.value.title)

const previewDialogRef = shallowRef(null)

// 面板状态控制
const isPageConfig = ref(true)
const isComponentManage = ref(false)

// 初始化页面数据
const initPageData = async () => {
  if (!pageId || pageId <= 0) {
    // 如果是新建页面，使用默认配置
    pageConfig.value = {
      title: '页面标题',
      description: '页面描述',
      enabled: true
    }
    return
  }

  let loading = null
  try {
    loading = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    const {data} = await readPage(pageId)
    if (data) {
      // 填充页面配置
      pageConfig.value = {
        title: data.title || '页面标题',
        description: data.description || '页面描述',
        enabled: data.enabled ?? true
      }

      // 填充组件数据
      if (data.components && Array.isArray(data.components)) {
        // 查找组件定义并创建组件实例
         // 过滤掉无效组件
        canvasItems.value = data.components.map(item => {
          const componentDef = [...basicComponents.value, ...businessComponents.value]
              .find(c => c.type === item.type)

          if (componentDef) {
            return {
              id: Date.now() + Math.random(), // 生成唯一ID
              type: item.type,
              component: markRaw(componentDef.component),
              props: {...item.props}
            }
          }
          return null
        }).filter(Boolean)
      }
    }
  } catch (error) {
    console.error('加载页面数据失败:', error)
    ElMessage.error(error.message || '加载页面数据失败')
  } finally {
    if (loading) {
      loading.close()
    }
  }
}

// 处理组件拖拽开始
const handleComponentDragStart = (e, component) => {
  isDragging.value = true
}
// 处理预览
const handlePreview = () => {
  // 复制一份画布数据用于预览
  const previewData = canvasItems.value.map(item => ({
    ...item,
    id: item.id,
    component: item.component,
    props: {...item.props}
  }))

  previewDialogRef.value?.open(previewData)
}

// 添加表单数据
const formData = computed(() => ({
  title: pageConfig.value.title,
  description: pageConfig.value.description,
  enabled: pageConfig.value.enabled,
  components: canvasItems.value.map(item => ({
    type: item.type,
    props: item.props,
    sort: item.sort // 如果需要排序
  }))
}))

// 重置拖拽状态
const resetDragState = () => {
  isDragging.value = false
  showDropArea.value = false
  dropAreaIndex.value = -1
}

// 处理预览区域拖动
const handlePreviewDragOver = (e) => {
  e.preventDefault()
  if (!isDragging.value) return

  // 计算插入位置
  const container = e.currentTarget
  const rect = container.getBoundingClientRect()
  const items = container.querySelectorAll('.canvas-item')
  let newIndex = canvasItems.value.length

  // 遍历所有组件，找到合适的插入位置
  for (let i = 0; i < items.length; i++) {
    const itemRect = items[i].getBoundingClientRect()
    const itemMiddle = itemRect.top + itemRect.height / 2
    if (e.clientY < itemMiddle) {
      newIndex = i
      break
    }
  }

  // 更新放置区域位置
  if (dropAreaIndex.value !== newIndex) {
    dropAreaIndex.value = newIndex
    showDropArea.value = true
  }
}

// 处理拖拽放置
const handleDrop = (e) => {
  e.preventDefault()
  const type = e.dataTransfer.getData('componentType')
  const component = [...basicComponents.value, ...businessComponents.value].find(c => c.type === type)

  if (component && dropAreaIndex.value !== -1) {
    const item = {
      id: Date.now(),
      type: component.type,
      component: markRaw(component.component),
      props: component.getDefaultProps ? component.getDefaultProps() : {...component.defaultProps}
    }

    canvasItems.value = [
      ...canvasItems.value.slice(0, dropAreaIndex.value),
      item,
      ...canvasItems.value.slice(dropAreaIndex.value)
    ]
    currentItem.value = item
    isPageConfig.value = false
  }

  resetDragState()
}

// 处理拖拽结束
const handleDragEnd = () => {
  resetDragState()
}

// 获取组件样式 - 修改为 1px 透明边框
const getItemStyle = (item) => {
  return {
    backgroundColor: '#fff',
    width: '100%',
    boxSizing: 'border-box',
  }
}

// 获取面板标题
const getPanelTitle = computed(() => {
  if (isPageConfig.value) return '页面设置'
  if (isComponentManage.value) return '组件管理'
  if (currentItem.value) {
    const component = [...basicComponents.value, ...businessComponents.value].find(c => c.type === currentItem.value.type)
    return component ? `${component.label}组件配置` : '组件配置'
  }
  return '属性配置'
})

// 处理组件管理按钮点击
const handleComponentManage = () => {
  isComponentManage.value = true
  isPageConfig.value = false
  currentItem.value = null
}

// 修改页面配置处理方法
const handlePageConfig = () => {
  isPageConfig.value = true
  isComponentManage.value = false
  currentItem.value = null
}

// 修改选择组件方法
const selectItem = (item) => {
  currentItem.value = canvasItems.value.find(i => i.id === item.id)
  isPageConfig.value = false
  isComponentManage.value = false
}

// 修改移除组件方法
const removeItem = (index) => {
  // 如果要删除的是当前选中的组件，清除选中状态
  if (currentItem.value === canvasItems.value[index]) {
    currentItem.value = null
  }
  // 使用 filter 创建新数组
  canvasItems.value = canvasItems.value.filter((_, i) => i !== index)
}

// 获取组件标签名称
const getComponentLabel = (type) => {
  const component = [...basicComponents.value, ...businessComponents.value].find(c => c.type === type)
  return component ? component.label : type
}

// 获取当前组件的配置信息
const currentComponent = computed(() => {
  if (!currentItem.value) return null
  return [...basicComponents.value, ...businessComponents.value].find(
      c => c.type === currentItem.value.type
  )
})

// 获取当前配置组件
const currentConfigComponent = computed(() => {
  if (isPageConfig.value) {
    return PageConfig
  }
  if (isComponentManage.value) {
    return ComponentManage
  }
  if (currentItem.value && currentComponent.value?.configComponent) {
    return currentComponent.value.configComponent
  }
  return null
})

// 获取当前配置数据
const currentConfigData = computed(() => {
  if (isPageConfig.value) {
    return pageConfig.value
  }
  if (isComponentManage.value) {
    return canvasItems.value
  }
  if (currentItem.value) {
    return currentItem.value.props
  }
  return null
})

// 处理配置更新
const handleConfigUpdate = (val) => {
  if (isPageConfig.value) {
    pageConfig.value = val
  } else if (isComponentManage.value) {
    canvasItems.value = val.map(item => ({
      ...item,
      component: markRaw(item.component)
    }))
  } else if (currentItem.value) {
    // 找到当前项的索引
    const index = canvasItems.value.findIndex(item => item.id === currentItem.value.id)
    if (index !== -1) {
      // 创建新的数组并更新指定项
      const newItems = [...canvasItems.value]
      newItems[index] = {
        ...newItems[index],
        props: val
      }
      canvasItems.value = newItems
      // 更新当前选中项
      currentItem.value = newItems[index]
    }
  }
}

// 处理保存
const handleSave = async () => {
  if (saving.value) return

  let loading = null
  try {
    saving.value = true
    loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 根据是否有 pageId 判断是新增还是更新
    const apiCall = pageId
        ? () => updatePage(pageId, formData.value)
        : () => savePage(formData.value)

    await apiCall()

    ElMessage.success('保存成功')

    // 保存成功后返回列表页
    router.push('/page/index')

  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '保存失败')
  } finally {
    if (loading) {
      loading.close()
    }
    saving.value = false
  }
}

// 在组件挂载后初始化数据
onMounted(() => {
  initPageData()
  if (componentsPanelRef.value) {
    basicComponents.value = componentsPanelRef.value.basicComponents.map(comp => ({
      ...comp,
      component: markRaw(comp.component)
    }))
    businessComponents.value = componentsPanelRef.value.businessComponents.map(comp => ({
      ...comp,
      component: markRaw(comp.component)
    }))
  }
})

// 添加 watch 来监控 currentHoverIndex 的变化
watch(() => currentHoverIndex, (newVal) => {
  console.log('currentHoverIndex changed to:', newVal)
})
</script>

<style lang="less" scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  overflow: visible;
}

.page-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  padding-left: 60px;
  position: relative;
  overflow-y: scroll;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  background: #f7f8fa;

  .preview-wrapper {
    width: 375px;
    min-height: 760px;
    -webkit-box-shadow: 0 0 14px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 0 14px 0 rgba(0, 0, 0, .1);
    margin: 45px 0;
    position: relative;
  }

  .status-bar {
    width: 100%;
    display: block;
    object-fit: contain;
  }

  .preview-header {
    height: 44px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    position: relative;

    .header-back {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      height: 44px;

      .el-icon {
        font-size: 14px;
        color: #303133;
      }
    }

    .header-title {
      flex: 1;
      text-align: center;

      span {
        font-size: 14px;
        color: #303133;
        font-weight: normal;
        line-height: 1.5;
      }
    }
  }

  .preview-container {
    min-height: 603px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    width: 100%;
    position: relative;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .canvas-content {
      min-height: 100%;
      position: relative;
      width: 100%;
      overflow: visible;
    }
  }
}

.config-panel {
  width: 320px;
  height: 100%;
  background: #fff;
  border-left: 1px solid #dcdfe6;
  display: flex;
  flex-direction: column;

  .panel-header {
    height: 48px;
    line-height: 48px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    background-color: #f5f7fa;
    border-bottom: 1px solid #dcdfe6;
  }

  .panel-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    :deep(.el-form) {
      .el-form-item:last-child {
        margin-bottom: 0;
      }
    }
  }
}

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

.component-list {
  .tip-text {
    font-size: 12px;
    color: #909399;
    margin-bottom: 12px;
    padding: 0 4px;
  }

  .component-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: #fff;
    margin-bottom: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    cursor: move;
    position: relative;

    &.dragging {
      opacity: 0.5;
      background: #f5f7fa;
      box-shadow: none;
      border: 1px solid #e4e7ed;
    }

    &.drag-over-top {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: -6px;
        height: 2px;
        background-color: #409eff;
      }
    }

    &.drag-over-bottom {
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -6px;
        height: 2px;
        background-color: #409eff;
      }
    }

    &:hover {
      background: #f5f7fa;
    }

    .item-content {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-icon {
        font-size: 16px;
        color: #909399;
        display: flex;
        align-items: center;
        width: 16px;
        height: 16px;
      }

      .component-name {
        font-size: 14px;
        color: #303133;
        line-height: 1;
      }
    }
  }
}

.placementarea {
  height: 60px;
  border: 1px dashed #409eff;
  background-color: rgba(64, 158, 255, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: all 0.3s;

  .drop-icon {
    color: #409eff;
    margin-bottom: 8px;

    .el-icon {
      font-size: 24px;
      animation: bounce 1s infinite;
    }
  }

  .drop-text {
    font-size: 14px;
    color: #409eff;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .drop-desc {
    font-size: 12px;
    color: #909399;
    opacity: 0.8;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.canvas-item {
  position: relative;
  background: #fff;
  border: 1px solid transparent;
  width: 100%;
  box-sizing: border-box;

  &.active {
    border: 1px solid #409eff !important;
  }

  &:hover {
    border: 1px dashed #409eff;
  }

  .component-tag {
    position: absolute;
    right: -80px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    padding: 4px 0;
    width: 70px;
    font-size: 12px;
    color: #ffffff;
    border: none;
    border-radius: 2px;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);

    &::before {
      content: '';
      position: absolute;
      left: -4px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right: 4px solid #fff;
    }

    .delete-icon {
      display: none;
      cursor: pointer;
      color: #ffffff;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 2px;
      justify-content: center;
      align-items: center;
      font-size: 16px;

      &:hover {
        color: #ffffff;
      }
    }

    &:hover {
      .delete-icon {
        display: inline-flex;
      }

      &::before {
        border-right-color: rgba(0, 0, 0, 0.6);
      }
    }

    span {
      font-size: 12px;
      color: #555;
      width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      white-space: nowrap;
    }
  }
}

.image-config-item {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  .image-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    span {
      font-weight: 500;
      color: #303133;
    }
  }
}
</style> 
