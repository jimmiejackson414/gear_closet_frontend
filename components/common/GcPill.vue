<script lang='ts' setup>
  interface Props {
    copy: string;
    variant?: 'primary' | 'positive' | 'secondary' | 'warning';
    size?: 'sm' | 'md' | 'lg';
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
  });

  const computedClasses = computed(() => {
    const classes = [];

    // determine size classes
    if (props.size === 'sm') { classes.push('px-2 py-1 text-xs'); }
    else if (props.size === 'lg') { classes.push('px-6 py-3 text-base'); }
    else { classes.push('px-4 py-2 text-sm'); }


    // determine color classes
    if (props.variant === 'warning') { classes.push('bg-warning-light text-warning-dark'); }
    else if (props.variant === 'primary') { classes.push('bg-primary-light/60 text-primary-dark'); }
    else if (props.variant === 'positive') { classes.push('bg-positive-light text-positive-dark'); }
    else if (props.variant === 'secondary') { classes.push('bg-gray-200 text-dark-grey'); }

    return classes;
  });
</script>

<template>
  <span
    class="!font-bold me-2 rounded-lg"
    :class="computedClasses">
    {{ copy }}
  </span>
</template>
