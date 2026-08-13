<script lang='ts' setup>
  import type { AcceptableValue } from 'reka-ui';
  import type { Tables } from '@/types';
  import type { SelectOption } from '@/types/helpers';

  const $store = usePlanningStore();
  const $userStore = useUserStore();

  const tripOptions = computed(() => $store.data.trips.map((t: Tables<'trips'>) => ({ label: t.name, value: t.id })) as SelectOption[]);

  /**
   * Handles selecting a trip: persist cookie, clear pinned ?trip=, refetch.
   * Cookie-only updates previously skipped refetch when ?trip= was present.
   */
  const $router = useRouter();
  const $route = useRoute();
  const handleSelectTrip = async (value: AcceptableValue) => {
    if (value == null || value === '') return;

    const tripId = Number(value);
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
        <select-trigger class="min-w-[180px]">
          <span v-if="!$store.selectedTripId">Selected Trip</span>
          <select-value placeholder="Selected Trip" />
        </select-trigger>
        <select-content>
          <select-group v-if="tripOptions.length">
            <select-item
              v-for="trip in tripOptions"
              :key="trip.value"
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

    <div v-tippy="{ content: !$userStore.isPaidMember && $store.data.trips.length >= 1 ? 'Free accounts are limited to one trip. Please upgrade to enjoy unlimited trips!' : '' }">
      <button-root
        :disabled="$store.pageLoading || (!$userStore.isPaidMember && $store.data.trips.length >= 1)"
        @click="emits('openDialog')">
        New Trip
      </button-root>
    </div>
  </div>
</template>
