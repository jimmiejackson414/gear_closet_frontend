<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { X } from 'lucide-vue-next';
  import {
    DialogClose,
    DialogContent,
    type DialogContentEmits,
    type DialogContentProps,
    DialogOverlay,
    DialogPortal,
    useForwardPropsEmits,
  } from 'radix-vue';
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
    <dialog-overlay class="bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 grid place-items-center overflow-y-auto z-50 ">
      <dialog-content
        :class="
          cn(
            'relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full',
            props.class,
          )
        "
        v-bind="forwarded"
        @pointer-down-outside="(event) => {
          const originalEvent = event.detail.originalEvent;
          const target = originalEvent.target as HTMLElement;
          if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
            event.preventDefault();
          }
        }">
        <slot />

        <dialog-close class="absolute top-3 right-3 p-0.5 rounded-md transition-colors hover:bg-secondary">
          <x class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </dialog-close>
      </dialog-content>
    </dialog-overlay>
  </dialog-portal>
</template>
