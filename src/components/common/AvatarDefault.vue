<template>
  <q-avatar
    :size="props.size"
    color="primary">
    <img
      v-if="avatarSrc"
      :src="avatarSrc"
      alt="Avatar">
    <span
      v-else
      class="text-white">{{ initials(props.user) }}</span>
  </q-avatar>
</template>

<script lang='ts' setup>
  import { computed } from 'vue';
  import type { User } from '@/generated/types';
  import { initials, buildImageSrc } from '@/helpers/functions';

  type Props = {
    size: string;
    user?: User;
  }

  const props = withDefaults(defineProps(), {
    size: 'md',
    user: undefined,
  }) satisfies Props;

  const avatarSrc = computed(() => {
    if (props.user) {
      return buildImageSrc(props.user.image);
    }
    return '';
  });
</script>
