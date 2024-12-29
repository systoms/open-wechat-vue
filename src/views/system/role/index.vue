<template>
  <div class="table-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <div class="form-content">
          <el-form-item>
            <el-input
                v-model="searchForm.keyword"
                placeholder="请输入关键词搜索"
                clearable
                :prefix-icon="Search"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :shortcuts="dateShortcuts"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item class="form-buttons">
            <el-button type="primary" @click="handleSearch">
              <el-icon>
                <Search/>
              </el-icon>
              查询
            </el-button>
            <el-button @click="resetSearch" style="margin-left: 16px;">
              <el-icon>
                <RefreshLeft/>
              </el-icon>
              重置
            </el-button>
            <el-button @click="isExpand = !isExpand" style="margin-left: 16px;">
              {{ isExpand ? '收起' : '展开' }}
              <el-icon class="expand-icon" :class="{ 'is-expand': isExpand }">
                <ArrowDown/>
              </el-icon>
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="operation-wrapper">
      <div class="left">
        <el-button type="primary" @click="handleAdd">
          <el-icon>
            <Plus/>
          </el-icon>
          新增
        </el-button>
        <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
          <el-icon>
            <Delete/>
          </el-icon>
          批量删除
        </el-button>
      </div>
      <div class="right">
        <el-button :icon="Refresh" circle @click="getTableData"/>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        border
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="company_role_id" label="ID" width="80"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="created_at" label="创建时间" width="180"/>
      <el-table-column prop="updated_at" label="更新时间" width="180"/>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination-wrapper">
      <el-pagination
          v-model:current-page="pageInfo.currentPage"
          :total="pageInfo.total"
          :page-count="pageInfo.totalPage"
          :disabled="true"
          :layout="'total, prev, pager, next, jumper'"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          prev-text="上一页"
          next-text="下一页"
          :size="10"
      >
      </el-pagination>
    </div>

    <!-- ���增/编辑弹窗 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
        destroy-on-close
        :close-on-click-modal="false"
        draggable
        class="dialog-form"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="70px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-tree
              ref="treeRef"
              :data="menuTree"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="{
              label: 'label',
              children: 'children'
            }"
              :default-checked-keys="selectedPermissions"
              @check="handlePermissionCheck"
              class="custom-tree"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Search, RefreshLeft, ArrowDown, Plus, Delete, Refresh} from '@element-plus/icons-vue'
import {getRoleList, saveRole, updateRole, changeRoleStatus, deleteRole, readRole} from '@/api/system/role'
import {getMenuTree} from '@/api/system/menu'


// 将表单默认值提取为常量
const DEFAULT_FORM_DATA = {
  company_role_id: 0,
  name: '',
  remark: '',
}

// 搜索表单使用 ref 而不是 reactive，便于重置
const searchForm = ref({
  keyword: '',
  dateRange: []
})

// 表单数据使用 ref，避免 reactive 的限制
const formData = ref({...DEFAULT_FORM_DATA})

// 展开/收起
const isExpand = ref(false)

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

// 表格数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])

// 分页
const pageInfo = ref({
  currentPage: 1,
  total: 0,
  totalPage: 0,
})
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formRef = ref(null)
const menuTree = ref([])
const selectedPermissions = ref([])
const treeRef = ref(null)


const formRules = {
  name: [{required: true, message: '请输入角色名', trigger: 'blur'}],
  remark: [{required: true, message: '请输入备注', trigger: 'blur'}],
}

// 添加提交loading状态
const submitLoading = ref(false)

// API 调用统一错误处理
const handleApiCall = async (apiCall, successMsg) => {
  try {
    submitLoading.value = true
    const result = await apiCall()
    ElMessage.success(successMsg)
    return result
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message || '操作失败')
    throw error
  } finally {
    submitLoading.value = false
  }
}

// 获取表格数据优化
const getTableData = async () => {
  loading.value = true
  try {
    const result = await getRoleList({
      ...searchForm.value,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    tableData.value = result.data.items
    pageInfo.value = result.data.pageInfo;
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getTableData()
}

// 重置搜索优化
const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    status: '',
    dateRange: []
  }
  handleSearch()
}

// 表格选择
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 获取权限树数据
const getMenuTreeData = async () => {
  try {
    const {data} = await getMenuTree()
    menuTree.value = data
  } catch (error) {
    console.error('获取权限树失败:', error)
    ElMessage.error('获取权限树失败')
  }
}

// 处理权限选择
const handlePermissionCheck = (node, {checkedKeys, checkedNodes}) => {
  selectedPermissions.value = checkedKeys
}

// 新增角色
const handleAdd = () => {
  dialogTitle.value = '新增'
  dialogVisible.value = true
  formData.value = {...DEFAULT_FORM_DATA}
  selectedPermissions.value = [] // 清空已选权限
}

// 编辑角色
const handleEdit = async (row) => {
  dialogTitle.value = '编辑'
  dialogVisible.value = true
  try {
    const {data} = await readRole(row.company_role_id)
    formData.value = {
      company_role_id: data.company_role_id,
      name: data.name,
      remark: data.remark
    }
    // 设置已选中的权限
    selectedPermissions.value = data.permissions || []
  } catch (error) {
    console.error('获取角色详情失败:', error)
    ElMessage.error('获取角色详情失败')
  }
}

// 删除操作优化
const handleDelete = async (row) => {
  await ElMessageBox.confirm('确认删除该条数据吗？', '提示', {type: 'warning'})
  await handleApiCall(
      () => deleteRole(row.company_role_id),
      '删除成功'
  )
  getTableData()
}

// 批量删除优化
const handleBatchDelete = async () => {
  const ids = selectedRows.value.map(row => row.company_role_id)
  await ElMessageBox.confirm(
      `确认删除选中的 ${ids.length} 条数据吗？`,
      '提示',
      {type: 'warning'}
  )
  await handleApiCall(
      () => deleteRole(ids),
      '批量删除成功'
  )
  getTableData()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const submitData = {
        ...formData.value,
        permissions: selectedPermissions.value // 添加权限数据
      }
      try {
        if (formData.value.company_role_id) {
          await handleApiCall(() => updateRole(submitData), '更新成功')
        } else {
          await handleApiCall(() => saveRole(submitData), '新增成功')
        }
        dialogVisible.value = false
        getTableData()
      } catch (error) {
        // 错误已在 handleApiCall 中处理
      }
    }
  })
}

// 分页
const handleSizeChange = () => {
  getTableData()
}

const handleCurrentChange = () => {
  getTableData()
}

// 添加一个处理函数来手动控制节点展开
const handleNodeExpand = (data, node) => {
  if (node.level === 1) {
    // 如果是一级节点，确保其子节点容器使用flex布局
    const el = node.el
    if (el) {
      const children = el.querySelector('.el-tree-node__children')
      if (children) {
        children.style.display = 'flex'
        children.style.flexWrap = 'wrap'
      }
    }
  }
}

// 组件挂载时获取权限树数据
onMounted(() => {
  getMenuTreeData()
  // 确保树组件完全渲染后执行
  nextTick(() => {
    if (treeRef.value) {
      // 默认展开所有节点
      treeRef.value.expandAll()
    }
  })
})

// 初始化
getTableData()
</script>

<style lang="less" scoped>
.table-container {
  padding: 16px;
  background: #fff;
  border-radius: 4px;

  .search-wrapper {
    margin-bottom: 8px;
  }

  .operation-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    margin-bottom: 8px;

    .left {
      display: flex;
      gap: 8px;

      .el-button {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 32px;
        padding: 0 12px;

        .el-icon {
          font-size: 14px;
        }
      }
    }

    .right {
      display: flex;
      gap: 8px;

      .el-button {
        height: 32px;
        width: 32px;
        padding: 0;
        font-size: 14px;
      }
    }
  }

  .pagination-wrapper {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }
}

.search-wrapper {
  background: #fff;
  padding: 16px 0;
  margin-bottom: 16px;

  .search-form {
    .form-content {
      display: flex;
      flex-wrap: wrap;
      gap: 16px 24px;
      align-items: flex-start;

      :deep(.el-form-item) {
        margin: 0;

        .el-input__wrapper,
        .el-select .el-input__wrapper,
        .el-date-editor.el-input__wrapper {
          box-shadow: 0 0 0 1px #dcdfe6 inset;
          padding: 0 12px;
          height: 36px;
          border-radius: 4px;

          &:hover {
            box-shadow: 0 0 0 1px #c0c4cc inset;
          }

          &.is-focus {
            box-shadow: 0 0 0 1px #409eff inset;
          }
        }

        .el-input {
          width: 220px;

          .el-input__prefix {
            color: #909399;
          }
        }

        .el-select {
          width: 180px;
        }

        .el-date-editor {
          width: 320px;
        }
      }

      .form-buttons {
        margin-left: auto;
        display: flex;
        align-items: center;

        .el-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 36px;
          padding: 0 20px;

          .el-icon {
            font-size: 14px;
          }

          & + .el-button {
            margin-left: 0;
          }
        }

        .expand-icon {
          transition: transform 0.3s;

          &.is-expand {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}

.dialog-form {
  :deep(.custom-tree) {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
  }

  /* 重置所有节点的children样式 */

  :deep(.el-tree-node__children) {
    overflow: visible !important;
  }

  /* 专门控制一级节点下的children容器 */

  :deep(.el-tree > .el-tree-node > .el-tree-node__children) {
    display: flex !important;
    flex-wrap: wrap !important;
    flex-direction: row !important;
  }

  /* 专门控制二级节点的样式 */

  :deep(.el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node) {
    width: 200px !important;
    margin: 0 10px 10px 0 !important;
    flex: 0 0 auto !important;
    display: inline-block !important;
  }

  /* 确保三级节点垂直排列 */

  :deep(.el-tree-node__children .el-tree-node__children) {
    display: block !important;
  }

  /* 调整节点内容的样式 */

  :deep(.el-tree-node__content) {
    height: 32px !important;
    line-height: 32px !important;
  }
}

</style> 