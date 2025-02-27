<script lang='ts' setup>
  import { type Database, type Tables, TripFriendRole } from '@/types';
  import type { SelectOption } from '@/types/helpers';

  const isOpen = defineModel('isOpen', { default: false, required: true, type: Boolean });

  const $appStore = useAppStore();
  const $userStore = useUserStore();
  const $store = usePlanningStore();
  const isSubmitting = ref(false);

  /**
   * Transfers ownership of the current trip.
   */
  const selectedTransferUserId = ref<string>('');
  const searchQuery = ref('');
  const supabase = useSupabaseClient<Database>();
  const transferTripOwnership = async () => {
    try {
      isSubmitting.value = true;

      // update old owner and new owner records
      const [{ error: oldOwnerError }, { error: newOwnerError }] = await Promise.all([
        supabase.from('trip_friends')
          .update({ role: TripFriendRole.MEMBER })
          .match({ profile_id: $userStore.profile?.id, trip_id: Number($store.selectedTripId) }),
        supabase.from('trip_friends')
          .update({ role: TripFriendRole.OWNER })
          .match({ profile_id: selectedTransferUserId.value, trip_id: Number($store.selectedTripId) }),
      ]);

      if (oldOwnerError || newOwnerError) throw oldOwnerError || newOwnerError;

      $store.data.is_trip_owner = false;

      $appStore.notifyPositive('Trip ownership transferred successfully.');
      isOpen.value = false;
    } catch (err) {
      $appStore.notifyNegative('There was an error transferring the trip.');
    } finally {
      isSubmitting.value = false;
    }
  };

  const selectOptions = ref<SelectOption[]>([]);
  watch(isOpen, (newIsOpen) => {
    if (newIsOpen) {
      searchQuery.value = '';
      selectedTransferUserId.value = '';
      // @ts-ignore
      selectOptions.value = $store.data.friends.map(f => ({ label: friendlyUsername(f.profile), value: f.profile_id }));
    }
  });

  const selectedFriend = computed(() => {
    if (!selectedTransferUserId.value) return undefined;
    // @ts-ignore
    return $store.data.friends.find(f => f.profile_id === selectedTransferUserId.value);
  });
</script>

<template>
  <alert-dialog :open="isOpen">
    <alert-dialog-content>
      <alert-dialog-header>
        <alert-dialog-title>
          Transfer ownership of the "{{ $store.data.trips.find((t: Tables<'trips'>) => t.id === Number($store.selectedTripId))?.name }}" trip?
        </alert-dialog-title>
        <alert-dialog-description />
      </alert-dialog-header>
      <div class="mb-4 flex flex-col items-start space-x-2">
        <combobox
          :model-value="(selectedTransferUserId as string)"
          :options="selectOptions"
          placeholder="Select a member of this trip"
          @update:model-value="selectedTransferUserId = $event" />
        <div
          v-if="selectedFriend"
          class="mt-4 flex flex-col">
          <typography>
            Are you sure you want to transfer this trip to <span class="font-bold">{{ friendlyUsername(selectedFriend.profile) }}</span>?
          </typography>
          <typography>
            This will allow {{ selectedFriend.profile.first_name }} to manage the trip and its data.
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
          :disabled="isSubmitting || !selectedTransferUserId"
          :loading="isSubmitting"
          variant="destructive"
          @click="transferTripOwnership">
          Transfer Trip
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>
