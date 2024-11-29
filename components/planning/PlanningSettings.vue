<script lang='ts' setup>
  import type { Tables } from '@/types';
  import type { SelectOption } from '@/types/helpers';

  const $store = usePlanningStore();
  const { data, pageLoading, selectedTripId } = storeToRefs($store);
  const { isPaidMember } = storeToRefs(useUserStore());

  const tripOptions = computed(() => data.value.trips.map((t: Tables<'trips'>) => ({ label: t.name, value: t.id })) as SelectOption[]);

  /**
   * Leaves the current trip.
   */
  const isLeaveTripModalOpen = ref(false);
  const leaveTrip = async () => {
    // TODO: implement
  };

  /**
   * Handles selecting a trip and setting the cookie.
   */
  const handleSelectTrip = async (value: string) => {
    const cookie = useCookie('selectedTripId');
    cookie.value = encrypt(value);
    selectedTripId.value = value;
  };
</script>

<template>
  <div class="flex justify-between lg:justify-end items-center gap-6 mb-8">
    <div class="flex justify-center items-center gap-4">
      <div class="flex">
        <dropdown-menu>
          <dropdown-menu-trigger>
            <icon-settings
              class="h-6 w-6"
              data-testid="settings-icon" />
          </dropdown-menu-trigger>
          <dropdown-menu-content>
            <dropdown-menu-label>
              Actions
            </dropdown-menu-label>
            <dropdown-menu-separator />
            <dropdown-menu-item @select="isLeaveTripModalOpen = true">
              Leave Trip
            </dropdown-menu-item>
          </dropdown-menu-content>
        </dropdown-menu>
      </div>
      <select-root
        :default-value="String(selectedTripId)"
        :model-value="selectedTripId"
        @update:model-value="handleSelectTrip">
        <select-trigger>
          <select-value placeholder="Selected Trip" />
        </select-trigger>
        <select-content>
          <select-group>
            <select-item
              v-for="trip in tripOptions"
              :key="trip.value"
              hide-checkmark
              :value="String(trip.value)">
              {{ trip.label }}
            </select-item>
          </select-group>
        </select-content>
      </select-root>
    </div>

    <div v-tippy="{ content: !isPaidMember && data.trips.length >= 1 ? 'Free accounts are limited to one pack. Please upgrade to enjoy unlimited packs!' : '' }">
      <button-root
        :disabled="pageLoading || (!isPaidMember && data.trips.length >= 1)"
        size="sm"
        @click="$store.dialogStates.createTripDialog = true">
        New Trip
      </button-root>
    </div>
  </div>
</template>
