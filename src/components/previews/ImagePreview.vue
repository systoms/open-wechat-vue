<template>
  <div class="image-preview" :style="containerStyle">
    <img :src="config.src" :style="imageStyle" :alt="config.alt">
  </div>
</template>

<script>
export default {
  name: 'ImagePreview',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      defaultImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23ddd"/></svg>'
    }
  },
  computed: {
    containerStyle() {
      return {
        padding: this.config.padding + 'px',
        textAlign: this.config.align
      }
    },
    imageStyle() {
      return {
        width: this.config.width,
        height: this.config.height,
        objectFit: this.config.mode
      }
    }
  },
  methods: {
    handleImageError(e) {
      e.target.src = this.defaultImage
    }
  }
}
</script>

<style scoped>
.image-preview {
  width: 100%;
}

.image-preview img {
  max-width: 100%;
  display: inline-block;
}
</style> 