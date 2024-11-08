<script lang="ts" setup>
  const props = defineProps<{
    className?: string;
  }>();

  const computedClass = computed(() => {
    return [
      'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      props.className,
    ].filter(Boolean)
      .join(' ');
  });
</script>

<template>
  <h1
    :class="computedClass"
    v-bind="$attrs">
    <slot />
  </h1>
</template>