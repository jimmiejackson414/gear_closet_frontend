<script lang="ts" setup>
  const props = defineProps<{
    className?: string;
  }>();

  const computedClass = computed(() => {
    return [
      'text-lg font-semibold',
      props.className,
    ].filter(Boolean)
      .join(' ');
  });
</script>

<template>
  <div
    :class="computedClass"
    v-bind="$attrs">
    <slot />
  </div>
</template>