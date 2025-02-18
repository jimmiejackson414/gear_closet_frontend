<script lang='ts' setup>
  import GcSpinner from '@/components/common/GcSpinner.vue';
  import GcLogoIcon from './GcLogoIcon.vue';

  interface Props {
    iconClass?: string;
  }

  withDefaults(defineProps<Props>(), {
    iconClass: 'w-4 h-4',
  });
</script>

<template>
  <div class="flex flex-col items-center">
    <gc-logo-icon :wrapper-class="iconClass" />
    <gc-spinner variant="primary" />
  </div>
</template>
