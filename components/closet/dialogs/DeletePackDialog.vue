<script lang='ts' setup>
  import type { Database } from '@/types';

  const $store = useClosetStore();
  const $appStore = useAppStore();
  const { data, dialogStates } = storeToRefs($store);
  const removeItemCheckbox = ref(false);
  const submitting = ref(false);

  const handleSubmit = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase
        .from('packs')
        .delete()
        .eq('id', data.value.selectedPack?.id as number);

      if (!error) {
        // Find the index of the pack in the allPacks array
        const packIndex = data.value.allPacks.findIndex(p => p.id === data.value.selectedPack?.id);

        // Remove the pack from the allPacks array
        if (packIndex !== -1) {
          data.value.allPacks.splice(packIndex, 1);
        }

        // Remove the pack from the selectedPack
        data.value.selectedPack = undefined;
        $appStore.notifyPositive('Pack deleted successfully.');
      } else {
        $appStore.notifyNegative('There was an error deleting the pack.');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error deleting the pack.');
    } finally {
      submitting.value = false;
      dialogStates.value.deletePackDialog = false;
    }
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.deletePackDialog"
    title="Delete Pack"
    @handle-cancel="dialogStates.deletePackDialog = false">
    <template #content>
      <div>
        <p class="font-bold mb-0 text-base">
          Are you sure you want to delete this pack?
        </p>
        <p class="!font-bold mb-4 text-base text-danger">
          This action cannot be undone!
        </p>
      </div>
      <div class="flex items-center gap-4">
        <gc-checkbox
          id="remove-item-checkbox"
          v-model="removeItemCheckbox"
          label="Also remove from closet?" />
        <icon-info
          v-tippy="{ content: 'Checking this will remove all items from your closet as well.' }"
          class="h-4 w-4" />
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="dialogStates.deletePackDialog = false" />
      <gc-button
        :disabled="submitting"
        label="Delete Pack"
        :loading="submitting"
        size="sm"
        variant="danger"
        @click="handleSubmit" />
    </template>
  </gc-modal>
</template>
