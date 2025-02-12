<script lang='ts' setup>
  import type { Database, Tables } from '@/types';

  const isOpen = defineModel('isOpen', { default: false, required: true, type: Boolean });

  const $appStore = useAppStore();
  const $userStore = useUserStore();
  const $store = usePlanningStore();
  const isSubmitting = ref(false);

  /**
   * Leaves the current trip.
   */
  const supabase = useSupabaseClient<Database>();
  const leaveTrip = async () => {
    try {
      isSubmitting.value = true;

      const { data, error } = await supabase
        .from('trip_friends')
        .delete()
        .eq('trip_id', Number($store.selectedTripId))
        .eq('profile_id', $userStore.profile?.id as string)
        .select();

      if (error) throw error;

      // remove from $store.data.trips
      $store.data.trips = $store.data.trips.filter((t: Tables<'trips'>) => t.id !== data[0].trip_id);

      // set $store.selectedTripId to first trip or undefined
      $store.selectedTripId = $store.data.trips.length ? String($store.data.trips[0].id) : undefined;

      $appStore.notifyPositive('You have left the trip.');
      isOpen.value = false;
      isSubmitting.value = false;
    } catch (err) {
      $appStore.notifyNegative('There was an error leaving the trip.');
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<template>
  <alert-dialog :open="isOpen">
    <alert-dialog-content>
      <alert-dialog-header>
        <alert-dialog-title>
          Leave trip
        </alert-dialog-title>
      </alert-dialog-header>
      <div class="flex items-center mb-4 space-x-2">
        <div class="flex flex-col">
          <typography class="mb-2">
            Are you sure you want to leave the "{{ $store.data.trips.find((t: Tables<'trips'>) => t.id === Number($store.selectedTripId))?.name }}" trip?
          </typography>
          <typography
            class="font-normal"
            variant="small">
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
