<script lang='ts' setup>
  const $store = usePlanningStore();
  const weatherHasForecast = ref(false);
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
      </div>

      <div
        class="flex flex-col gap-6"
        data-testid="planning-sidebar">
        <div class="order-1">
          <trip-friends-widget />
        </div>
        <div
          v-if="$store.selectedTrip"
          :class="weatherHasForecast ? 'order-2' : 'order-4'"
          data-testid="planning-weather-slot">
          <trip-weather-widget
            v-model:has-forecast="weatherHasForecast"
            :trip-id="$store.selectedTrip.id" />
        </div>
        <div
          :class="weatherHasForecast ? 'order-3' : 'order-2'"
          data-testid="planning-todos-slot">
          <todos-widget />
        </div>
        <div
          :class="weatherHasForecast ? 'order-4' : 'order-3'"
          data-testid="planning-shopping-slot">
          <shopping-list-widget />
        </div>
        <div class="order-5">
          <poll-widget />
        </div>
      </div>
    </div>
  </div>
</template>
