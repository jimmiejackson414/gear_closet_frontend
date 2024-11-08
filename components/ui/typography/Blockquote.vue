<script lang="ts" setup>
  const props = defineProps<{
    className?: string;
  }>();

  const computedClass = computed(() => {
    return [
      'mt-6 border-l-2 pl-6 italic',
      props.className,
    ].filter(Boolean)
      .join(' ');
  });
</script>

<template>
  <blockquote
    :class="computedClass"
    v-bind="$attrs">
    <slot />
  </blockquote>
</template>