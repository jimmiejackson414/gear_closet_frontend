<script lang='ts' setup>
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'default';
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
    class="animate-spin border-current border-t-transparent inline-block rounded-full"
    :class="[ fillClass, sizeClass ]"
    role="status">
    <span class="sr-only">Loading...</span>
  </div>
</template>
