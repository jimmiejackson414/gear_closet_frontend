<script lang='ts' setup>
  import type { Tables } from '@/types';
  import type { SelectOption } from '@/types/helpers';

  const $store = usePlanningStore();
  const $userStore = useUserStore();

  const tripOptions = computed(() => $store.data.trips.map((t: Tables<'trips'>) => ({ label: t.name, value: t.id })) as SelectOption[]);

  /**
   * Leaves the current trip.
   */
  const isLeaveTripDialogOpen = ref(false);
  const isSubmitting = ref(false);
  const leaveTrip = async () => {
    // TODO: implement
  };

  const emits = defineEmits<{
    (event: 'openDialog'): void;
    (event: 'selectTrip', id: string): void;
  }>();
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
            <dropdown-menu-item @select="isLeaveTripDialogOpen = true">
              Leave Trip
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

    <div v-tippy="{ content: !$userStore.isPaidMember && $store.data.trips.length >= 1 ? 'Free accounts are limited to one pack. Please upgrade to enjoy unlimited packs!' : '' }">
      <button-root
        :disabled="$store.pageLoading || (!$userStore.isPaidMember && $store.data.trips.length >= 1)"
        @click="emits('openDialog')">
        New Trip
      </button-root>
    </div>

    <alert-dialog :open="isLeaveTripDialogOpen">
      <alert-dialog-content>
        <alert-dialog-header>
          <alert-dialog-title>
            Leave the "{{ $store.data.trips.find((t: Tables<'trips'>) => t.id === Number($store.selectedTripId))?.name }}" trip?
          </alert-dialog-title>
        </alert-dialog-header>
        <div class="flex items-center mb-4 space-x-2">
          <div class="flex flex-col">
            <typography class="mb-2">
              Are you sure you want to leave this trip?
            </typography>
            <typography variant="small">
              You will lose access to all the data associated with this trip.
            </typography>
          </div>
        </div>
        <alert-dialog-footer class="items-center w-full sm:justify-between">
          <button-root
            :disabled="isSubmitting"
            :loading="isSubmitting"
            variant="secondary"
            @click="isLeaveTripDialogOpen = false"
            @update:open="isLeaveTripDialogOpen = false">
            Cancel
          </button-root>
          <button-root
            :disabled="isSubmitting"
            :loading="isSubmitting"
            variant="destructive"
            @click="leaveTrip">
            Leave Trip
          </button-root>
        </alert-dialog-footer>
      </alert-dialog-content>
    </alert-dialog>
  </div>
</template>
