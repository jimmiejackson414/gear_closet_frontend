<script lang="ts" setup>
  const props = defineProps<{
    className?: string;
  }>();

  const computedClass = computed(() => {
    return [
      'text-xl text-muted-foreground',
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