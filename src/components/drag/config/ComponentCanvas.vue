<template>
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
          <span>{{ pageConfig.title }}</span>
        </div>
      </div>
      <!-- 内层容器用于滚动 -->
      <section class="preview-container"
               @dragover="handlePreviewDragOver"
               @drop.prevent="handleDrop"
               @dragend.prevent="handleDragEnd"
               ref="canvasRef">
        <section class="canvas-content">
          <template v-for="(item, index) in canvasItems" v-bind:key="item.id">
            <!-- 在每个组件前显示放置区域 -->
            <PlacementArea v-if="showDropArea && dropAreaIndex === index"></PlacementArea>

            <div class="canvas-item"
                 :class="{ active: currentItem?.id === item.id }"
                 @click="selectItem(item)">
              <component :is="item.component" v-model="item.props"/>
              <ComponentTag :index="index" :item="item" @remove="removeItem"></ComponentTag>
            </div>
          </template>

          <!-- 在末尾显示放置区域 -->
          <PlacementArea v-if="showDropArea && dropAreaIndex === canvasItems.length"></PlacementArea>
        </section>
      </section>
    </section>
  </section>
</template>
<script setup>
import ComponentTag from "@/components/drag/module/ComponentTag.vue";
import {ArrowLeft} from "@element-plus/icons-vue";
import PlacementArea from "@/components/drag/module/PlacementArea.vue";
import {markRaw, ref, shallowRef} from "vue";

// 画布引用
const canvasRef = shallowRef(null)

const showDropArea = ref(false)
const dropAreaIndex = ref(-1)

const props = defineProps({
  isDragging: {
    type: Boolean,
    default: () => false,
  },
  components: {
    type: Array,
    default: () => [],
  },
  canvasItems: {
    type: Array,
    default: () => [],
  },
  pageConfig: {
    type: Object,
    default: () => ({
      title: '页面标题',
      description: '页面描述',
      enabled: true
    }),
  },
  currentItem: {
    type: Object, // 如果 currentItem 是一个对象
    default: () => null, // 默认值为 null
  },
})

const emit = defineEmits(['update:isDragging', 'update:canvasItems', 'update:currentItem', 'handleComponentSelect']);

// 重置拖拽状态
const resetDragState = () => {
  emit('update:isDragging', false);
  showDropArea.value = false
  dropAreaIndex.value = -1
}

// 处理预览区域拖动
const handlePreviewDragOver = (e) => {
  e.preventDefault()
  if (!props.isDragging) return

  // 计算插入位置
  const container = e.currentTarget
  const items = container.querySelectorAll('.canvas-item')
  let newIndex = props.canvasItems.length

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
  const component = props.components.find(c => c.type === type)

  if (component && dropAreaIndex.value !== -1) {
    const item = {
      id: Date.now(),
      icon: component.icon,
      type: component.type,
      label: component.label,
      component: markRaw(component.component),
      props: component.getDefaultProps
    }

    emit('update:canvasItems', [
      ...props.canvasItems.slice(0, dropAreaIndex.value),
      item,
      ...props.canvasItems.slice(dropAreaIndex.value)
    ]);
    emit('handleComponentSelect', item);
  }

  resetDragState()
}

// 处理拖拽结束
const handleDragEnd = () => {
  resetDragState()
}


// 修改选择组件方法
const selectItem = (item) => {
  emit('handleComponentSelect', props.canvasItems.find(i => i.id === item.id));
}

// 修改移除组件方法
const removeItem = (index) => {
  // 使用 filter 创建新数组
  emit('update:canvasItems', props.canvasItems.filter((_, i) => i !== index));
}
</script>

<style scoped lang="less">
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
</style>