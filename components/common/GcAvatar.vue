<script lang='ts' setup>
  import { initials } from '@/helpers/functions';
  import type { Profile } from '@/types';  

  interface Props {
    profile?: Profile;
    border?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }

  const props = withDefaults(defineProps<Props>(), {
    border: false,
    profile: undefined,
    size: 'md',
  });

  const hasImage = computed(() => {
    return props.profile && props.profile.image !== null;
  });

  const sizeClass = computed(() => {
    switch (props.size) {
    case 'sm':
      return 'h-8 w-8';
    case 'md':
      return 'h-12 w-12';
    case 'lg':
      return 'h-16 w-16';
    case 'xl':
      return 'h-20 w-20';
    default:
      return 'h-12 w-12';
    }
  });
</script>

<template>
  <img
    v-if="hasImage"
    alt="User Avatar"
    class="rounded-full"
    :class="[ sizeClass, { 'border-2 border-white': props.border } ]"
    src="https://placehold.co/100x100">
  <span
    v-else
    class="bg-gray-200 inline-flex justify-center items-center overflow-hidden relative rounded-full"
    :class="[ sizeClass, { 'border-2 border-white': props.border } ]">
    <span class="font-medium text-gray-600">
      {{ initials(profile) }}
    </span>
  </span>
</template>
