<template>
  <div class="text-preview" :style="styles">
    {{ config.content }}
  </div>
</template>

<script>
export default {
  name: 'TextPreview',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    styles() {
      return{
        fontSize: this.config.fontSize + 'px',
        color: this.config.color,
        textAlign: this.config.align
      }
    }
  }
}
</script>

<style scoped>
.text-preview {
  width: 100%;
  word-break: break-all;
  min-height: 24px;
}
</style> 