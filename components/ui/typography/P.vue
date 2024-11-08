<script lang="ts" setup>
  const props = defineProps<{
    className?: string;
  }>();

  const computedClass = computed(() => {
    return [
      'leading-7 [&:not(:first-child)]:mt-6',
      props.className,
    ].filter(Boolean)
      .join(' ');
  });
</script>

<template>
  <p
    :class="computedClass"
    v-bind="$attrs">
    <slot />
  </p>
</template>