<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { DialogTitle, useForwardProps, type DialogTitleProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <dialog-title
    v-bind="forwardedProps"
    :class="
      cn(
        'text-lg font-semibold leading-none tracking-tight',
        props.class,
      )
    ">
    <slot />
  </dialog-title>
</template>
