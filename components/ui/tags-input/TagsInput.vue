<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { TagsInputRoot, useForwardPropsEmits, type TagsInputRootEmits, type TagsInputRootProps } from 'reka-ui';
  import { cn } from '@/lib/utils';

  const props = defineProps<TagsInputRootProps & { class?: HTMLAttributes['class'] }>();
  const emits = defineEmits<TagsInputRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <tags-input-root
    v-bind="forwarded"
    :class="cn('flex flex-wrap gap-2 items-center rounded-md border border-input bg-background px-3 py-2 text-sm', props.class)">
    <slot />
  </tags-input-root>
</template>
