<script lang='ts' setup>
  import { UsersRoundIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '#imports';

  const $store = usePlanningStore();
  const { data, pageLoading, selectedTripId, selectedTrip } = storeToRefs($store);
</script>

<template>
  <div class="bg-grey-50 px-8 py-4 rounded-2xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <users-round-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Friends
      </p>
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !data.friends.length">
      <p class="mb-4 text-base">
        You haven't added any friends to this trip yet!
      </p>
      <gc-button
        label="Get Started"
        outlined
        size="sm" />
    </gc-empty-state>
    <div v-else>
      Display friends
    </div>
  </div>
</template>
