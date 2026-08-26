<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { TabsContent, type TabsContentProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<TabsContentProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <tabs-content
    :class="cn('mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=inactive]:hidden', props.class)"
    v-bind="delegatedProps">
    <slot />
  </tabs-content>
</template>
