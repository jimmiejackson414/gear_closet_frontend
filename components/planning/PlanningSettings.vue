<script lang='ts' setup>
  import {
    FREE_TRIP_CREATE_TIP,
    FREE_TRIP_LIMIT,
    isFreeCreateBlocked,
    LOCKED_RESOURCE_TIP,
  } from '@/utils/planLimits';
  import { isTripLockedForUser, ownedTrips } from '@/utils/trips';
  import type { Tables } from '@/types';
  import type { SelectOption } from '@/types/ui';
  import type { AcceptableValue } from 'reka-ui';

  const $store = usePlanningStore();
  const $userStore = useUserStore();
  const $appStore = useAppStore();
  const sessionUser = useSupabaseUser();
  const userId = computed(() => $userStore.profile?.id ?? sessionUser.value?.sub);

  const tripOptions = computed(() => $store.data.trips.map((t: Tables<'trips'>) => {
    const locked = isTripLockedForUser(t, userId.value, $userStore.isPaidMember);
    const invited = Boolean(userId.value && t.profile_id && t.profile_id !== userId.value);
    return {
      label: locked ? `${t.name} (Locked)` : invited ? `${t.name} (Invited)` : t.name,
      locked,
      value: t.id,
    };
  }) as Array<SelectOption & { locked?: boolean }>);

  const createBlocked = computed(() =>
    isFreeCreateBlocked(
      $userStore.isPaidMember,
      ownedTrips($store.data.trips, userId.value),
      FREE_TRIP_LIMIT,
    ));

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
    if (isTripLockedForUser(trip, userId.value, $userStore.isPaidMember)) {
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
  <div class="flex flex-wrap justify-between lg:justify-end items-center gap-3 sm:gap-6 mb-8">
    <div class="flex justify-center items-center gap-3 sm:gap-4 min-w-0">
      <select-root
        :default-value="String($store.selectedTripId)"
        :model-value="$store.selectedTripId"
        @update:model-value="handleSelectTrip">
        <select-trigger class="min-w-0 w-40 sm:min-w-45 sm:w-auto">
          <span v-if="!$store.selectedTripId">Selected Trip</span>
          <select-value placeholder="Selected Trip" />
        </select-trigger>
        <select-content>
          <select-group v-if="tripOptions.length">
            <select-item
              v-for="trip in tripOptions"
              :key="trip.value"
              :disabled="trip.locked"
              hide-checkmark
              :value="String(trip.value)">
              {{ trip.label }}
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
