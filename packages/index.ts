import type { App } from 'vue';
import Button from './Button/index.vue';
import VNode from './Vnode';

const components = {
  Button,
  VNode
};
// 定义 install 函数类型
declare type PluginInstallFunction = (app: App, ...options: any[]) => any;

const install: PluginInstallFunction = (app: App) => {
  // 循环导入组件
  Object.entries(components).forEach(([key, component]) => {
    if (component.name) {
      app.component(component.name, component);
    }
  });
};

export { Button, VNode };
// 导出
export default {
  install
};
