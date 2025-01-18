<template>
  <div class="component-tag">
    <span>{{ item.label }}</span>
    <el-icon class="delete-icon" @click.stop="removeItem(index)">
      <Delete />
    </el-icon>
    <div class="tag-arrow"></div>
  </div>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['remove']);

const removeItem = (index) => {
  emit('remove', index);
};
</script>

<style scoped>
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
</style>