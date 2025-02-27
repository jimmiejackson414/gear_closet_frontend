<script lang='ts' setup>
  const $store = usePlanningStore();
  const $cookie = useCookie('selectedTripId');

  const handleSelectTrip = (value: string) => {
    $cookie.value = encrypt(value);
    $store.selectedTripId = value;
  };

  const { data } = await useAsyncData(
    'planningData',
    () => {
      const tripId = $cookie.value ? decrypt($cookie.value) : $store.selectedTripId;
      return $store.fetchPlanningPage(Number(tripId || 0));
    },
    { immediate: true, watch: [() => $store.selectedTripId] },
  );

  watch(data, (newData) => {
    if (newData) Object.assign($store.data, newData);
  }, { immediate: true });

  const isCreateTripDialogOpen = ref(false);
</script>

<template>
  <div class="pb-8">
    <planning-settings
      @open-dialog="isCreateTripDialogOpen = true"
      @select-trip="handleSelectTrip" />

    <planning-empty-state
      v-if="!$store.data.trips?.length && !$store.pageLoading"
      @open-dialog="isCreateTripDialogOpen = true" />

    <planning-content v-else />

    <lazy-create-trip-dialog
      :is-open="isCreateTripDialogOpen"
      @on-close="isCreateTripDialogOpen = false" />
  </div>
</template>
