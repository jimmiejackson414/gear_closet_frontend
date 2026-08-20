<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { TagsInputInput, useForwardProps, type TagsInputInputProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<TagsInputInputProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <tags-input-input
    v-bind="forwardedProps"
    :class="cn('text-sm min-h-6 focus:outline-hidden flex-1 bg-transparent px-1', props.class)" />
</template>
