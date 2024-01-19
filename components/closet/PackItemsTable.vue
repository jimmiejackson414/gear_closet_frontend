<script lang='ts' setup>
  import type { ExtendedCategory } from '@/types/helpers';
  
  interface Props {
    category: ExtendedCategory;
  }

  const props = defineProps<Props>();
</script>

<template>
  <div>
    Pack Items Table
  </div>
</template>
