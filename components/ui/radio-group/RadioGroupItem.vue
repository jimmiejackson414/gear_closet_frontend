<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { type HTMLAttributes } from 'vue';
  import {
    RadioGroupIndicator,
    RadioGroupItem,
    type RadioGroupItemProps,
    useForwardProps,
  } from 'radix-vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<RadioGroupItemProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <radio-group-item
    v-bind="forwardedProps"
    :class="
      cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    ">
    <radio-group-indicator class="flex items-center justify-center">
      <icon-circle class="size-2.5 fill-current text-current" />
    </radio-group-indicator>
  </radio-group-item>
</template>
