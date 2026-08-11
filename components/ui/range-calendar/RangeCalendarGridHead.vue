<script lang="ts" setup>
  import { RangeCalendarGridHead, type RangeCalendarGridHeadProps } from 'reka-ui';

  const props = defineProps<RangeCalendarGridHeadProps>();
</script>

<template>
  <range-calendar-grid-head v-bind="props">
    <slot />
  </range-calendar-grid-head>
</template>
