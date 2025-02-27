<script lang="ts" setup>
  import { LabelRoot } from '@/components/ui/label';
  import { cn } from '@/lib/utils';
  import { useFormField } from './useFormField';
  import type { LabelProps } from 'radix-vue';
  import type { HTMLAttributes } from 'vue';

  const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>();

  const { error, formItemId } = useFormField();
</script>

<template>
  <label-root
    :class="cn(
      error && 'text-destructive',
      props.class,
    )"
    :for="formItemId">
    <slot />
  </label-root>
</template>
