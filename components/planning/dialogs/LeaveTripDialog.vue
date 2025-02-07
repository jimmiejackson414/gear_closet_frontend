<script lang='ts' setup>
  import type { Tables } from '@/types';

  const isOpen = defineModel('isOpen', { default: false, type: Boolean, required: true });

  const $store = usePlanningStore();
  const isSubmitting = ref(false);

  /**
   * Leaves the current trip.
   */
  const leaveTrip = async () => {
    // TODO: implement
    // NOTE: This is only allowed for trip members
  };
</script>

<template>
  <alert-dialog :open="isOpen">
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
          @click="isOpen = false"
          @update:open="isOpen = false">
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
</template>
