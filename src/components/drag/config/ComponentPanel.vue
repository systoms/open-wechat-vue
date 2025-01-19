<template>
  <div class="components-panel">
    <div class="panel-header">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item v-for="(componentGroup,componentGroupIndex) in componentList" v-bind:key="componentGroupIndex"
                          :title="componentGroup.label" :name="componentGroup.name">
          <div class="components-grid">
            <div class="component-item"
                 v-for="component in componentGroup.components"
                 :key="component.type"
                 draggable="true"
                 @dragstart="handleDragStart($event, component)">
              <div class="item-icon">
                <el-icon>
                  <component :is="component.icon"/>
                </el-icon>
              </div>
              <div class="item-label">{{ component.label }}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import {ref, markRaw, shallowRef} from 'vue'

const emit = defineEmits(['dragstart'])
const activeCollapse = ref(['basic'])
const componentList = shallowRef([])
const components = shallowRef([])

// 处理拖拽开始
const handleDragStart = (e, component) => {
  e.dataTransfer.setData('componentType', component.type)
  e.dataTransfer.effectAllowed = 'move'
  const defaultProps = component.getDefaultProps
  emit('dragstart', e, {...component, defaultProps})
}

// const componentList = [
// {
//   label: '基础组件',
//   name: 'basic',
//   components: [
//     {
//       type: 'vant-swipe',
//       label: '轮播图',
//       description: '用于循环播放图片、视频等内容',
//       icon: Picture,
//       component: SwipeComponent,
//       configComponent: SwipeConfig,
//       getDefaultProps: createDefaultSwipeProps
//     },
//     {
//       type: 'vant-icon',
//       label: 'icon',
//       description: '用于展示业务快捷入口',
//       icon: Picture,
//       component: IconComponent,
//       configComponent: IconConfig,
//       getDefaultProps: createDefaultIconProps
//     }
//   ]
// },
// {
//   label: '业务组件',
//   name: 'business',
//   components: [],
// }
// ]

const fileBasicPath = '../components/';
const componentGroupFiles = import.meta.glob('../components/*/config.json', {eager: true});
const componentGroupNames = Object.keys(componentGroupFiles);

const componentFiles = import.meta.glob('../components/*/*.vue', {eager: true});
const componentNames = Object.keys(componentFiles);

const componentConfigFiles = import.meta.glob('../components/*/config/*.vue', {eager: true});
const componentConfigNames = Object.keys(componentConfigFiles);

componentGroupNames.forEach((filePath) => {
  const componentConfig = componentGroupFiles[filePath];
  const folderName = filePath.split('/').slice(-2, -1)[0];
  const componentName = componentConfig.default?.name || componentConfig.name;

  const componentGroupData = {
    label: componentName,
    name: folderName,
    components: [],
  };

  for (const componentFilePath of componentNames) {
    const folderName2 = componentFilePath.split('/').slice(-2, -1)[0];
    if (folderName === folderName2) {
      const componentName = componentFilePath.split('/').pop().replace('.vue', '');
      const configPath = `${fileBasicPath}${folderName}/config/${componentName}.vue`;
      const newPath = componentConfigNames.find(c => c === configPath);

      const module = componentFiles[componentFilePath];
      componentGroupData.components.push(markRaw({
        type: module.default.props.type.default(),
        label: module.default.props.label.default(),
        description: module.default.props.description.default(),
        icon: module.default.props.icon.default(),
        component: markRaw(module.default),
        configComponent: markRaw(componentConfigFiles[newPath].default),
        getDefaultProps: module.default.props.modelValue.default()
      }));
    }
  }

  componentList.value.push(markRaw(componentGroupData));
});

components.value = componentList.value.reduce((acc, category) => {
  return acc.concat(category.components);
}, []);

// console.log(components.value)

// 暴露组件数据和方法
defineExpose({
  components: shallowRef(components.value)
})
</script>

<style lang="less" scoped>
.components-panel {
  width: 280px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #dcdfe6;
  overflow-y: auto;

  .panel-header {
    padding: 0;
  }

  :deep(.el-collapse) {
    border: none;

    .el-collapse-item__header {
      padding-left: 16px;
      padding-right: 10px;
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      background-color: #f5f7fa;
      border-bottom: 1px solid #dcdfe6;
    }

    .el-collapse-item__content {
      padding: 0;
    }
  }

  .components-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 8px;
    background-color: #fff;
  }

  .component-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80px;
    cursor: move;
    transition: all 0.3s;
    border-radius: 4px;
    padding: 8px;

    &:hover {
      background-color: #f5f7fa;
    }

    .item-icon {
      font-size: 24px;
      color: #606266;
      margin-bottom: 8px;

      .el-icon {
        width: 24px;
        height: 24px;
      }
    }

    .item-label {
      font-size: 12px;
      color: #606266;
      text-align: center;
      line-height: 1.2;
    }
  }
}
</style> 