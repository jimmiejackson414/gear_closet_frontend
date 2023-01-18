<template>
  <transition
    name="fade"
    mode="out-in"
    appear
    :duration="300">
    <slot />
  </transition>
</template>

<script lang='ts' setup>
</script>

<style lang='scss' scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
