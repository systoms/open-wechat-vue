<template>
  <div class="placementarea">
    <div class="drop-text">组件放置区域</div>
    <div class="drop-desc">松开鼠标，完成组件插入</div>
  </div>
</template>

<style scoped>
.placementarea {
  height: 60px;
  border: 1px dashed #409eff;
  background-color: rgba(64, 158, 255, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: all 0.3s;

  .drop-icon {
    color: #409eff;
    margin-bottom: 8px;

    .el-icon {
      font-size: 24px;
      animation: bounce 1s infinite;
    }
  }

  .drop-text {
    font-size: 14px;
    color: #409eff;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .drop-desc {
    font-size: 12px;
    color: #909399;
    opacity: 0.8;
  }
}
</style>