<script lang='ts' setup>
  import { cn } from '@/lib/utils';
  import { AVATAR_DISPLAY_PX, buildImageSrc, type AvatarSize } from '@/utils/avatar';

  interface Props {
    border?: boolean;
    class?: string;
    size?: AvatarSize;
    url?: string | null;
    initials?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    border: false,
    class: '',
    initials: undefined,
    size: 'md',
    url: undefined,
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

  const displayPx = computed(() => AVATAR_DISPLAY_PX[props.size]);
  const transformedSrc = computed(() => buildImageSrc(props.url, props.size));
  const originalSrc = computed(() => buildImageSrc(props.url, props.size, { transform: false }));
  const useOriginal = ref(false);

  watch(() => props.url, () => {
    useOriginal.value = false;
  });

  const imgSrc = computed(() =>
    useOriginal.value ? originalSrc.value : transformedSrc.value);

  const handleImgError = () => {
    if (!useOriginal.value && originalSrc.value) {
      useOriginal.value = true;
    }
  };
</script>

<template>
  <img
    v-if="imgSrc"
    alt="User Avatar"
    class="object-cover rounded-full"
    :class="cn(sizeClass, { 'border-2 border-white': props.border }, props.class)"
    :height="displayPx"
    :src="imgSrc"
    :width="displayPx"
    @error="handleImgError">
  <div
    v-else
    :class="cn('bg-gray-200 shrink-0 justify-center items-center inline-flex overflow-hidden relative rounded-full', sizeClass, { 'border-2 border-white': props.border }, props.class)">
    <span class="font-medium text-gray-600">
      {{ initials }}
    </span>
  </div>
</template>
