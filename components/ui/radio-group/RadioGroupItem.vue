<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import {
    RadioGroupIndicator,
    RadioGroupItem,
    type RadioGroupItemProps,
    useForwardProps,
  } from 'reka-ui';
  import { type HTMLAttributes } from 'vue';
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
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    ">
    <radio-group-indicator class="flex justify-center items-center">
      <icon-circle class="fill-current h-2.5 text-current w-2.5" />
    </radio-group-indicator>
  </radio-group-item>
</template>
