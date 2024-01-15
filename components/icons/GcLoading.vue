<script lang='ts' setup>
  import GcLogoIcon from './GcLogoIcon.vue';
  import GcSpinner from '@/components/common/GcSpinner.vue';

  interface Props {
    iconClass?: string;
  }

  withDefaults(defineProps<Props>(), {
    iconClass: 'w-4 h-4',
  });
</script>

<template>
  <div class="flex items-center flex-col">
    <gc-logo-icon :wrapper-class="iconClass" />
    <gc-spinner variant="primary" />
  </div>
</template>
