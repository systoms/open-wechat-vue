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
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
            >
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="dateShortcuts"
            />
          </el-form-item>
          <el-form-item class="form-buttons">
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>查询
            </el-button>
            <el-button @click="resetSearch" style="margin-left: 16px;">
              <el-icon><RefreshLeft /></el-icon>重置
            </el-button>
            <el-button type="text" @click="isExpand = !isExpand" style="margin-left: 16px;">
              {{ isExpand ? '收起' : '展开' }}
              <el-icon class="expand-icon" :class="{ 'is-expand': isExpand }">
                <ArrowDown />
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
          <el-icon><Plus /></el-icon>新增
        </el-button>
        <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>批量删除
        </el-button>
      </div>
      <div class="right">
        <el-button :icon="Refresh" circle @click="getTableData" />
        <el-button :icon="Setting" circle />
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <router-link to="/wechat/offiaccount/wqqweqweqw/dashboard">管理</router-link>
          <el-button type="primary" link @click="handleEdit(row)">管理</el-button>
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination-wrapper">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        :layout="'total, sizes, prev, pager, next, jumper'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        prev-text="上一页"
        next-text="下一页"
    >
        <template #total>
        总共 {{ total }} 条数据
        </template>
        <template #sizes="{ size }">
        每页
        <el-select
            v-model="pageSize"
            :modelValue="size"
            @change="handleSizeChange"
            style="margin: 0 4px; width: 100px"
        >
            <el-option
            v-for="item in [10, 20, 50, 100]"
            :key="item"
            :value="item"
            :label="`${item}条/页`"
            />
        </el-select>
        </template>
    </el-pagination>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="460px"
      destroy-on-close
      :close-on-click-modal="false"
      draggable
      class="dialog-form"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="70px"
      >
        <el-form-item label="名称" prop="name">
          <el-input 
            v-model="formData.name" 
            placeholder="请输入���称"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshLeft, ArrowDown, Plus, Delete, Refresh, Setting } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  dateRange: []
})

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
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formRef = ref(null)
const formData = reactive({
  name: '',
  status: '1'
})
const formRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 添加提交loading状态
const submitLoading = ref(false)

// 获取表格数据
const getTableData = async () => {
  loading.value = true
  try {
    // 这里替换为实际的API调用
    const mockData = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      name: `测试数据${index + 1}`,
      status: index % 2 === 0 ? '1' : '0',
      createTime: new Date().toLocaleString()
    }))
    tableData.value = mockData
    total.value = 100
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

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  handleSearch()
}

// 表格选择
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增'
  dialogVisible.value = true
  formData.name = ''
  formData.status = '1'
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑'
  dialogVisible.value = true
  Object.assign(formData, row)
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条数据吗？', '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    getTableData()
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 条数据吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    getTableData()
  })
}

// 修改提交方法
const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    // 这里替换为实际的API调用
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟请求
    
    ElMessage.success(dialogTitle.value + '成功')
    dialogVisible.value = false
    getTableData()
  } catch (error) {
    console.error(error)
    error.message && ElMessage.error(error.message)
  } finally {
    submitLoading.value = false
  }
}

// 分页
const handleSizeChange = () => {
  getTableData()
}

const handleCurrentChange = () => {
  getTableData()
}

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
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
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
          
          &+.el-button {
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

// 优化按钮样式
:deep(.el-button) {
  &.el-button--primary {
    --el-button-hover-bg-color: var(--el-color-primary-light-3);
    --el-button-hover-border-color: var(--el-color-primary-light-3);
  }
}

// 优化表格样式
:deep(.el-table) {
  // 更紧凑的表格
  --el-table-header-padding: 6px 0;
  --el-table-padding: 6px 0;
  
  .el-table__header-wrapper {
    th {
      background-color: #f5f7fa;
      font-weight: 500;
      height: 40px;
    }
  }
  
  .el-table__body-wrapper {
    .el-table__row {
      height: 40px;
    }
  }
}

// 弹窗样式
:deep(.el-dialog) {
  border-radius: 8px;
  margin-top: 15vh !important;
  
  .el-dialog__header {
    margin: 0;
    padding: 8px 16px 0;
    
    .el-dialog__title {
      font-size: 15px;
      font-weight: 500;
      color: #1f2f3d;
      line-height: 1.5;
    }

    .el-dialog__headerbtn {
      top: 8px;
      right: 12px;
    }
  }
  
  .el-dialog__body {
    padding: 12px 16px 8px;
  }
  
  .el-dialog__footer {
    padding: 0 16px 12px;
    border-top: none;
    margin-top: 0;
    
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  }
}

.dialog-form {
  :deep(.el-form-item) {
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .el-form-item__label {
      font-weight: normal;
      color: #606266;
      padding-right: 8px;
      font-size: 13px;
    }
    
    .el-input__wrapper {
      box-shadow: 0 0 0 1px #dcdfe6 inset;
      padding: 0 12px;
      height: 32px;
      
      &:hover {
        box-shadow: 0 0 0 1px #c0c4cc inset;
      }
      
      &.is-focus {
        box-shadow: 0 0 0 1px #409eff inset;
      }
    }
    
    .el-radio-group {
      .el-radio {
        margin-right: 20px;
        font-size: 13px;
        
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}

// 优化按钮样式
:deep(.el-button) {
  padding: 0 16px;
  height: 32px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &.el-button--primary {
    --el-button-hover-bg-color: var(--el-color-primary-light-3);
    --el-button-hover-border-color: var(--el-color-primary-light-3);
  }
}
</style> 