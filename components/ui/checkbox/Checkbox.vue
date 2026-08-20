<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { type HTMLAttributes } from 'vue';
  import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'reka-ui';
  import { cn } from '@/lib/utils';
  import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui';

  const props = defineProps<CheckboxRootProps & {
    class?: HTMLAttributes['class'],
    variant?: 'primary' | 'destructive' | 'accent',
  }>();
  const emits = defineEmits<CheckboxRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);

  const variantClasses = computed(() => {
    switch (props.variant) {
    case 'destructive':
      return 'border-destructive ring-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-white focus-visible:ring-destructive';
    case 'accent':
      return 'border-blue-500 ring-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white focus-visible:ring-blue-500';
    default: // 'primary'
      return 'border-primary ring-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary';
    }
  });
</script>

<template>
  <checkbox-root
    v-bind="forwarded"
    :class="cn(
      'peer h-4 w-4 shrink-0 rounded-sm border ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-current',
      variantClasses,
      props.class
    )">
    <checkbox-indicator class="flex justify-center items-center h-full text-current w-full">
      <slot>
        <icon-check class="h-4 w-4" />
      </slot>
    </checkbox-indicator>
  </checkbox-root>
</template>
