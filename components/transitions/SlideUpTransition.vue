<script lang='ts' setup>
</script>

<template>
  <transition
    enter-active-class="transition ease-out duration-75"
    enter-from-class="opacity-0 translate-y-2.5"
    leave-active-class="transition ease-out duration-75"
    leave-to-class="opacity-0 -translate-y-2.5"
    mode="out-in"
    name="slide-up">
    <slot />
  </transition>
</template>

