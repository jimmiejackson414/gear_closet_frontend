<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { AlertDialogAction, type AlertDialogActionProps } from 'reka-ui';
  import { type HTMLAttributes, computed } from 'vue';
  import { buttonVariants } from '@/components/ui/button';
  import { cn } from '@/lib/utils';

  const props = defineProps<AlertDialogActionProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <alert-dialog-action
    v-bind="delegatedProps"
    :class="cn(buttonVariants(), props.class)">
    <slot />
  </alert-dialog-action>
</template>
