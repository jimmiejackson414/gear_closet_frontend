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
  <alert-dialog v-model:open="dialogStates.deletePackDialog">
    <alert-dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="dialogStates.deletePackDialog = false"
      @interact-outside="dialogStates.deletePackDialog = false">
      <alert-dialog-header>
        <alert-dialog-title>
          Delete Pack
        </alert-dialog-title>
        <alert-dialog-description>
          <typography class="mb-4">
            Are you sure you want to delete this pack? <span class="font-bold">This action cannot be undone!</span>
          </typography>
          <div class="flex items-center gap-x-2">
            <checkbox
              id="accept-checkbox"
              v-model:checked="removeItemCheckbox"
              variant="destructive" />
            <div class="flex items-center gap-1.5 leading-none">
              <label
                class="font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive text-sm"
                for="accept-checkbox">
                Remove items from closet?
              </label>
              <icon-info
                v-tippy="{ content: 'Checking this will additionally remove all items associated with this pack from your closet.' }"
                class="h-4 w-4" />
            </div>
          </div>
        </alert-dialog-description>
      </alert-dialog-header>
      <alert-dialog-footer>
        <alert-dialog-cancel
          :disabled="submitting"
          @click="dialogStates.deletePackDialog = false">
          Cancel
        </alert-dialog-cancel>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          variant="destructive"
          @click="handleSubmit">
          Delete Pack
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>
