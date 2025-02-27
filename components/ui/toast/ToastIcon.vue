<script lang="ts" setup>
  import { IconBadgeAlert } from '#components';

  const props = defineProps<{
    icon?: typeof IconBadgeAlert | null;
  }>();

  const iconToRender = computed(() => props.icon || IconBadgeAlert);
</script>

<template>
  <div class="mr-2">
    <component :is="iconToRender" />
  </div>
</template>
