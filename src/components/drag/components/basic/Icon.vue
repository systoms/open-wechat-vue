<template>
  <div class="brand-icons">
    <div class="icon-grid">
      <div v-for="icon in icons"
           :key="icon.name"
           class="icon-item">
        <div class="icon-wrapper">
          <img :src="icon.url" :alt="icon.name">
        </div>
        <div class="icon-name">{{ icon.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {Picture} from "@element-plus/icons-vue";

const props = defineProps({
  icons: {
    type: Array,
    default: () => ([
      {
        name: 'kfc',
        label: '肯德基',
        url: 'https://img.yunzhanxinxi.com/static/home/icon/topdining/kfc_style1.png'
      },
      {
        name: 'mcdonalds',
        label: '麦当劳',
        url: 'https://img.yunzhanxinxi.com/static/home/icon/topdining/mcdonalds_style1.png'
      },
      {
        name: 'starbucks',
        label: '星巴克',
        url: 'https://img.yunzhanxinxi.com/static/home/icon/topdining/starbucks_style1.png'
      },
      {
        name: 'ruixing',
        label: '瑞幸',
        url: 'https://img.yunzhanxinxi.com/static/home/icon/topdining/luckinCoffee_style1.png'
      },
      {
        name: 'nayuki',
        label: '奈雪',
        url: 'https://img.yunzhanxinxi.com/static/home/icon/topdining/naixue_style1.png'
      },
      {
        name: 'heytea',
        label: '喜茶',
        url: 'https://img.yunzhanxinxi.com/static/home/icon/topdining/heytear_style1.png'
      },
      {
        name: 'movie',
        label: '电影',
        url: 'https://img.yunzhanxinxi.com/static/home/icon/topdining/movie_style1.png'
      },
      {
        name: 'share',
        label: '分享',
        url: 'https://img.yunzhanxinxi.com/static/home/icon/topdining/share_style1.png'
      }
    ])
  }
});

defineExpose({
  __config: {
    type: 'vant-icon',
    label: 'icon',
    description: '用于展示业务快捷入口',
    icon: Picture,
    getDefaultProps: {
      icons: props.icons
    }
  }
});
</script>

<style lang="less" scoped>
.brand-icons {
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    &.active {
      .icon-wrapper {
        border-color: #409eff;
      }

      .icon-name {
        color: #409eff;
      }
    }

    .icon-wrapper {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;

      img {
        width: 60px;
        height: 60px;
        object-fit: contain;
      }
    }

    .icon-name {
      font-size: 12px;
      color: #606266;
      text-align: center;
    }
  }
}
</style>