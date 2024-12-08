<template>
  <div class="menu-manager">
    <div class="menu-content">
      <!-- 左侧手机预览 -->
      <div class="phone-preview">
        <div class="phone-header">
          <span>公众号名称</span>
        </div>
        <div class="phone-body">
          <!-- 预览内容区域 -->
        </div>
        <div class="phone-footer">
          <div class="menu-list">
            <template v-for="(menu, index) in menuData.button" :key="index">
              <div class="menu-item"
                   :class="{ 
                     active: currentMenu === menu,
                     'has-sub': menu.sub_button?.length > 0 
                   }"
                   @click="selectMenu(menu, index)">
                <span class="menu-name">{{ menu.name }}</span>
                <!-- 子菜单列表 -->
                <div class="sub-menu-list" v-if="currentMenu === menu">
                  <div class="sub-menu-items">
                    <div v-for="(subMenu, subIndex) in menu.sub_button"
                         :key="subIndex"
                         class="sub-menu-item"
                         :class="{ active: currentSubMenu === subMenu }"
                         @click.stop="selectSubMenu(subMenu, index, subIndex)">
                      <span class="sub-menu-name">{{ subMenu.name }}</span>
                    </div>
                  </div>
                  <!-- 添加子菜单按钮 -->
                  <div class="add-sub-menu"
                       v-if="menu.sub_button.length < 5"
                       @click.stop="addSubMenu(menu)">
                    <i class="fa fa-plus"></i>&nbsp;&nbsp;
                    <span>添加子菜单</span>
                  </div>
                </div>
              </div>
            </template>
            <!-- 添加主菜单按钮 -->
            <div :class="{'add-menu':true,'add-menu-green':menuData.button.length === 0}"
                 v-if="menuData.button.length < 3"
                 @click="addMainMenu">
              <i class="fa fa-plus"></i>
              <span v-if="menuData.button.length === 0">添加菜单</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧编辑区 -->
      <div class="menu-edit-panel">
        <template v-if="currentMenu || currentSubMenu">
          <div class="edit-header">
            <h3>{{ currentSubMenu ? '子菜单' : '菜单' }}设置</h3>
            <div class="delete-btn" @click="handleDelete">
              <i class="fa fa-trash"></i>
            </div>
          </div>
          <div class="edit-content">
            <div class="form-group">
              <label>菜单名称</label>
              <input type="text"
                     v-model="getEditingMenu.name"
                     :maxlength="getEditingMenu.sub_button?.length ? 4 : 7"
                     class="form-control"
                     @input="validateMenuName">
              <div class="form-tip">
                {{ getEditingMenu.sub_button?.length ? '一级菜单' : '子菜单' }}名称不多于
                {{ getEditingMenu.sub_button?.length ? 4 : 7 }}个汉字或14个字母
              </div>
            </div>

            <!-- 菜单动作类型 -->
            <div class="form-group" v-if="!getEditingMenu.sub_button?.length">
              <label>菜单动作</label>
              <div class="menu-type-list">
                <div class="menu-type-item"
                     :class="{ active: getEditingMenu.type === 'view' }"
                     @click="setMenuType('view')">
                  <i class="fa fa-link"></i>
                  <span>跳转网页</span>
                </div>
                <div class="menu-type-item"
                     :class="{ active: getEditingMenu.type === 'click' }"
                     @click="setMenuType('click')">
                  <i class="fa fa-comment"></i>
                  <span>发送消息</span>
                </div>
              </div>
            </div>

            <!-- 跳转网页配置 -->
            <div class="form-group" v-if="getEditingMenu.type === 'view' && !getEditingMenu.sub_button?.length">
              <label>页面地址</label>
              <input type="text"
                     v-model="getEditingMenu.url"
                     class="form-control"
                     placeholder="请输入完整的页面地址，例如：http://www.qq.com">
              <div class="form-tip">
                必须以 http:// 或 https:// 开头
              </div>
            </div>

            <!-- 发送消息配置 -->
            <div class="form-group" v-if="getEditingMenu.type === 'click' && !getEditingMenu.sub_button?.length">
              <label>回复内容</label>
              <textarea v-model="getEditingMenu.key"
                        class="form-control"
                        rows="4"
                        placeholder="请输入回复内容"></textarea>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="empty-tips">
            <i class="fa fa-hand-pointer-o"></i>
            <p>点击菜单或添加菜单进行配置</p>
          </div>
        </template>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="menu-footer">
      <div class="btn-group">
        <button class="btn btn-primary" @click="publishMenu">
          <i class="fa fa-send"></i> 发布
        </button>
        <button class="btn btn-default" @click="previewMenu">
          <i class="fa fa-eye"></i> 预览
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {ElMessage} from 'element-plus'

const menuData = ref({
  button: []
})

const currentMenu = ref(null)
const currentSubMenu = ref(null)

// 获取当前编辑的菜单
const getEditingMenu = computed(() => {
  return currentSubMenu.value || currentMenu.value || {}
})

// 选择主菜单
const selectMenu = (menu, index) => {
  currentMenu.value = menu
  currentSubMenu.value = null
}

// 选择子菜单
const selectSubMenu = (subMenu, menuIndex, subIndex) => {
  currentSubMenu.value = subMenu
}

// 添加主菜单
const addMainMenu = () => {
  if (menuData.value.button.length >= 3) {
    ElMessage.warning('最多添加3个一级菜单')
    return
  }

  const newMenu = {
    name: '菜单名称',
    sub_button: []
  }

  menuData.value.button.push(newMenu)
  currentMenu.value = newMenu
  currentSubMenu.value = null
}

// 添加子菜单
const addSubMenu = (menu) => {
  if (menu.sub_button.length >= 5) {
    ElMessage.warning('最多添加5个子菜单')
    return
  }

  const newSubMenu = {
    type: 'view',
    name: '子菜单名称',
    url: ''
  }

  menu.sub_button.push(newSubMenu)
  currentMenu.value = menu
  currentSubMenu.value = newSubMenu
}

// 删除菜单或子菜单
const handleDelete = () => {
  if (currentSubMenu.value) {
    const menuIndex = menuData.value.button.findIndex(m => m === currentMenu.value)
    const subIndex = currentMenu.value.sub_button.findIndex(s => s === currentSubMenu.value)
    if (confirm('确定删除该子菜单吗？')) {
      currentMenu.value.sub_button.splice(subIndex, 1)
      currentSubMenu.value = null
    }
  } else if (currentMenu.value) {
    const index = menuData.value.button.findIndex(m => m === currentMenu.value)
    if (confirm('确定删除该菜单吗？')) {
      menuData.value.button.splice(index, 1)
      currentMenu.value = null
    }
  }
}

// 验证菜单名称
const validateMenuName = () => {
  const menu = getEditingMenu.value
  const maxLength = menu.sub_button?.length ? 4 : 7

  if (menu.name.length > maxLength) {
    menu.name = menu.name.slice(0, maxLength)
  }
}

// 发布菜单
const publishMenu = async () => {
  try {
    // 这里添加发布到服务器的逻辑
    ElMessage.success('发布成功')
  } catch (error) {
    ElMessage.error('发布失败')
  }
}

// 预览菜单
const previewMenu = () => {
  ElMessage.info('预览功能开发中')
}

// 设置菜单类型
const setMenuType = (type) => {
  if (getEditingMenu.value) {
    getEditingMenu.value.type = type
    if (type === 'view') {
      getEditingMenu.value.url = ''
      delete getEditingMenu.value.key
    } else if (type === 'click') {
      getEditingMenu.value.key = ''
      delete getEditingMenu.value.url
    }
  }
}
</script>

<style scoped>
.menu-manager {
  height: 100%;
  background: #f4f5f9;
  padding: 20px;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
}

.menu-content {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
}

/* 手机预览样式 */
.phone-preview {
  width: 320px;
  height: 600px;
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #ddd;
}

.phone-header {
  height: 45px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #333;
  border-bottom: 1px solid #ddd;
}

.phone-body {
  height: calc(100% - 95px);
  overflow-y: auto;
  background: #f5f5f7;
}

.phone-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #f7f7f7;
  border-top: 1px solid #ddd;
}

/* 菜单列表样式 */
.menu-list {
  display: flex;
  height: 100%;
}

.menu-item {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 49px;
  border: 1px solid #e7e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.menu-item:last-child {
  //border-right: none;
}

.menu-item.active {
  background: #fff;
  border: 1px solid #44b549;
  z-index: 1;
}

.menu-name {
  font-size: 13px;
  color: #616161;
  transition: color 0.3s ease;
}

.menu-item.active .menu-name {
  color: #44b549;
}

/* 子菜单列表样式 */
.sub-menu-list {
  position: absolute;
  bottom: 100%;
  left: -1px;
  right: -1px;
  background: #fff;
  border: 1px solid #e7e7eb;
  border-radius: 3px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  text-align: center;
}

.sub-menu-items {
  max-height: 308px;
  overflow-y: auto;
}

.sub-menu-item {
  position: relative;
  padding: 0 12px;
  height: 44px;
  line-height: 44px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.sub-menu-item:hover {
  background: #f8f8f8;
}

.sub-menu-item.active {
  background: #f4f5f9;
}

.sub-menu-item.active .sub-menu-name {
  color: #44b549;
}

.sub-menu-name {
  flex: 1;
  font-size: 13px;
  color: #616161;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 添加按钮样式 */
.add-sub-menu {
  height: 44px;
  line-height: 44px;
  padding: 0 12px;
  color: #616161;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-top: 1px solid #e7e7eb;
  white-space: nowrap;
  font-size: 12px;
  text-align: center;
}

.add-sub-menu:hover {
  background: #f8f8f8;
}

.add-menu {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  cursor: pointer;
  gap: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.add-menu-green {
  color: #44b549;
}

.add-menu:hover {
  background: #f4f5f9;
}

/* 右侧编辑面板样式 */
.menu-edit-panel {
  flex: 1;
  background: #fff;
  border: 1px solid #e7e7eb;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid #e7e7eb;
  background: #f4f5f9;
}

.edit-header h3 {
  font-size: 14px;
  color: #353535;
  margin: 0;
  font-weight: normal;
}

.delete-btn {
  cursor: pointer;
  color: #e15f63;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #fff1f0;
}

.edit-content {
  padding: 20px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: #353535;
}

.form-control {
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  font-size: 13px;
  color: #555;
  background: #fff;
  border: 1px solid #e7e7eb;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.form-control:hover {
  border-color: #d0d0d0;
}

.form-control:focus {
  border-color: #44b549;
  outline: none;
  box-shadow: 0 0 0 2px rgba(68, 181, 73, 0.1);
}

.form-tip {
  margin-top: 6px;
  font-size: 12px;
  color: #9e9e9e;
}

/* 底部操作栏样式 */
.menu-footer {
  height: 60px;
  background: #fff;
  border-top: 1px solid #e7e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  margin: 0 -20px;
  margin-top: 20px;
}

.btn-group {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #44b549;
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background: #2f9833;
}

.btn-default {
  background: #fff;
  border: 1px solid #e7e7eb;
  color: #616161;
}

.btn-default:hover {
  border-color: #44b549;
  color: #44b549;
}

.btn i {
  font-size: 14px;
}

/* 添加菜单选项样式 */
.menu-options {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #e7e7eb;
  border-radius: 3px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  width: 120px;
  margin-bottom: 8px;
  z-index: 11;
  white-space: nowrap;
}

.menu-option {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
  font-size: 13px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.menu-option:hover {
  background: #f4f5f9;
  color: #44b549;
}

.menu-option span {
  white-space: nowrap;
}

/* 菜单类型选择样式 */
.menu-type-list {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.menu-type-item {
  flex: 1;
  height: 80px;
  border: 1px solid #e7e7eb;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-type-item:hover {
  border-color: #44b549;
  color: #44b549;
}

.menu-type-item.active {
  background: #44b549;
  border-color: #44b549;
  color: #fff;
}

.menu-type-item i {
  font-size: 20px;
}

.menu-type-item span {
  font-size: 13px;
}

/* 文本框样式 */
textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.form-control::placeholder {
  color: #999;
}

/* 添加菜单选项箭头 */
.menu-options::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #fff;
}

.menu-options::before {
  content: '';
  position: absolute;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid #e7e7eb;
}

/* 添加子菜单列表箭头 */
.sub-menu-list::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #fff;
}

.sub-menu-list::before {
  content: '';
  position: absolute;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid #e7e7eb;
}

/* 添加空状态提示样式 */
.empty-tips {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  padding: 30px;
}

.empty-tips i {
  font-size: 32px;
  margin-bottom: 15px;
  color: #bbb;
}

.empty-tips p {
  font-size: 14px;
  margin: 0;
}

/* 增加样式特异性 */
.menu-edit-panel .empty-tips {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  padding: 30px;
  text-align: center;
}

.menu-edit-panel .empty-tips i {
  font-size: 32px;
  margin-bottom: 15px;
  color: #bbb;
  display: block;
}

.menu-edit-panel .empty-tips p {
  font-size: 14px;
  margin: 0;
  color: #999;
  line-height: 1.5;
}

/* 确保编辑面板样式正确 */
.menu-content .menu-edit-panel {
  flex: 1;
  background: #fff;
  border: 1px solid #e7e7eb;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 600px;
}
</style> 