<template>
  <div class="loading-page-wrapper">
    <LoadingIcon />
    <slot />
  </div>
</template>

<script lang='ts' setup>
  import LoadingIcon from '@/components/common/icons/Loading.vue';
</script>

<style lang='scss' scoped>
  .loading-page-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
