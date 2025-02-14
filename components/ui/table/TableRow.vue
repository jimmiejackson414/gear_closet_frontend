<script setup lang="ts">
  import { cn } from '@/lib/utils';
  import type { HTMLAttributes } from 'vue';

  const props = defineProps<{
    class?: HTMLAttributes['class'];
    noHoverEffect?: boolean;
  }>();
</script>

<template>
  <tr :class="cn('border-b data-[state=selected]:bg-muted', noHoverEffect ? '' : 'transition-colors hover:bg-muted/50 ', props.class)">
    <slot />
  </tr>
</template>
