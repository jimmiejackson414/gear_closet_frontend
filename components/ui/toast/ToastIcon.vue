<script lang="ts" setup>
  import { IconBadgeAlert } from '#components';

  const props = defineProps<{
    icon?: typeof IconBadgeAlert | null;
  }>();

  const iconToRender = computed(() => props.icon || IconBadgeAlert);
</script>

<template>
  <div class="toast-icon">
    <component :is="iconToRender" />
  </div>
</template>

<style scoped>
.toast-icon {
  margin-right: 0.5rem;
}
</style>