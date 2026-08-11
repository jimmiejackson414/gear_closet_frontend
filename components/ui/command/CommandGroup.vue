<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { ComboboxGroup, ComboboxLabel } from 'reka-ui';
  import type { ComboboxGroupProps } from 'reka-ui';
  import { type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<ComboboxGroupProps & {
    class?: HTMLAttributes['class']
    heading?: string
  }>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <combobox-group
    v-bind="delegatedProps"
    :class="cn('overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground', props.class)">
    <combobox-label
      v-if="heading"
      class="font-medium px-2 py-1.5 text-muted-foreground text-xs">
      {{ heading }}
    </combobox-label>
    <slot />
  </combobox-group>
</template>
