<script lang='ts' setup>
  import { ColumnsIcon } from 'lucide-vue-next';
  import type { TripDetail } from '~/types';
  
  interface Props {
    data?: TripDetail[];
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: undefined,
    loading: false,
  });
</script>

<template>
  <div class="bg-white p-4 rounded-4xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <columns-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Trip Details
      </p>
    </div>
    <gc-skeleton v-if="loading" />
    <gc-empty-state v-else-if="!loading && !data?.length">
      <p class="mb-4 text-base">
        You haven't added any trip details to this trip yet!
      </p>
      <gc-button
        label="Add a detail"
        outlined
        size="sm" />
    </gc-empty-state>
    <div v-else>
      Display trip details
    </div>
  </div>
</template>
