<script lang="ts" setup>
  import type { LabelProps } from 'radix-vue';
  import type { HTMLAttributes } from 'vue';
  import { useFormField } from './useFormField';
  import { Label as UiLabel } from '@/components/ui/label';
  import { cn } from '@/lib/utils';

  const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>();

  const { error, formItemId } = useFormField();
</script>

<template>
  <ui-label
    :class="cn(
      error && 'text-destructive',
      props.class,
    )"
    :for="formItemId">
    <slot />
  </ui-label>
</template>
