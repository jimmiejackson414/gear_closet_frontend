<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { ComboboxCancel } from 'radix-vue'; // Radix Vue ComboboxCancel base component
  import { cn } from '@/lib/utils'; // Utility function for merging classes

  // Define props to inherit the structure and flexibility of similar components
  const props = defineProps<{
    class?: HTMLAttributes['class'];
  }>();

  // Use a computed prop to handle any additional props or overrides
  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
  });
</script>

<template>
  <combobox-cancel
    v-bind="delegatedProps"
    :class="cn(
      'flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-50',
      props.class
    )">
    <icon-x class="size-4" />
  </combobox-cancel>
</template>