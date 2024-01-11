<template>
  <a-config-provider :locale="locale">
    <Demos />
  </a-config-provider>
</template>

<script lang="tsx" setup>
import { ref } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import Demos from './demos/index.vue';

dayjs.locale('zh-cn');
const locale = ref(zhCN);
</script>

<style scoped lang="less"></style>
