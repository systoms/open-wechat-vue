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
              <el-option label="启用" value="1"/>
              <el-option label="禁用" value="0"/>
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
        <el-button type="primary">
          <router-link to="/page/edit">
          <el-icon>
            <Plus/>
          </el-icon>
          新增
          </router-link>
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
      <el-table-column prop="company_page_id" label="ID" width="80"/>
      <el-table-column prop="title" label="名称"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column prop="sort" label="排序" width="180"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180"/>
      <el-table-column prop="updated_at" label="更新时间" width="180"/>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link>
            <router-link :to="'/page/edit?id='+row.company_page_id">编辑</router-link>
          </el-button>
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
          :disabled="true"
          :page-sizes="[10, 20, 50, 100]"
          :layout="'total, prev, pager, next, jumper'"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          prev-text="上一页"
          next-text="下一页"
      >
      </el-pagination>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="460px" destroy-on-close :close-on-click-modal="false"
               draggable class="dialog-form">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="70px">
        <el-form-item label="姓名" prop="fullname">
          <el-input v-model="formData.fullname" placeholder="请输入姓名" clearable/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" clearable/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="启用" value="1"></el-radio>
            <el-radio label="禁用" value="0"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="name">
          <el-input v-model="formData.password" placeholder="请输入密码"/>
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
import {ref, reactive} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Search, RefreshLeft, ArrowDown, Plus, Delete, Refresh, Setting} from '@element-plus/icons-vue'
import {getPageList, savePage, updatePage, changePageStatus, deletePage,readPage} from '@/api/page'


// 将表单默认值提取为常量
const DEFAULT_FORM_DATA = {
  company_page_id: 0,
  fullname: '',
  username: '',
  status: '1',
  password: '',
}

// 搜索表单使用 ref 而不是 reactive，便于重置
const searchForm = ref({
  keyword: '',
  status: '',
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
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formRef = ref(null)


const formRules = {
  fullname: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
  username: [{required: true, message: '请输入用户吗', trigger: 'blur'}],
  status: [{required: true, message: '请选择状态', trigger: 'change'}]
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
    const result = await getPageList({
      ...searchForm.value,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    tableData.value = result.data.items
    total.value = result.data.pageInfo.total
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

// 新增操作优化
const handleAdd = () => {
  formData.value = {...DEFAULT_FORM_DATA}
  dialogTitle.value = '新增'
  dialogVisible.value = true
}

// 编辑操作优化
const handleEdit = (row) => {
  formData.value = {...row, password: ''}
  dialogTitle.value = '编辑'
  dialogVisible.value = true
}

// 删除操作优化
const handleDelete = async (row) => {
  await ElMessageBox.confirm('确认删除该条数据吗？', '提示', {type: 'warning'})
  await handleApiCall(
      () => deleteUser(row.company_page_id),
      '删除成功'
  )
  getTableData()
}

// 批量删除优化
const handleBatchDelete = async () => {
  const ids = selectedRows.value.map(row => row.company_page_id)
  await ElMessageBox.confirm(
      `确认删除选中的 ${ids.length} 条数据吗？`,
      '提示',
      {type: 'warning'}
  )
  await handleApiCall(
      () => deletePage(ids),
      '批量删除成功'
  )
  getTableData()
}

// 提交操作优化
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()

  const apiCall = formData.value.company_page_id
      ? () => updatePage(formData.value.company_page_id, formData.value)
      : () => savePage(formData.value)

  await handleApiCall(apiCall, `${dialogTitle.value}成功`)
  dialogVisible.value = false
  getTableData()
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

</style> 