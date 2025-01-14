<script lang='ts' setup>
  const $store = usePlanningStore();
  const $route = useRoute();
  const $cookie = useCookie('selectedTripId');

  let identifier = 0;
  watch($cookie, (newValue) => {
    if (newValue && !$route.query?.trip) {
      identifier = Number(decrypt(newValue)) || 0;
      $store.fetchPlanningPage(identifier);
    }
  }, { immediate: true });

  onMounted(async () => {
    identifier = $route.query?.trip ? Number(decrypt($route.query.trip)) || 0 : identifier;
    await $store.fetchPlanningPage(identifier);
  });

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
