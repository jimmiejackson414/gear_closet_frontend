<script lang='ts' setup>
  const $store = usePlanningStore();
  const $route = useRoute();
  const $cookie = useCookie('selectedTripId');
  const { data, pageLoading } = storeToRefs($store);

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
</script>

<template>
  <div class="pb-8">
    <planning-settings />

    <planning-empty-state v-if="!data.trips.length && !pageLoading" />

    <planning-content v-else />

    <create-trip-dialog />

    <!-- 2. Walkthrough -->
    <!-- 3. Create Poll Dialog -->
    <!-- 4. Alert Dialog -->
  </div>
</template>
