<script lang="ts" setup>
  const props = defineProps<{
    className?: string;
  }>();

  const computedClass = computed(() => {
    return [
      'text-sm font-medium leading-none',
      props.className,
    ].filter(Boolean)
      .join(' ');
  });
</script>

<template>
  <small
    :class="computedClass"
    v-bind="$attrs">
    <slot />
  </small>
</template>