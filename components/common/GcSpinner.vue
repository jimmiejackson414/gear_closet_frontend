<script lang='ts' setup>
  interface Props {
    variant?: 'primary' | 'default';
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
  });

  const fillClass = computed(() => {
    if (props.variant === 'primary') return 'text-primary';
    else return 'text-white';
  });
</script>

<template>
  <div
    aria-label="loading"
    class="animate-spin border-[3px] border-current border-t-transparent h-8 inline-block rounded-full w-8"
    :class="fillClass"
    role="status">
    <span class="sr-only">Loading...</span>
  </div>
</template>
