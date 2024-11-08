<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { X } from 'lucide-vue-next';
  import { TagsInputItemDelete, type TagsInputItemDeleteProps, useForwardProps } from 'radix-vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<TagsInputItemDeleteProps & { class?: HTMLAttributes['class'] }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <tags-input-item-delete
    v-bind="forwardedProps"
    :class="cn('flex rounded bg-transparent mr-1', props.class)">
    <slot>
      <x class="h-4 w-4" />
    </slot>
  </tags-input-item-delete>
</template>
