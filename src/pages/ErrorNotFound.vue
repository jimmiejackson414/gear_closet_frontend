<template>
  <PublicLayout align-logo="center">
    <div class="wrapper">
      <h1 class="text-h1 text-weight-bold q-mb-sm">
        Not Found!
      </h1>
      <p class="text-body1 text-weight-bold q-mb-none">
        You dun goofed! Or we goofed. Or both?
      </p>
      <p class="text-body1">
        The page you were looking for doesn't exist. Please make sure you've typed the URL correctly.
      </p>
    </div>
  </PublicLayout>
</template>

<script lang='ts' setup>
  import PublicLayout from '@/layouts/PublicLayout.vue';
</script>

<style lang='scss' scoped>
  .wrapper {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }
</style>
