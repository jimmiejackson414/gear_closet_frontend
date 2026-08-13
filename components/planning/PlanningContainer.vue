<script lang="ts" setup>
  const $store = usePlanningStore();
  const $route = useRoute();
  const $cookie = useCookie('selectedTripId');

  /**
   * Resolve trip id once: query > cookie > 0 (RPC / store pick first trip).
   * Cookie watcher + onMounted previously both fetched → double RPC / races.
   */
  const resolveTripId = (): number => {
    const fromQuery = $route.query?.trip;
    if (fromQuery != null && fromQuery !== '') {
      return Number(decrypt(fromQuery)) || 0;
    }
    if ($cookie.value) {
      return Number(decrypt($cookie.value)) || 0;
    }
    return 0;
  };

  onMounted(async () => {
    await $store.fetchPlanningPage(resolveTripId());
  });

  // Deep-link / browser navigation with ?trip= should refetch that trip.
  watch(
    () => $route.query.trip,
    async (tripQuery, previous) => {
      if (tripQuery === previous) return;
      if (tripQuery == null || tripQuery === '') return;
      const id = Number(decrypt(tripQuery)) || 0;
      await $store.fetchPlanningPage(id);
    },
  );

  const isCreateTripDialogOpen = ref(false);
</script>

<template>
  <div class="pb-8">
    <planning-settings @open-dialog="isCreateTripDialogOpen = true" />

    <planning-empty-state
      v-if="!$store.data.trips.length && !$store.pageLoading"
      @open-dialog="isCreateTripDialogOpen = true" />

    <planning-content v-else />

    <lazy-create-trip-dialog
      :is-open="isCreateTripDialogOpen"
      @on-close="isCreateTripDialogOpen = false" />
  </div>
</template>
