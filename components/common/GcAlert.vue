<script lang='ts' setup>
  interface Props {
    severity?: Severity;
    message?: string;
  }

  export type Severity = 'error' | 'warning' | 'positive' | 'info';

  const props = withDefaults(defineProps<Props>(), {
    severity: 'error',
    message: '',
  });

  const classList = computed(() => {
    const classes = ['rounded-md', 'py-2', 'px-4', 'w-full', 'text-center'];

    // Map legacy Quasar severity names onto current theme tokens
    if (props.severity === 'error') { classes.push('bg-destructive-light', 'text-destructive'); }
    if (props.severity === 'warning') { classes.push('bg-amber-50', 'text-amber-800'); }
    if (props.severity === 'positive') { classes.push('bg-accent-light', 'text-accent-alt'); }
    if (props.severity === 'info') { classes.push('bg-primary-light', 'text-primary'); }

    return classes;
  });
</script>

<template>
  <div :class="classList">
    <p
      class="mb-0 text-sm"
      v-html="message" />
  </div>
</template>
