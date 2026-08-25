<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { type HTMLAttributes } from 'vue';
  import {
    DialogClose,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    useForwardPropsEmits,
    type DialogContentEmits,
    type DialogContentProps,
  } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<DialogContentProps & { class?: HTMLAttributes['class'] }>();
  const emits = defineEmits<DialogContentEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <dialog-portal>
    <dialog-overlay class="bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 " />
    <dialog-content
      v-bind="forwarded"
      :class="
        cn(
          'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:rounded-lg',
          props.class,
        )">
      <slot />

      <dialog-close
        class="absolute top-4 right-4 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground opacity-70 hover:opacity-100 ring-offset-background focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded-sm transition-opacity disabled:pointer-events-none focus:outline-hidden"
        @click="emits('escapeKeyDown', $event)">
        <icon-x class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </dialog-close>
    </dialog-content>
  </dialog-portal>
</template>
