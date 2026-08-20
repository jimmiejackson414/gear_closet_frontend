<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { TabsList, type TabsListProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <tabs-list
    v-bind="delegatedProps"
    :class="cn(
      'inline-flex items-center justify-center rounded-md bg-muted dark:bg-accent-light p-1 text-foreground dark:text-accent',
      props.class,
    )">
    <slot />
  </tabs-list>
</template>
