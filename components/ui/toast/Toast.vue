<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed } from 'vue';
  import { ToastRoot, type ToastRootEmits, useForwardPropsEmits } from 'radix-vue';
  import { cn } from '@/lib/utils';
  import { type ToastProps, toastVariants } from '.';

  const props = defineProps<ToastProps>();

  const emits = defineEmits<ToastRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <toast-root
    v-bind="forwarded"
    :class="cn(toastVariants({ variant }), props.class)"
    @update:open="onOpenChange">
    <slot />
  </toast-root>
</template>
