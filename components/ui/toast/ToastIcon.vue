<script lang="ts" setup>
  import { BadgeAlertIcon, type LucideIcon } from 'lucide-vue-next';

  const props = defineProps<{
    icon?: LucideIcon | null;
  }>();

  const iconToRender = computed(() => props.icon || BadgeAlertIcon);
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