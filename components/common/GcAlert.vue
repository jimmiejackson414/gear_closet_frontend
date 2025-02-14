<script lang='ts' setup>
  interface Props {
    message: string;
    severity?: Severity;
  }

  export type Severity = 'error' | 'info' | 'positive' | 'warning';

  const props = withDefaults(defineProps<Props>(), {
    message: '',
    severity: 'error',
  });

  const classList = computed(() => {
    let classes = ['rounded-2xl', 'py-2', 'px-4', 'w-full', 'text-center'];

    if (props.severity === 'error') { classes.push('bg-danger-light', 'text-danger-dark'); }
    if (props.severity === 'warning') { classes.push('bg-warning-light', 'text-warning-dark'); }
    if (props.severity === 'positive') { classes.push('bg-positive-light', 'text-positive-dark'); }
    if (props.severity === 'info') { classes.push('bg-info-light', 'text-info-dark'); }

    return classes;
  });
</script>

<template>
  <div :class="classList">
    <p
      class="q-mb-none text-body2"
      v-html="message" />
  </div>
</template>
