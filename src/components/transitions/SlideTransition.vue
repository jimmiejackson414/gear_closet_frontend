<template>
  <transition
    name="slide-fade"
    mode="out-in"
    appear
    :duration="300">
    <slot />
  </transition>
</template>

<script lang='ts' setup>
</script>

<style lang='scss' scoped>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    opacity: 1;
    transform: translateX(0);
    transition: all 0.5s $cubic-bezier;
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateX(200px);
  }
</style>
