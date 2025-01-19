<template>
  <el-form
      label-position="top"
      label-width="auto"
      style="max-width: 600px"
  >
    <el-upload
        v-model:file-list="modelValue.icons"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
    >
      <el-icon>
        <Plus/>
      </el-icon>
    </el-upload>
  </el-form>
</template>

<script setup>
import {ref, watch} from 'vue'
import {Plus} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      icons: []
    })
  },
})

// console.log('props',props)

const emit = defineEmits(['update:icons'])

// 创建本地的图标列表
// const icons = ref(props.modelValue.icons)
// console.log(icons)

// 只监听外部数据变化，不触发 emit
watch(() => props.modelValue?.icons, (newVal) => {
  // console.log(newVal);
  // if (Array.isArray(newVal) && JSON.stringify(newVal) !== JSON.stringify(iconList.value)) {
  //   iconList.value = [...newVal]
  // }
}, { immediate: true })

const handleRemove = (uploadFile, uploadFiles) => {
  // iconList.value = uploadFiles
  // emit('update:modelValue', {
  //   ...props.modelValue,
  //   icons: uploadFiles
  // })
}

const handleSuccess = (response, uploadFile, uploadFiles) => {
  // iconList.value = uploadFiles
  // emit('update:modelValue', {
  //   ...props.modelValue,
  //   icons: uploadFiles
  // })
}

const handlePictureCardPreview = (uploadFile) => {
  // 处理预览逻辑
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
