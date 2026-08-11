<script lang="ts" setup>
  import type { LabelProps } from 'reka-ui';
  import type { HTMLAttributes } from 'vue';
  import { useFormField } from './useFormField';
  import { LabelRoot } from '@/components/ui/label';
  import { cn } from '@/lib/utils';

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
