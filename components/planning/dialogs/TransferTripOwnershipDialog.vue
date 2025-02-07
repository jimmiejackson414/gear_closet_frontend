<script lang='ts' setup>
  import type { Tables } from '@/types';

  const isOpen = defineModel('isOpen', { default: false, type: Boolean, required: true });

  const $store = usePlanningStore();
  const isSubmitting = ref(false);

  /**
   * Transfers ownership of the current trip.
   */
  const transferTripOwnership = async () => {
    // TODO: implement
    // NOTE: This is only allowed for trip owners transferring ownership to other trip members
  };
</script>

<template>
  <alert-dialog :open="isOpen">
    <alert-dialog-content>
      <alert-dialog-header>
        <alert-dialog-title>
          Transfer ownership of the "{{ $store.data.trips.find((t: Tables<'trips'>) => t.id === Number($store.selectedTripId))?.name }}" trip?
        </alert-dialog-title>
      </alert-dialog-header>
      <div class="flex items-center mb-4 space-x-2">
        <div class="flex flex-col">
          <typography class="mb-2">
            Are you sure you want to transfer this trip to {{ `TEST` }}?
          </typography>
          <typography variant="small">
            This will allow {{ `TEST` }} to manage the trip and its data.
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
          @click="transferTripOwnership">
          Transfer Trip
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>
