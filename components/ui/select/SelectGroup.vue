<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { SelectGroup, type SelectGroupProps } from 'radix-vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<SelectGroupProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <select-group
    :class="cn('p-1 w-full', props.class)"
    v-bind="delegatedProps">
    <slot />
  </select-group>
</template>
