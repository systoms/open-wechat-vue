<template>
  <div class="page-container">
    <div class="page-content">
      <!-- 使用组件面板组件 -->
      <components-panel
          @dragstart="handleComponentDragStart"
          ref="componentsPanelRef"
      />

      <!-- 中间预览区域 -->
      <ComponentCanvas v-model:isDragging="isDragging" :pageConfig="pageConfig" :components="components"
                       v-model:canvasItems="canvasItems" v-model:currentItem="currentItem"
                       @handleComponentSelect="handleComponentSelect"></ComponentCanvas>

      <!-- 操作按钮 - 浮动样式 -->
      <ActionPanel @page-config="handlePageConfig" @component-manage="handleComponentManage" @preview="handlePreview"
                   @save="handleSave" :saving="saving"></ActionPanel>

      <!-- 右侧配置面板 -->
      <div class="config-panel">
        <div class="panel-header">{{ getPanelTitle }}</div>
        <div class="panel-content">
          <PageConfig v-if="isPageConfig" v-model="pageConfig"></PageConfig>
          <ComponentManage v-else-if="isComponentManage" v-model="canvasItems"></ComponentManage>
          <component
              v-else-if="currentConfigComponent"
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
        :page-title="pageConfig.title"
    />
  </div>
</template>

<script setup>
import 'vant/lib/index.css';
import {computed, markRaw, onMounted, ref, shallowRef, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElLoading, ElMessage} from 'element-plus'
import {readPage, savePage, updatePage} from '@/api/page'
import PreviewDialog from '@/components/PreviewDialog.vue'
import ComponentsPanel from '@/components/drag/config/ComponentPanel.vue'
import PageConfig from '@/components/drag/config/PageConfig.vue'
import ComponentManage from '@/components/drag/config/ComponentManage.vue'
import ActionPanel from '@/components/drag/module/ActionPanel.vue'
import ComponentCanvas from '@/components/drag/config/ComponentCanvas.vue'


const componentsPanelRef = shallowRef(null)

const route = useRoute()
const router = useRouter()

// 获取路由参数
const pageId = route.query.id
const saving = ref(false)
const isDragging = ref(false)
const components = ref([])

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

// 记录当前悬停的目标索引
let currentHoverIndex = -1

const previewDialogRef = shallowRef(null)

// 面板状态控制
const isPageConfig = ref(true)
const isComponentManage = ref(false)

// 初始化页面数据
const initPageData = async () => {
  components.value = componentsPanelRef.value.components;
  if (!pageId || pageId <= 0) {
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
          const componentDef = componentsPanelRef.value.components.find(c => c.type === item.type)

          if (componentDef) {
            return {
              id: Date.now() + Math.random(), // 生成唯一ID
              type: item.type,
              icon: componentDef.icon,
              label: componentDef.label,
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


// 处理组件拖拽开始
const handleComponentDragStart = (e, component) => {
  isDragging.value = true
}

// 获取面板标题
const getPanelTitle = computed(() => {
  if (isPageConfig.value) return '页面设置'
  if (isComponentManage.value) return '组件管理'
  if (currentItem.value) {
    const component = componentsPanelRef.value.components.find(c => c.type === currentItem.value.type)
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
const handleComponentSelect = () => {
  isPageConfig.value = false
  isComponentManage.value = false
}
// 修改页面配置处理方法
const handlePageConfig = () => {
  isPageConfig.value = true
  isComponentManage.value = false
  currentItem.value = null
}

// 获取当前组件的配置信息
const currentComponent = computed(() => {
  if (!currentItem.value) return null
  return componentsPanelRef.value.components.find(
      c => c.type === currentItem.value.type
  )
})

// 获取当前配置组件
const currentConfigComponent = computed(() => {
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


@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
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
