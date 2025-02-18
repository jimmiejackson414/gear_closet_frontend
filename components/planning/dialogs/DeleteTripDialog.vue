<script lang='ts' setup>
  import type { Tables } from '@/types';

  const isOpen = defineModel('isOpen', { default: false, required: true, type: Boolean });

  const $store = usePlanningStore();
  const isSubmitting = ref(false);

  /**
   * Deletes the current trip.
   */
  const deleteTrip = async () => {
    // TODO: implement
    // NOTE: This is only allowed for trip owners
  };
</script>

<template>
  <alert-dialog :open="isOpen">
    <alert-dialog-content>
      <alert-dialog-header>
        <alert-dialog-title>
          Delete the "{{ $store.data.trips.find((t: Tables<'trips'>) => t.id === Number($store.selectedTripId))?.name }}" trip?
        </alert-dialog-title>
      </alert-dialog-header>
      <div class="mb-4 flex items-center space-x-2">
        <div class="flex flex-col">
          <typography class="mb-2">
            Are you sure you want to delete this trip?
          </typography>
          <typography
            class="font-normal"
            variant="small">
            Both you and the friends invited to this trip will lose access to all the data associated with this trip.
          </typography>
        </div>
      </div>
      <alert-dialog-footer class="w-full items-center sm:justify-between">
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
          @click="deleteTrip">
          Delete Trip
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>
