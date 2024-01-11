<template>
  <a-button type="primary" v-bind="attrs"><slot></slot></a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },
  computed: {
    attrs() {
      return { ...this.$attrs };
    }
  }
});
</script>

<style scoped></style>
