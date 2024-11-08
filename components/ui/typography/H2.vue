<script lang="ts" setup>
  const props = defineProps<{
    className?: string;
  }>();

  const computedClass = computed(() => {
    return [
      'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
      props.className,
    ].filter(Boolean)
      .join(' ');
  });
</script>

<template>
  <h2
    :class="computedClass"
    v-bind="$attrs">
    <slot />
  </h2>
</template>