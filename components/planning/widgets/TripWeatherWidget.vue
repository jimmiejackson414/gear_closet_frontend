<script lang="ts" setup>
  import type { Component } from 'vue';
  import {
    IconCloud,
    IconCloudFog,
    IconCloudLightning,
    IconCloudRain,
    IconCloudSnow,
    IconSun,
  } from '#components';
  import { OPEN_METEO_ATTRIBUTION, type AirQualitySnapshot, type TripWeatherResponse } from '@/types/weather';
  import { airQualityLabel, hasTripStartDate, tripWeatherWatchKey, weatherIconKind } from '@/utils/tripWeather';

  interface Props {
    tripId?: number | null
  }

  const props = defineProps<Props>();
  const $store = usePlanningStore();

  const selectedPlaceTrip = computed(() => {
    if (props.tripId == null) return null;
    return $store.data.trips.find(trip => trip.id === props.tripId)
      ?? ($store.selectedTrip?.id === props.tripId ? $store.selectedTrip : null);
  });

  const weatherKey = computed(() => tripWeatherWatchKey(props.tripId, selectedPlaceTrip.value));

  const weatherAsync = useAsyncData(
    () => `trip-weather-${weatherKey.value}`,
    async () => {
      if (!props.tripId) return null;
      if (selectedPlaceTrip.value && !hasTripStartDate(selectedPlaceTrip.value.starting_date)) {
        return { status: 'needs_date' as const };
      }
      return $fetch<TripWeatherResponse>('/api/weather', {
        query: { tripId: props.tripId },
      });
    },
    { server: false, watch: [weatherKey] },
  );

  const weather = computed(() => weatherAsync.data.value);
  const pending = computed(() => weatherAsync.pending.value);

  const unitSymbol = computed(() => {
    if (weather.value && 'units' in weather.value) {
      return weather.value.units === 'imperial' ? '°F' : '°C';
    }
    return '°F';
  });

  const iconFor = (code: number): Component => {
    switch (weatherIconKind(code)) {
    case 'sun':
      return IconSun;
    case 'fog':
      return IconCloudFog;
    case 'rain':
      return IconCloudRain;
    case 'snow':
      return IconCloudSnow;
    case 'thunder':
      return IconCloudLightning;
    default:
      return IconCloud;
    }
  };

  const formatDay = (isoDate: string) => {
    const date = new Date(`${isoDate}T00:00:00`);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'short' });
  };

  const aqiClass = (snapshot: AirQualitySnapshot) => {
    switch (snapshot.category) {
    case 'good':
      return 'text-emerald-700 dark:text-emerald-400';
    case 'moderate':
      return 'text-yellow-700 dark:text-yellow-400';
    case 'unhealthy_sensitive':
      return 'text-orange-700 dark:text-orange-400';
    case 'unhealthy':
      return 'text-red-700 dark:text-red-400';
    case 'very_unhealthy':
      return 'text-purple-700 dark:text-purple-400';
    case 'hazardous':
      return 'text-rose-900 dark:text-rose-400';
    }
  };
</script>

<template>
  <card
    class="px-4 sm:px-8 py-4 rounded-3xl"
    data-testid="trip-weather-widget">
    <div class="justify-start items-center grid grid-cols-[auto_auto_1fr] py-4">
      <icon-sun class="mr-6 w-6 h-6 text-primary" />
      <typography class="font-bold!">
        Weather
      </typography>
    </div>
    <gc-skeleton
      v-if="pending"
      :lines="3" />
    <gc-empty-state v-else-if="!tripId || weather?.status === 'needs_place'">
      <typography>
        Pick a starting or ending point to see weather.
      </typography>
    </gc-empty-state>
    <gc-empty-state v-else-if="weather?.status === 'needs_date'">
      <typography>
        Select a starting date for weather information.
      </typography>
    </gc-empty-state>
    <gc-empty-state v-else-if="weather?.status === 'too_far'">
      <typography>
        Weather will be available within {{ weather.availableWithinDays }} days of
        your scheduled trip.
      </typography>
    </gc-empty-state>
    <div
      v-else-if="weather?.status === 'forecast'"
      class="space-y-6">
      <div
        v-for="place in weather.places"
        :key="place.kind">
        <typography
          class="mb-3 text-muted-foreground"
          variant="muted">
          Forecast for {{ place.placeLabel }}
        </typography>
        <typography
          v-if="place.currentAirQuality"
          class="mb-3"
          variant="muted">
          Air quality now:
          <span :class="aqiClass(place.currentAirQuality)">
            {{ place.currentAirQuality.aqi }} {{ airQualityLabel(place.currentAirQuality.category) }}
          </span>
        </typography>
        <div class="overflow-x-auto min-w-0">
          <table-root class="w-full">
            <table-header>
              <table-row no-hover-effect>
                <table-head class="h-auto py-2 px-4 font-bold">
                  Day
                </table-head>
                <table-head class="h-auto py-2 px-4 font-bold text-right">
                  Temp
                </table-head>
                <table-head class="h-auto py-2 px-4 w-16 font-bold text-right">
                  Precip
                </table-head>
                <table-head class="h-auto py-2 px-4 w-20 font-bold text-right">
                  AQI
                </table-head>
              </table-row>
            </table-header>
            <table-body>
              <table-row
                v-for="day in place.days"
                :key="`${place.kind}-${day.date}`">
                <table-cell class="py-2 px-4 text-sm">
                  <div class="flex items-center gap-2">
                    <component
                      :is="iconFor(day.weatherCode)"
                      class="w-5 h-5 text-primary shrink-0" />
                    <span>{{ formatDay(day.date) }}</span>
                  </div>
                </table-cell>
                <table-cell class="py-2 px-4 tabular-nums text-sm text-right">
                  {{ Math.round(day.high) }}{{ unitSymbol }} / {{ Math.round(day.low) }}{{ unitSymbol }}
                </table-cell>
                <table-cell class="py-2 px-4 w-16 tabular-nums text-muted-foreground text-sm text-right">
                  {{ day.precipChance != null ? `${Math.round(day.precipChance)}%` : '—' }}
                </table-cell>
                <table-cell
                  class="py-2 px-4 w-20 tabular-nums text-sm text-right"
                  :class="day.airQuality ? aqiClass(day.airQuality) : 'text-muted-foreground'">
                  {{ day.airQuality ? day.airQuality.aqi : '—' }}
                </table-cell>
              </table-row>
            </table-body>
          </table-root>
        </div>
      </div>
    </div>
    <typography
      v-if="weather?.status === 'forecast'"
      class="mt-4 text-right text-xs text-muted-foreground"
      variant="muted">
      {{ OPEN_METEO_ATTRIBUTION }}
    </typography>
  </card>
</template>
