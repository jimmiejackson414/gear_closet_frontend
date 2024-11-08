<script lang="ts" setup>
  const props = defineProps<{
    className?: string;
  }>();

  const computedClass = computed(() => {
    return [
      'scroll-m-20 text-xl font-semibold tracking-tight',
      props.className,
    ].filter(Boolean)
      .join(' ');
  });
</script>

<template>
  <h4
    :class="computedClass"
    v-bind="$attrs">
    <slot />
  </h4>
</template>