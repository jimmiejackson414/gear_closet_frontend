<template>
  <div class="flex">
    <span
      v-for="color in props.colors"
      :key="color"
      :style="{ backgroundColor: color }"
      class="color-box" />
  </div>
</template>

<script lang='ts' setup>
  const props = defineProps<{
    colors: Array<string>,
  }>();

</script>

<style lang='scss' scoped>
  .color-box {
    border: 1px solid white;
    border-radius: 3px;
    height: 1rem;
    width: 1rem;
  }
</style>
