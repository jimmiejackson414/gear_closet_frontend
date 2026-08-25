<script lang='ts' setup>
  const $store = usePlanningStore();
</script>

<template>
  <div class="relative">
    <div
      v-if="$store.isRefreshing"
      aria-busy="true"
      aria-live="polite"
      class="absolute inset-0 z-10 bg-background/40 pointer-events-none rounded-3xl" />
    <div class="grid lg:grid-cols-[65%_35%] grid-cols-1 gap-6">
      <div class="flex flex-col space-y-6">
        <!-- Pack Widget -->
        <pack-widget />

        <!-- Trip Details -->
        <trip-details-widget />

        <!-- Hike Details -->
        <hike-details-widget />
      </div>

      <div class="flex flex-col space-y-6">
        <!-- Friends -->
        <trip-friends-widget />

        <!-- Todos -->
        <todos-widget />

        <!-- Weather -->
        <trip-weather-widget
          v-if="$store.selectedTrip"
          :trip-id="$store.selectedTrip.id" />

        <!-- Shopping List -->
        <shopping-list-widget />

        <!-- Poll -->
        <poll-widget />
      </div>
    </div>
  </div>
</template>
