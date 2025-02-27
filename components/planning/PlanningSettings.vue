<script lang='ts' setup>
  import type { Tables } from '@/types';
  import type { SelectOption } from '@/types/helpers';

  const $store = usePlanningStore();
  const $userStore = useUserStore();

  const tripOptions = computed(() => $store.data.trips.map((t: Tables<'trips'>) => ({ label: t.name, value: t.id })) as SelectOption[]);

  const isLeaveTripDialogOpen = ref(false);
  const isDeleteTripDialogOpen = ref(false);
  const isTransferTripDialogOpen = ref(false);

  const emits = defineEmits<{
    (event: 'openDialog'): void;
    (event: 'selectTrip', id: string): void;
  }>();
</script>

<template>
  <div class="mb-8 flex items-center justify-between gap-6 lg:justify-end">
    <div class="flex items-center justify-center gap-4">
      <div class="flex">
        <dropdown-menu>
          <dropdown-menu-trigger>
            <icon-settings
              class="size-6"
              data-testid="settings-icon" />
          </dropdown-menu-trigger>
          <dropdown-menu-content>
            <dropdown-menu-label>
              Actions
            </dropdown-menu-label>
            <dropdown-menu-separator />
            <dropdown-menu-item
              v-if="!$store.data.is_trip_owner"
              @select="isLeaveTripDialogOpen = true">
              Leave Trip
            </dropdown-menu-item>
            <dropdown-menu-item
              v-if="$store.data.is_trip_owner"
              @select="isTransferTripDialogOpen = true">
              Transfer Trip Ownership
            </dropdown-menu-item>
            <dropdown-menu-item
              v-if="$store.data.is_trip_owner"
              class="text-destructive"
              @select="isDeleteTripDialogOpen = true">
              Delete Trip
            </dropdown-menu-item>
          </dropdown-menu-content>
        </dropdown-menu>
      </div>
      <select-root
        :default-value="String($store.selectedTripId)"
        :model-value="$store.selectedTripId"
        @update:model-value="emits('selectTrip', $event)">
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

    <div
      v-tippy="{
        content: !$userStore.isPaidMember && $store.data.trips.length >= 1 ? 'Free accounts are limited to one pack. Please upgrade to enjoy unlimited packs!' : ''
      }">
      <button-root
        :disabled="$store.pageLoading || (!$userStore.isPaidMember && $store.data.trips.length >= 1)"
        @click="emits('openDialog')">
        New Trip
      </button-root>
    </div>

    <lazy-leave-trip-dialog v-model:is-open="isLeaveTripDialogOpen" />

    <lazy-delete-trip-dialog v-model:is-open="isDeleteTripDialogOpen" />

    <lazy-transfer-trip-ownership-dialog v-model:is-open="isTransferTripDialogOpen" />
  </div>
</template>
