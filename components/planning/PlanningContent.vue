<script lang='ts' setup>
  const $store = usePlanningStore();
</script>

<template>
  <div class="relative">
    <div
      v-if="$store.isRefreshing"
      aria-busy="true"
      aria-live="polite"
      class="z-10 absolute inset-0 bg-background/40 rounded-3xl pointer-events-none" />
    <div class="gap-6 grid grid-cols-1 lg:grid-cols-[65%_35%]">
      <div class="flex flex-col space-y-6">
        <!-- Pack Widget -->
        <pack-widget />

        <!-- Trip Details -->
        <trip-details-widget />

        <!-- Hike Details -->
        <hike-details-widget />

        <div
          v-if="$store.selectedTrip"
          data-testid="planning-weather-slot">
          <trip-weather-widget :trip-id="$store.selectedTrip.id" />
        </div>
      </div>

      <div
        class="flex flex-col gap-6"
        data-testid="planning-sidebar">
        <trip-friends-widget />
        <div data-testid="planning-todos-slot">
          <todos-widget />
        </div>
        <div data-testid="planning-shopping-slot">
          <shopping-list-widget />
        </div>
        <poll-widget />
      </div>
    </div>
  </div>
</template>
