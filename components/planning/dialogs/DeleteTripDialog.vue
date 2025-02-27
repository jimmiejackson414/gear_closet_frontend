<script lang='ts' setup>
  import type { Database, Tables, TablesInsert } from '@/types';

  const isOpen = defineModel('isOpen', { default: false, required: true, type: Boolean });

  const $store = usePlanningStore();
  const $appStore = useAppStore();
  const $userStore = useUserStore();
  const isSubmitting = ref(false);

  /**
   * Deletes the current trip.
   */
  const supabase = useSupabaseClient<Database>();
  const deleteTrip = async () => {
    try {
      isSubmitting.value = true;

      // Delete trip_friends records
      const { error: deleteTripFriendsError } = await supabase
        .from('trip_friends')
        .delete()
        .eq('trip_id', Number($store.selectedTripId));

      if (deleteTripFriendsError) throw deleteTripFriendsError;

      // Delete the trip
      const { data, error } = await supabase
        .from('trips')
        .delete()
        .eq('id', Number($store.selectedTripId))
        .select();

      if (error) throw error;
      if (!data?.length) throw new Error('No trip found to delete');

      // Create notifications for each friend
      const tripFriends = $store.data.friends as Tables<'trip_friends'>[];
      const notifications: TablesInsert<'notifications'>[] = tripFriends.map(friend => ({
        content: `The trip "${data[0].name}" has been deleted by the trip owner.`,
        profile_id: friend.profile_id,
        sender_id: $userStore.profile?.id as string,
        title: 'Trip deleted',
      }));

      const { error: notifyFriendsError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notifyFriendsError) throw notifyFriendsError;

      // Update local state after all database operations are successful
      $store.data.trips = $store.data.trips.filter((t: Tables<'trips'>) => t.id !== data[0].id);
      $store.selectedTripId = $store.data.trips.length ? String($store.data.trips[0].id) : undefined;

      $appStore.notifyPositive('Trip deleted successfully.');
      isOpen.value = false;
      isSubmitting.value = false;
    } catch (err) {
      $appStore.notifyNegative('There was an error deleting the trip.');
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
