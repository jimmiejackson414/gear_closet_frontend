<script lang='ts' setup>
</script>

<template>
  <transition
    enter-active-class="transition ease duration-100"
    enter-from-class="transform opacity-0"
    enter-to-class="transform opacity-100"
    leave-active-class="transition ease-in duration-75"
    leave-from-class="transform opacity-100"
    leave-to-class="transform opacity-0"
    mode="out-in">
    <slot /> 
  </transition>
</template>
