<script lang='ts' setup>
  import type { AcceptableValue } from 'reka-ui';
  import type { Tables } from '@/types';
  import type { SelectOption } from '@/types/helpers';
  import {
    FREE_TRIP_CREATE_TIP,
    FREE_TRIP_LIMIT,
    LOCKED_RESOURCE_TIP,
    isFreeCreateBlocked,
    isResourceLocked,
  } from '@/utils/planLimits';

  const $store = usePlanningStore();
  const $userStore = useUserStore();
  const $appStore = useAppStore();

  const tripOptions = computed(() => $store.data.trips.map((t: Tables<'trips'>) => ({
    label: t.name,
    value: t.id,
    locked: isResourceLocked(t),
  })) as Array<SelectOption & { locked?: boolean }>);

  const createBlocked = computed(() =>
    isFreeCreateBlocked($userStore.isPaidMember, $store.data.trips, FREE_TRIP_LIMIT));

  /**
   * Handles selecting a trip: persist cookie, clear pinned ?trip=, refetch.
   * Cookie-only updates previously skipped refetch when ?trip= was present.
   */
  const $router = useRouter();
  const $route = useRoute();
  const handleSelectTrip = async (value: AcceptableValue) => {
    if (value == null || value === '') return;

    const tripId = Number(value);
    const trip = $store.data.trips.find((t) => t.id === tripId);
    if (!$userStore.isPaidMember && isResourceLocked(trip)) {
      $appStore.notifyNegative(LOCKED_RESOURCE_TIP);
      return;
    }

    const cookie = useCookie('selectedTripId');
    cookie.value = encrypt(String(value));
    $store.selectedTripId = String(value);

    if ($route.query.trip != null) {
      const nextQuery = { ...$route.query };
      delete nextQuery.trip;
      await $router.replace({ query: nextQuery });
    }

    await $store.fetchPlanningPage(tripId);
  };

  const emits = defineEmits<{
    (event: 'openDialog'): void;
  }>();
</script>

<template>
  <div class="flex justify-between lg:justify-end items-center gap-6 mb-8">
    <div class="flex justify-center items-center gap-4">
      <select-root
        :default-value="String($store.selectedTripId)"
        :model-value="$store.selectedTripId"
        @update:model-value="handleSelectTrip">
        <select-trigger class="min-w-45">
          <span v-if="!$store.selectedTripId">Selected Trip</span>
          <select-value placeholder="Selected Trip" />
        </select-trigger>
        <select-content>
          <select-group v-if="tripOptions.length">
            <select-item
              v-for="trip in tripOptions"
              :key="trip.value"
              :disabled="!$userStore.isPaidMember && trip.locked"
              hide-checkmark
              :value="String(trip.value)">
              {{ trip.label }}{{ !$userStore.isPaidMember && trip.locked ? ' (Locked)' : '' }}
            </select-item>
          </select-group>
          <select-group v-else>
            <select-item
              disabled
              hide-checkmark
              value="0">
              No trips found
            </select-item>
          </select-group>
        </select-content>
      </select-root>
    </div>

    <div v-tippy="{ content: createBlocked ? FREE_TRIP_CREATE_TIP : '' }">
      <button-root
        :disabled="$store.pageLoading || createBlocked"
        @click="emits('openDialog')">
        New Trip
      </button-root>
    </div>
  </div>
</template>
