<script setup lang="ts">
  import { useForwardPropsEmits } from 'reka-ui';
  import { DialogContent, DialogRoot } from '@/components/ui/dialog';
  import Command from './Command.vue';
  import type { DialogRootEmits, DialogRootProps } from 'reka-ui';

  const props = defineProps<DialogRootProps>();
  const emits = defineEmits<DialogRootEmits>();

  const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <dialog-root v-bind="forwarded">
    <dialog-content class="overflow-hidden p-0 shadow-lg">
      <command class="**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 **:[[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
        <slot />
      </command>
    </dialog-content>
  </dialog-root>
</template>
