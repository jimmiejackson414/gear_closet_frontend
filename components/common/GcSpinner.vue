<script lang='ts' setup>
  interface Props {
    size?: 'lg' | 'md' | 'sm';
    variant?: 'default' | 'primary';
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    variant: 'default',
  });

  const fillClass = computed(() => {
    if (props.variant === 'primary') return 'text-primary';
    else return 'text-white';
  });

  const sizeClass = computed(() => {
    if (props.size === 'sm') return 'h-4 w-4 border-[2px]';
    else if (props.size === 'md') return 'h-8 w-8 border-[3px]';
    else return 'h-12 w-12 border-[4px]';
  });
</script>

<template>
  <div
    aria-label="loading"
    class="inline-block animate-spin rounded-full border-current border-t-transparent"
    :class="[ fillClass, sizeClass ]"
    role="status">
    <span class="sr-only">Loading...</span>
  </div>
</template>
