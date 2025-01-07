<template>
  <div class="page-container">
    <div class="page-content">
      <!-- 左侧组件面板 -->
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

      <!-- 中间预览区域 -->
      <section class="preview-panel">
        <section class="preview-wrapper">
          <img src="@/assets/phone.png" class="status-bar" alt="phone status" />
          <div class="preview-header">
            <div class="header-back">
              <el-icon><ArrowLeft /></el-icon>
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
                  <component :is="item.component" v-bind="item.props" />
                  <div class="component-tag">
                    <span>{{ getComponentLabel(item.type) }}</span>
                    <el-icon class="delete-icon" @click.stop="removeItem(index)">
                      <Delete />
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
          <el-icon><Setting /></el-icon>
          <span>页面设置</span>
        </el-button>
        <el-button type="primary" class="action-btn" @click="handleComponentManage">
          <el-icon><Grid /></el-icon>
          <span>组件管理</span>
        </el-button>
        <el-button type="primary" class="action-btn">
          <el-icon><View /></el-icon>
          <span>&nbsp;预&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;览&nbsp;</span>
        </el-button>
        <el-button type="primary" class="action-btn">
          <el-icon><Check /></el-icon>
          <span>&nbsp;保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存&nbsp;</span>
        </el-button>
      </div>

      <!-- 右侧配置面板 -->
      <div class="config-panel">
        <div class="panel-header">{{ getPanelTitle }}</div>
        <div class="panel-content">
          <!-- 页面配置内容 -->
          <template v-if="isPageConfig">
            <el-form label-position="top">
              <el-form-item label="页面标题">
                <el-input v-model="pageTitle" placeholder="请输入页面标题" />
              </el-form-item>
              <el-form-item label="页面描述">
                <el-input v-model="pageDesc" type="textarea" rows="3" placeholder="请输入页面描述" />
              </el-form-item>
              <!-- 可以根据需要添加更多页面配置项 -->
            </el-form>
          </template>
          <!-- 组件管理内容 -->
          <template v-else-if="isComponentManage">
            <div class="component-list">
              <div class="tip-text">底部导航组件为固定页面底部，无需拖拽调整位置</div>
              <div v-for="(item, index) in canvasItems" 
                   :key="item.id"
                   class="component-list-item"
                   draggable="true"
                   @dragstart="handleListDragStart($event, index)"
                   @dragenter="handleListDragEnter($event, index)"
                   @dragover.prevent
                   @dragleave="handleListDragLeave($event)"
                   @drop="handleListDrop($event, index)"
                   @dragend="handleListDragEnd">
                <div class="item-content">
                  <el-icon><Grid /></el-icon>
                  <span class="component-name">{{ getComponentLabel(item.type) }}</span>
                </div>
                <el-button 
                  type="danger" 
                  link
                  @click="removeItem(index)"
                  class="delete-btn">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
              <el-empty v-if="canvasItems.length === 0" description="暂无组件" />
            </div>
          </template>
          <!-- 组件配置内容 -->
          <template v-else-if="currentItem">
            <el-form label-position="top">
              <!-- 根据组件类型显示不同的配置项 -->
              <template v-if="currentItem.type === 'text'">
                <el-form-item label="文本内容">
                  <el-input v-model="currentItem.props.innerHTML" type="textarea" rows="3" />
                </el-form-item>
              </template>
              <template v-else-if="currentItem.type === 'image'">
                <el-form-item label="图片地址">
                  <el-input v-model="currentItem.props.src" />
                </el-form-item>
                <el-form-item label="图片描述">
                  <el-input v-model="currentItem.props.alt" />
                </el-form-item>
              </template>
              <template v-else-if="currentItem.type === 'list'">
                <el-form-item label="列表内容">
                  <el-input v-model="currentItem.props.innerHTML" type="textarea" rows="5" />
                </el-form-item>
              </template>
            </el-form>
          </template>
          <el-empty v-else description="请选择组件" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import 'vant/lib/index.css';
import { ref, computed, watch } from 'vue'
import { Button as VanButton,Cell as VanCell,CellGroup as VanCellGroup,Image as VanImage,Popup as VanPopup,Space as VanSpace,
  // 表单组件
  Calendar as VanCalendar, Cascader as VanCascader, Checkbox as VanCheckbox, CheckboxGroup as VanCheckboxGroup, DatePicker as VanDatePicker, Field as VanField, Form as VanForm, NumberKeyboard as VanNumberKeyboard, PasswordInput as VanPasswordInput, Picker as VanPicker, Radio as VanRadio, RadioGroup as VanRadioGroup, Rate as VanRate, Search as VanSearch, Slider as VanSlider, Stepper as VanStepper, Switch as VanSwitch, TimePicker as VanTimePicker, Uploader as VanUploader,
  // 反馈组件
  ActionSheet as VanActionSheet, Dialog as VanDialog, DropdownMenu as VanDropdownMenu, DropdownItem as VanDropdownItem, Loading as VanLoading, Notify as VanNotify, Overlay as VanOverlay, PullRefresh as VanPullRefresh, ShareSheet as VanShareSheet, SwipeCell as VanSwipeCell, Toast as VanToast,
  // 展示组件
  Badge as VanBadge, Circle as VanCircle, Collapse as VanCollapse, CountDown as VanCountDown, Divider as VanDivider, Empty as VanEmpty, ImagePreview as VanImagePreview, Lazyload as VanLazyload, List as VanList, NoticeBar as VanNoticeBar, Progress as VanProgress, Skeleton as VanSkeleton, Steps as VanSteps, Step as VanStep, Sticky as VanSticky, Swipe as VanSwipe, SwipeItem as VanSwipeItem, Tag as VanTag,
  // 导航组件
  ActionBar as VanActionBar, ActionBarIcon as VanActionBarIcon, ActionBarButton as VanActionBarButton, BackTop as VanBackTop, Grid as VanGrid, GridItem as VanGridItem, IndexBar as VanIndexBar, IndexAnchor as VanIndexAnchor, NavBar as VanNavBar, Pagination as VanPagination, Sidebar as VanSidebar, SidebarItem as VanSidebarItem, Tab as VanTab, Tabs as VanTabs, Tabbar as VanTabbar, TabbarItem as VanTabbarItem, TreeSelect as VanTreeSelect,
  // 业务组件
  AddressEdit as VanAddressEdit, AddressList as VanAddressList, Area as VanArea, Card as VanCard, ContactCard as VanContactCard, ContactEdit as VanContactEdit, ContactList as VanContactList, Coupon as VanCoupon, CouponCell as VanCouponCell, CouponList as VanCouponList, SubmitBar as VanSubmitBar
} from 'vant'
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

const activeCollapse = ref(['basic'])
const pageTitle = ref('')
const pageDesc = ref('')

// 画布中的组件列表
const canvasItems = ref([])
// 当前选中的组件
const currentItem = ref(null)
// 画布引用
const canvasRef = ref(null)

// 记录拖拽的起始位置
let dragStartIndex = -1
let currentDragElement = null

// 记录当前悬停的目标索引
let currentHoverIndex = -1

// 添加响应式变量
const showDropArea = ref(false)
const dropAreaIndex = ref(-1)
const isDragging = ref(false)

// 基础组件
const basicComponents = [
  // 基础组件
  {
    type: 'vant-button',
    label: '按钮',
    icon: Document,
    component: VanButton,
    defaultProps: { 
      type: 'primary',
      text: '按钮'
    }
  },
  {
    type: 'vant-cell',
    label: '单元格',
    icon: Document,
    component: VanCell,
    defaultProps: { 
      title: '单元格',
      value: '内容'
    }
  },
  {
    type: 'vant-cell-group',
    label: '单元格组',
    icon: Document,
    component: VanCellGroup,
    defaultProps: {
      title: '分组标题',
      inset: false
    }
  },
  {
    type: 'vant-image',
    label: '图片',
    icon: Picture,
    component: VanImage,
    defaultProps: {
      width: 100,
      height: 100,
      src: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      fit: 'cover'
    }
  },
  {
    type: 'vant-popup',
    label: '弹出层',
    icon: Document,
    component: VanPopup,
    defaultProps: {
      position: 'center',
      innerHTML: '弹出层内容'
    }
  },
  {
    type: 'vant-space',
    label: '间距',
    icon: Document,
    component: VanSpace,
    defaultProps: {
      direction: 'horizontal',
      gap: '16px'
    }
  },

  // 表单组件
  {
    type: 'vant-calendar',
    label: '日历',
    icon: Document,
    component: VanCalendar,
    defaultProps: {
      poppable: false,
      showConfirm: false
    }
  },
  {
    type: 'vant-cascader',
    label: '级联选择',
    icon: Document,
    component: VanCascader,
    defaultProps: {
      options: [
        {
          text: '选项1',
          value: '1',
          children: [{ text: '子选项1', value: '11' }]
        }
      ]
    }
  },
  {
    type: 'vant-checkbox',
    label: '复选框',
    icon: Document,
    component: VanCheckbox,
    defaultProps: {
      modelValue: false,
      label: '复选框'
    }
  },
  {
    type: 'vant-checkbox-group',
    label: '复选框组',
    icon: Document,
    component: VanCheckboxGroup,
    defaultProps: {
      modelValue: ['1'],
      direction: 'horizontal'
    }
  },
  {
    type: 'vant-date-picker',
    label: '日期选择',
    icon: Document,
    component: VanDatePicker,
    defaultProps: {
      title: '选择日期'
    }
  },
  {
    type: 'vant-field',
    label: '输入框',
    icon: Document,
    component: VanField,
    defaultProps: {
      label: '文本',
      placeholder: '请输入'
    }
  },
  {
    type: 'vant-form',
    label: '表单',
    icon: Document,
    component: VanForm,
    defaultProps: {}
  },
  {
    type: 'vant-number-keyboard',
    label: '数字键盘',
    icon: Document,
    component: VanNumberKeyboard,
    defaultProps: {
      show: true
    }
  },
  {
    type: 'vant-password-input',
    label: '密码输入框',
    icon: Document,
    component: VanPasswordInput,
    defaultProps: {
      value: '',
      length: 6
    }
  },
  {
    type: 'vant-picker',
    label: '选择器',
    icon: Document,
    component: VanPicker,
    defaultProps: {
      columns: ['选项1', '选项2', '选项3']
    }
  },
  {
    type: 'vant-radio',
    label: '单选框',
    icon: Document,
    component: VanRadio,
    defaultProps: {
      name: '1'
    }
  },
  {
    type: 'vant-radio-group',
    label: '单选框组',
    icon: Document,
    component: VanRadioGroup,
    defaultProps: {
      modelValue: '1',
      direction: 'horizontal'
    }
  },
  {
    type: 'vant-rate',
    label: '评分',
    icon: Document,
    component: VanRate,
    defaultProps: {
      modelValue: 3
    }
  },
  {
    type: 'vant-search',
    label: '搜索',
    icon: Document,
    component: VanSearch,
    defaultProps: {
      placeholder: '请输入搜索关键词'
    }
  },
  {
    type: 'vant-slider',
    label: '滑块',
    icon: Document,
    component: VanSlider,
    defaultProps: {
      modelValue: 50
    }
  },
  {
    type: 'vant-stepper',
    label: '步进器',
    icon: Document,
    component: VanStepper,
    defaultProps: {
      modelValue: 1
    }
  },
  {
    type: 'vant-switch',
    label: '开关',
    icon: Document,
    component: VanSwitch,
    defaultProps: {
      modelValue: true
    }
  },
  {
    type: 'vant-time-picker',
    label: '时间选择',
    icon: Document,
    component: VanTimePicker,
    defaultProps: {
      title: '选择时间'
    }
  },
  {
    type: 'vant-uploader',
    label: '文件上传',
    icon: Document,
    component: VanUploader,
    defaultProps: {}
  },

  // 反馈组件
  {
    type: 'vant-action-sheet',
    label: '动作面板',
    icon: Document,
    component: VanActionSheet,
    defaultProps: {
      actions: [{ name: '选项1' }, { name: '选项2' }],
      show: false
    }
  },
  {
    type: 'vant-dropdown-menu',
    label: '下拉菜单',
    icon: Document,
    component: VanDropdownMenu,
    defaultProps: {}
  },
  {
    type: 'vant-loading',
    label: '加载',
    icon: Document,
    component: VanLoading,
    defaultProps: {
      type: 'circular'
    }
  },
  {
    type: 'vant-overlay',
    label: '遮罩层',
    icon: Document,
    component: VanOverlay,
    defaultProps: {
      show: false
    }
  },
  {
    type: 'vant-pull-refresh',
    label: '下拉刷新',
    icon: Document,
    component: VanPullRefresh,
    defaultProps: {}
  },
  {
    type: 'vant-share-sheet',
    label: '分享面板',
    icon: Document,
    component: VanShareSheet,
    defaultProps: {
      options: [{ name: '微信', icon: 'wechat' }],
      show: false
    }
  },
  {
    type: 'vant-swipe-cell',
    label: '滑动单元格',
    icon: Document,
    component: VanSwipeCell,
    defaultProps: {}
  },

  // 展示组件
  {
    type: 'vant-badge',
    label: '徽标',
    icon: Document,
    component: VanBadge,
    defaultProps: {
      content: '5',
      max: 99
    }
  },
  {
    type: 'vant-circle',
    label: '环形进度条',
    icon: Document,
    component: VanCircle,
    defaultProps: {
      rate: 70,
      text: '70%'
    }
  },
  {
    type: 'vant-collapse',
    label: '折叠面板',
    icon: Document,
    component: VanCollapse,
    defaultProps: {
      modelValue: ['1']
    }
  },
  {
    type: 'vant-count-down',
    label: '倒计时',
    icon: Document,
    component: VanCountDown,
    defaultProps: {
      time: 30 * 60 * 1000
    }
  },
  {
    type: 'vant-divider',
    label: '分割线',
    icon: Document,
    component: VanDivider,
    defaultProps: {
      innerHTML: '文本'
    }
  },
  {
    type: 'vant-empty',
    label: '空状态',
    icon: Document,
    component: VanEmpty,
    defaultProps: {
      description: '暂无数据'
    }
  },
  {
    type: 'vant-notice-bar',
    label: '通知栏',
    icon: Document,
    component: VanNoticeBar,
    defaultProps: {
      text: '通知内容'
    }
  },
  {
    type: 'vant-progress',
    label: '进度条',
    icon: Document,
    component: VanProgress,
    defaultProps: {
      percentage: 50
    }
  },
  {
    type: 'vant-skeleton',
    label: '骨架屏',
    icon: Document,
    component: VanSkeleton,
    defaultProps: {
      title: true,
      row: 3
    }
  },
  {
    type: 'vant-steps',
    label: '步骤条',
    icon: Document,
    component: VanSteps,
    defaultProps: {
      active: 1
    }
  },
  {
    type: 'vant-sticky',
    label: '粘性布局',
    icon: Document,
    component: VanSticky,
    defaultProps: {}
  },
  {
    type: 'vant-swipe',
    label: '轮播',
    icon: Document,
    component: VanSwipe,
    defaultProps: {}
  },
  {
    type: 'vant-tag',
    label: '标签',
    icon: Document,
    component: VanTag,
    defaultProps: {
      type: 'primary',
      innerHTML: '标签'
    }
  },

  // 导航组件
  {
    type: 'vant-action-bar',
    label: '动作栏',
    icon: Document,
    component: VanActionBar,
    defaultProps: {}
  },
  {
    type: 'vant-back-top',
    label: '回到顶部',
    icon: Document,
    component: VanBackTop,
    defaultProps: {}
  },
  {
    type: 'vant-grid',
    label: '宫格',
    icon: Document,
    component: VanGrid,
    defaultProps: {}
  },
  {
    type: 'vant-index-bar',
    label: '索引栏',
    icon: Document,
    component: VanIndexBar,
    defaultProps: {}
  },
  {
    type: 'vant-nav-bar',
    label: '导航栏',
    icon: Document,
    component: VanNavBar,
    defaultProps: {
      title: '标题'
    }
  },
  {
    type: 'vant-pagination',
    label: '分页',
    icon: Document,
    component: VanPagination,
    defaultProps: {
      total: 50
    }
  },
  {
    type: 'vant-sidebar',
    label: '侧边导航',
    icon: Document,
    component: VanSidebar,
    defaultProps: {}
  },
  {
    type: 'vant-tab',
    label: '标签页',
    icon: Document,
    component: VanTab,
    defaultProps: {}
  },
  {
    type: 'vant-tabbar',
    label: '标签栏',
    icon: Document,
    component: VanTabbar,
    defaultProps: {}
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

// 处理预览
const handlePreview = () => {
  // 实现预览逻辑
}

// 处理保存
const handleSave = () => {
  // 实现保存逻辑
}

// 重置拖拽状态
const resetDragState = () => {
  isDragging.value = false
  showDropArea.value = false
  dropAreaIndex.value = -1
}

// 处理组件拖入
const handleItemDragEnter = (e, index) => {
  e.stopPropagation()
  const item = e.currentTarget
  const rect = item.getBoundingClientRect()
  const mouseY = e.clientY - rect.top
  const middleY = rect.height / 2
  
  showDropArea.value = true
  dropAreaIndex.value = mouseY < middleY ? index : index + 1
}

// 处理预览区域拖入
const handlePreviewDragEnter = (e) => {
  e.preventDefault()
  e.stopPropagation()
  
  if (e.target === e.currentTarget) {
    showDropArea.value = true
    if (canvasItems.value.length === 0) {
      dropAreaIndex.value = 0
    } else {
      dropAreaIndex.value = canvasItems.value.length
    }
  }
}

// 处理拖拽离开
const handlePreviewDragLeave = (e) => {
  e.preventDefault()
  const relatedTarget = e.relatedTarget
  if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
    showDropArea.value = false
    dropAreaIndex.value = -1
  }
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

// 处理拖拽开始
const handleDragStart = (e, component) => {
  isDragging.value = true
  e.dataTransfer.setData('componentType', component.type)
  e.dataTransfer.effectAllowed = 'move'
}

// 处理拖拽放置
const handleDrop = (e) => {
  e.preventDefault()
  const type = e.dataTransfer.getData('componentType')
  const component = [...basicComponents, ...businessComponents].find(c => c.type === type)
  
  if (component && dropAreaIndex.value !== -1) {
    const item = {
      id: Date.now(),
      type: component.type,
      component: component.component,
      props: { ...component.defaultProps }
    }
    
    canvasItems.value.splice(dropAreaIndex.value, 0, item)
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

// 面板状态控制
const isPageConfig = ref(true)
const isComponentManage = ref(false)

// 获取面板标题
const getPanelTitle = computed(() => {
  if (isPageConfig.value) return '页面设置'
  if (isComponentManage.value) return '组件管理'
  if (currentItem.value) {
    const component = [...basicComponents, ...businessComponents].find(c => c.type === currentItem.value.type)
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
  currentItem.value = item
  isPageConfig.value = false
  isComponentManage.value = false
}

// 移除组件
const removeItem = (index) => {
  // 如果要删除的是当前选中的组件，清除选中状态
  if (currentItem.value === canvasItems.value[index]) {
    currentItem.value = null
  }
  canvasItems.value.splice(index, 1)
}

// 更新组件属性
const updateItemProps = (props) => {
  if (currentItem.value) {
    currentItem.value.props = props
  }
}

// 获取组件标题
const getComponentTitle = (type) => {
  if (!type) return null
  const component = [...basicComponents, ...businessComponents].find(c => c.type === type)
  return component ? `${component.label}配置` : '属性配置'
}

// 获取组件标签名称
const getComponentLabel = (type) => {
  const component = [...basicComponents, ...businessComponents].find(c => c.type === type)
  return component ? component.label : type
}

// 处理列表项拖拽开始
const handleListDragStart = (e, index) => {
  dragStartIndex = index
  currentDragElement = e.target
  e.target.classList.add('dragging')
  e.dataTransfer.effectAllowed = 'move'
}

// 处理列表项拖拽进入
const handleListDragEnter = (e, index) => {
  if (currentHoverIndex === index) return
  
  let targetItem = e.target
  while (targetItem && !targetItem.classList.contains('component-list-item')) {
    targetItem = targetItem.parentElement
  }
  
  if (!targetItem || targetItem === currentDragElement) return
  
  const rect = targetItem.getBoundingClientRect()
  const mouseY = e.clientY - rect.top
  const isInUpperHalf = mouseY < rect.height / 2
  
  currentHoverIndex = index
  
  // 清除所有项的状态
  const items = document.querySelectorAll('.component-list-item')
  items.forEach(item => {
    item.classList.remove('drag-over-top', 'drag-over-bottom')
  })
  
  // 添加新的状态
  if (isInUpperHalf) {
    targetItem.classList.add('drag-over-top')
  } else {
    targetItem.classList.add('drag-over-bottom')
  }
}

// 处理列表项拖拽离开
const handleListDragLeave = (e) => {
  let relatedTarget = e.relatedTarget
  while (relatedTarget && !relatedTarget.classList.contains('component-list-item')) {
    relatedTarget = relatedTarget.parentElement
  }
  
  if (relatedTarget && relatedTarget.classList.contains('component-list-item')) return
  
  currentHoverIndex = -1
  const items = document.querySelectorAll('.component-list-item')
  items.forEach(item => {
    item.classList.remove('drag-over-top', 'drag-over-bottom')
  })
}

// 处理列表项拖拽结束
const handleListDragEnd = () => {
  currentHoverIndex = -1
  const items = document.querySelectorAll('.component-list-item')
  items.forEach(item => {
    item.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom')
  })
  currentDragElement = null
}

// 处理列表项放置
const handleListDrop = (e, dropIndex) => {
  e.preventDefault()
  if (dragStartIndex === dropIndex) return
  
  // 获取目标元素
  let targetItem = e.target
  while (targetItem && !targetItem.classList.contains('component-list-item')) {
    targetItem = targetItem.parentElement
  }
  
  if (!targetItem) return
  
  // 获取鼠标在目标元素中的相对位置
  const rect = targetItem.getBoundingClientRect()
  const mouseY = e.clientY - rect.top
  const isInUpperHalf = mouseY < rect.height / 2
  
  // 调整插入位置
  let finalDropIndex = dropIndex
  if (dragStartIndex < dropIndex && !isInUpperHalf) {
    finalDropIndex -= 1
  } else if (dragStartIndex > dropIndex && isInUpperHalf) {
    finalDropIndex += 1
  }
  
  // 获取要移动的项
  const item = canvasItems.value[dragStartIndex]
  // 从数组中删除该项
  canvasItems.value.splice(dragStartIndex, 1)
  // 在新位置插入该项
  canvasItems.value.splice(finalDropIndex, 0, item)
  
  // 重置所有状态
  currentHoverIndex = -1
  handleListDragEnd()
  dragStartIndex = -1
}

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

.components-panel {
  width: 280px;
  background: #fff;
  border-right: 1px solid #dcdfe6;
  
  :deep(.el-collapse) {
    border: none;

    .el-collapse-item__header {
      padding: 0 16px;
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: #303133;
    }

    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
  
  .components-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    padding: 16px;
  }
  
  .component-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 60px;
    background: transparent;
    border-radius: 4px;
    cursor: move;
    transition: all 0.3s;
    margin: 0 auto;
    gap: 1px;
    
    &:hover {
      background-color: #409eff;
      color: #ffffff;
      
      .item-icon {
        color: #ffffff;
      }
      
      .item-label {
        color: #ffffff;
      }
    }
    
    .item-icon {
      font-size: 24px;
      color: #606266;
      transition: color 0.3s;
      line-height: 35px;
      height: 35px;
      display: flex;
      align-items: center;
    }
    
    .item-label {
      font-size: 12px;
      color: #606266;
      transition: color 0.3s;
      line-height: 1;
      height: 12px;
    }
  }
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
      left: 16px;
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
  width: 300px;
  background: #fff;
  border-left: 1px solid #dcdfe6;
  
  .panel-header {
    height: 48px;
    line-height: 48px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #dcdfe6;
    color: #303133;
  }
  
  .panel-content {
    padding: 16px;
  }
}

.action-panel {
  position: absolute;
  right: 316px;
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
</style> 
