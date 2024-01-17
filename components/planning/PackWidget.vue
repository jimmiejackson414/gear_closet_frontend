<script lang='ts' setup>
  import { BackpackIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '#imports';

  const $store = usePlanningStore();
  const { data, pageLoading, selectedTripId, selectedTrip } = storeToRefs($store);
</script>

<template>
  <div class="bg-white px-8 py-4 rounded-4xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <backpack-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Pack
      </p>
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !data.pack">
      <p class="mb-4 text-base">
        You haven't added a pack to this trip yet!
      </p>
      <gc-button
        label="Add a pack"
        outlined
        size="sm" />
    </gc-empty-state>
    <div v-else>
      Display pack chart
    </div>
  </div>
</template>
