<template>
  <el-form label-position="top">
    <!-- 轮播设置 -->
    <div class="config-section">
      <div class="section-header">
        <el-icon><Setting /></el-icon>
        <span>轮播设置</span>
      </div>
      <div class="section-content">
        <el-form-item label="自动播放">
          <el-switch 
            v-model="autoplayValue" 
            @change="updateAutoplay" 
          />
        </el-form-item>
        <el-form-item label="轮播间隔(ms)" v-if="autoplayValue">
          <el-input-number 
            v-model="intervalValue" 
            :min="1000" 
            :max="10000" 
            :step="500"
            @change="updateInterval"
          />
        </el-form-item>
      </div>
    </div>

    <!-- 图片列表 -->
    <div class="config-section">
      <div class="section-header">
        <el-icon><Picture /></el-icon>
        <span>图片列表</span>
      </div>
      <div class="section-content">
        <div v-for="(image, index) in modelValue.images" 
             :key="index" 
             class="image-config-item">
          <div class="image-header">
            <div class="image-title">
              <el-icon><Picture /></el-icon>
              <span>图片 {{ index + 1 }}</span>
            </div>
            <div class="image-actions">
              <el-button 
                type="primary" 
                link 
                @click="moveImage(index, 'up')"
                :disabled="index === 0">
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button 
                type="primary" 
                link 
                @click="moveImage(index, 'down')"
                :disabled="index === modelValue.images.length - 1">
                <el-icon><ArrowDown /></el-icon>
              </el-button>
              <el-button 
                type="danger" 
                link 
                @click="removeImage(index)"
                v-if="modelValue.images.length > 1">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          
          <!-- 图片预览 -->
          <div class="image-preview" @click="handleImageClick(index)">
            <el-image 
              :src="image.url" 
              fit="cover"
              :preview-src-list="[image.url]"
              :initial-index="0"
              preview-teleported>
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                  <span>加载失败</span>
                </div>
              </template>
            </el-image>
          </div>

          <el-form-item label="图片地址">
            <el-input 
              v-model="image.url" 
              placeholder="请输入图片地址"
              clearable>
              <template #prefix>
                <el-icon><Link /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item label="图片描述">
            <el-input 
              v-model="image.alt" 
              placeholder="请输入图片描述"
              clearable>
              <template #prefix>
                <el-icon><Document /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <!-- 添加图片按钮 -->
        <el-button 
          type="primary" 
          class="add-image-btn" 
          @click="addImage">
          <el-icon><Plus /></el-icon>
          添加图片
        </el-button>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  Delete, Picture, Setting, Link, 
  Document, Plus, ArrowUp, ArrowDown 
} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 轮播设置
const autoplayValue = ref(true)
const intervalValue = ref(3000)

// 初始化值
onMounted(() => {
  autoplayValue.value = props.modelValue.autoplay > 0
  intervalValue.value = props.modelValue.autoplay || 3000
})

const updateAutoplay = (value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    autoplay: value ? intervalValue.value : 0
  })
}

const updateInterval = (value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    autoplay: value
  })
}

// 图片操作
const addImage = () => {
  const newImages = [...props.modelValue.images, {
    url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    alt: `图片${props.modelValue.images.length + 1}`
  }]
  emit('update:modelValue', { ...props.modelValue, images: newImages })
}

const removeImage = (index) => {
  const newImages = [...props.modelValue.images]
  newImages.splice(index, 1)
  emit('update:modelValue', { ...props.modelValue, images: newImages })
}

const moveImage = (index, direction) => {
  const newImages = [...props.modelValue.images]
  if (direction === 'up' && index > 0) {
    [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]]
  } else if (direction === 'down' && index < newImages.length - 1) {
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
  }
  emit('update:modelValue', { ...props.modelValue, images: newImages })
}

const handleImageClick = (index) => {
  // 处理图片点击预览
}
</script>

<style lang="less" scoped>
.config-section {
  margin-bottom: 24px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  .section-header {
    padding: 12px 16px;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    gap: 8px;

    .el-icon {
      font-size: 16px;
      color: #409eff;
    }

    span {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }
  }

  .section-content {
    padding: 16px;
  }
}

.image-config-item {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #f8f9fb;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .image-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .image-title {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-icon {
        font-size: 16px;
        color: #409eff;
      }

      span {
        font-weight: 500;
        color: #303133;
      }
    }

    .image-actions {
      display: flex;
      gap: 4px;
    }
  }

  .image-preview {
    margin-bottom: 16px;
    border-radius: 4px;
    overflow: hidden;
    height: 160px;
    cursor: pointer;
    border: 1px solid #e4e7ed;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
    }

    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }

    .image-error {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      color: #909399;
      gap: 8px;

      .el-icon {
        font-size: 24px;
      }
    }
  }
}

.add-image-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  margin-top: 8px;
}

:deep(.el-form-item) {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .el-form-item__label {
    padding-bottom: 4px;
    font-weight: normal;
    color: #606266;
  }
}
</style>