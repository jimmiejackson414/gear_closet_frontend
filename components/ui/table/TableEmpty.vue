<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';
  import TableCell from './TableCell.vue';
  import TableRow from './TableRow.vue';

  const props = withDefaults(defineProps<{
    class?: HTMLAttributes['class']
    colspan?: number
  }>(), {
    class: '',
    colspan: 1,
  });

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });
</script>

<template>
  <table-row>
    <table-cell
      :class="
        cn(
          'p-4 whitespace-nowrap align-middle text-sm text-foreground',
          props.class,
        )
      "
      v-bind="delegatedProps">
      <div class="flex items-center justify-center py-10">
        <slot />
      </div>
    </table-cell>
  </table-row>
</template>
