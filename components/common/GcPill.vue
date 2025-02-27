<script lang='ts' setup>
  interface Props {
    copy: string;
    size?: 'lg' | 'md' | 'sm';
    variant?: 'danger' | 'positive' | 'primary' | 'secondary' | 'warning';
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    variant: 'primary',
  });

  const computedClasses = computed(() => {
    const classes = [];

    // determine size classes
    if (props.size === 'sm') { classes.push('px-2 py-1 text-xs'); }
    else if (props.size === 'lg') { classes.push('px-6 py-3 text-base'); }
    else { classes.push('px-4 py-2 text-sm'); }


    // determine color classes
    if (props.variant === 'warning') { classes.push('bg-tertiary text-tertiary-foreground'); }
    else if (props.variant === 'primary') { classes.push('bg-primary text-primary-foreground'); }
    else if (props.variant === 'positive') { classes.push('bg-accent-alt text-accent-light'); }
    else if (props.variant === 'secondary') { classes.push('bg-gray-300 text-dark-grey'); }
    else if (props.variant === 'danger') { classes.push('bg-destructive text-destructive-foreground'); }

    return classes;
  });
</script>

<template>
  <span
    class="me-2 rounded-lg !font-semibold"
    :class="computedClasses">
    {{ copy }}
  </span>
</template>
