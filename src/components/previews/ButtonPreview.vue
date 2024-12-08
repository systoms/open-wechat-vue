<template>
  <div class="button-preview" :style="containerStyle">
    <button :class="['btn', config.type]" :style="buttonStyle">
      {{ config.text }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonPreview',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    containerStyle() {
      return {
        padding: `${this.config.padding || 10}px`,
        textAlign: this.config.align || 'center'
      }
    },
    buttonStyle() {
      return {
        width: this.config.width || 'auto',
        fontSize: `${this.config.fontSize || 14}px`
      }
    }
  }
}
</script>

<style scoped>
.button-preview {
  width: 100%;
}
.btn {
  padding: 8px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
.primary {
  background: #007aff;
  color: #fff;
}
.default {
  background: #fff;
  border: 1px solid #ddd;
  color: #333;
}
.danger {
  background: #ff3b30;
  color: #fff;
}
</style> 