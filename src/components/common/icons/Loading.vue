<template>
  <div class="loading-styles">
    <LogoIcon :width="props.width" />
    <q-spinner
      color="primary"
      size="3em"
      class="q-my-lg" />
  </div>
</template>

<script lang='ts' setup>
  import LogoIcon from './LogoIcon.vue';

  const props = defineProps({
    width: { type: Number, required: false, default: 150 },
  });

</script>

<style lang='scss' scoped>
  .loading-styles {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
