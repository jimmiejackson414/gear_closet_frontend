<script setup lang="ts">
  import { AvatarImage, type AvatarImageProps } from 'reka-ui';

  const props = defineProps<AvatarImageProps>();
</script>

<template>
  <avatar-image
    v-bind="props"
    class="h-full object-cover w-full" />
</template>
