<script lang='ts' setup>
  import GcLogoIcon from './GcLogoIcon.vue';
  import GcSpinner from '@/components/common/GcSpinner.vue';

  const props = defineProps({
    width: { type: Number, required: false, default: 150 },
  });

</script>

<template>
  <div class="loading-styles">
    <gc-logo-icon :width="props.width" />
    <gc-spinner variant="primary" />
  </div>
</template>

<style lang='scss' scoped>
  .loading-styles {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
