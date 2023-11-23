<script lang='ts' setup>
  import GcLogoIcon from './GcLogoIcon.vue';
  import GcSpinner from '@/components/common/GcSpinner.vue';

  const props = defineProps({
    width: { type: Number, required: false, default: 150 },
  });

</script>

<template>
  <div class="flex items-center flex-col">
    <gc-logo-icon :width="props.width" />
    <gc-spinner variant="primary" />
  </div>
</template>
