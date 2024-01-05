<script lang='ts' setup>
  import { CheckSquare2Icon } from 'lucide-vue-next';
  import type { ShoppingListItem } from '~/types';

  interface Props {
    data?: ShoppingListItem[];
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: undefined,
    loading: false,
  });
</script>

<template>
  <div class="bg-grey-50 px-8 py-4 rounded-2xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <check-square-2-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Shopping Items
      </p>
    </div>
    <gc-skeleton v-if="loading" />
    <gc-empty-state v-else-if="!loading && !data?.length">
      <p class="mb-4 text-base">
        You haven't added any shopping items to this trip yet!
      </p>
      <gc-button
        label="Add a shopping item"
        outlined
        size="sm" />
    </gc-empty-state>
    <div v-else>
      Display shopping items
    </div>
  </div>
</template>
