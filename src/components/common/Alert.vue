<template>
  <div :class="`alert full-width text-center ${severity}`">
    <p
      class="text-body2 q-mb-none"
      v-html="message" />
  </div>
</template>

<script lang='ts' setup>
  import { PropType } from 'vue';

  type Severity = 'error' | 'warning' | 'success' | 'info';

  defineProps({
    severity: { type: String as PropType<Severity>, required: false, default: 'error' },
    message: { type: String, required: true, default: '' },
  });
</script>

<style lang='scss' scoped>
  .alert {
    border-radius: $generic-border-radius;
    padding: 0.5rem 1rem;

    &.error {
      background: $red-1;
      color: $red-14;
    }

    &.warning {
      background-color: $yellow-3;
      color: $brown-6;
    }

    &.success {
      background-color: $green-2;
      color: $green-10;
    }

    &.info {
      background-color: $blue-2;
      color: $blue-10;
    }
  }
</style>
