<script lang='ts' setup>
  interface Props {
    variant?: 'primary' | 'default';
    size?: 'sm' | 'md' | 'lg';
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'md',
  });

  const fillClass = computed(() => {
    if (props.variant === 'primary') return 'text-primary';
    else return 'text-white';
  });

  const sizeClass = computed(() => {
    if (props.size === 'sm') return 'h-4 w-4 border-2';
    else if (props.size === 'md') return 'h-8 w-8 border-[3px]';
    else return 'h-12 w-12 border-4';
  });
</script>

<template>
  <div
    aria-label="loading"
    class="animate-spin border-current border-t-transparent inline-block rounded-full"
    :class="[ fillClass, sizeClass ]"
    role="status">
    <span class="sr-only">Loading...</span>
  </div>
</template>
