<template>
  <transition
    name="slide-up"
    mode="out-in">
    <slot />
  </transition>
</template>

<script lang='ts' setup>
</script>

<style lang='scss' scoped>
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 0.15s $cubic-bezier;
  }

  .slide-up-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }

  .slide-up-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
