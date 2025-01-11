<template>
    <el-form
      label-position="top"
      label-width="auto"
      :model="modelValue"
      style="max-width: 600px"
    >
    <el-upload
          v-model:file-list="fileList"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
    </el-form>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue'
  import { 
    Delete, Picture, Setting, Link, Document, 
    Plus, Rank
  } from '@element-plus/icons-vue'
  
  
  const fileList = [
    {
      name: 'food.jpeg',
      url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    },
    {
      name: 'plant-1.png',
      url: '/images/plant-1.png',
    },
    {
      name: 'food.jpeg',
      url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    },
    {
      name: 'plant-2.png',
      url: '/images/plant-2.png',
    },
    {
      name: 'food.jpeg',
      url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    },
    {
      name: 'figure-1.png',
      url: '/images/figure-1.png',
    },
    {
      name: 'food.jpeg',
      url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    },
    {
      name: 'figure-2.png',
      url: '/images/figure-2.png',
    },
  ];
  
  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)
  
  const handleRemove = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles);
  };
  
  const handlePictureCardPreview = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url;
    dialogVisible.value = true;
  };
  
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({
        icons: []
      })
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  // 轮播设置
  const autoplayValue = ref(true)
  const intervalValue = ref(3000)
  let dragIndex = -1
  
  // 初始化值
  onMounted(() => {
    autoplayValue.value = props.modelValue?.autoplay > 0
    intervalValue.value = props.modelValue?.autoplay || 3000
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
    const images = props.modelValue?.images || []
    const newImages = [...images, {
      url: '',
      alt: `图片${images.length + 1}`
    }]
    emit('update:modelValue', { ...props.modelValue, images: newImages })
  }
  
  const removeImage = (index) => {
    const newImages = [...(props.modelValue?.images || [])]
    newImages.splice(index, 1)
    emit('update:modelValue', { ...props.modelValue, images: newImages })
  }
  
  // 拖拽排序
  const handleDragStart = (e, index) => {
    dragIndex = index
    e.target.classList.add('dragging')
  }
  
  const handleDrop = (e, index) => {
    e.preventDefault()
    const newImages = [...(props.modelValue?.images || [])]
    const draggedItem = newImages[dragIndex]
    
    // 删除拖拽项
    newImages.splice(dragIndex, 1)
    // 插入到新位置
    newImages.splice(index, 0, draggedItem)
    
    emit('update:modelValue', { ...props.modelValue, images: newImages })
    e.target.classList.remove('dragging')
    dragIndex = -1
  }
  
  const handleImageClick = (index) => {
    // 处理图片点击预览
  }
  </script>
  
  <style lang="less">
  .el-upload-list--picture-card {
    --el-upload-list-picture-card-size: 135px;
  }
  .el-upload__input {
    display: none !important;
  }
  </style>