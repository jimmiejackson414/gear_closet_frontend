<script lang='ts' setup>
  import { cn } from '@/lib/utils';

  interface Props {
    border?: boolean;
    class?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    url?: string;
    initials?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    border: false,
    class: '',
    url: undefined,
    initials: undefined,
    size: 'md',
  });

  const sizeClass = computed(() => {
    switch (props.size) {
    case 'xs':
      return 'h-6 w-6 min-w-6 min-h-6';
    case 'sm':
      return 'h-8 w-8 min-w-8 min-h-8';
    case 'md':
      return 'h-12 w-12 min-w-12 min-h-12';
    case 'lg':
      return 'h-16 w-16 min-w-16 min-h-16';
    case 'xl':
      return 'h-20 w-20 min-w-20 min-h-20';
    default:
      return 'h-12 w-12 min-w-12 min-h-12';
    }
  });
</script>

<template>
  <img
    v-if="url"
    alt="User Avatar"
    class="object-cover rounded-full"
    :class="cn(sizeClass, { 'border-2 border-white': props.border }, props.class)"
    :src="url">
  <div
    v-else
    :class="cn('bg-gray-200 flex-shrink-0 justify-center items-center inline-flex overflow-hidden relative rounded-full', sizeClass, { 'border-2 border-white': props.border }, props.class)">
    <span class="font-medium text-gray-600">
      {{ initials }}
    </span>
  </div>
</template>
