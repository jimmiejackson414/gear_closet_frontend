<script lang='ts' setup>
  import type { Database } from '@/types';
  import type { ExtendedPack } from '@/types/helpers';

  const $store = useClosetStore();
  const { activeCategoryId, data, dialogStates } = storeToRefs($store);
  const submitting = ref(false);

  /**
   * Remove category from pack
   */
  const $appStore = useAppStore();
  const removeItemCheckbox = ref(false);
  const isRemoveCategoryModalOpen = ref(false);
  const handleSubmit = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      let closetError = null;

      // Remove category from pack
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', $store.activeCategoryId as number);

      // If removeFromCloset is true, remove items from closet as well
      if (removeItemCheckbox.value) {
        const result = await supabase
          .from('category_items')
          .delete()
          .match({ category_id: $store.activeCategoryId });
        closetError = result.error;
      }

      if (!error && !closetError) {
        // Find the index of the category in the pack
        const categoryIndex = (data.value.selectedPack as ExtendedPack).categories.findIndex(c => c.id === $store.activeCategoryId);

        // Remove the category from the pack
        if (categoryIndex !== -1) {
          (data.value.selectedPack as ExtendedPack).categories.splice(categoryIndex, 1);
        }
        $appStore.notifyPositive(`Category ${removeItemCheckbox.value ? 'and its items' : ''} removed successfully.`);
        dialogStates.value.deleteCategoryDialog = false;
      } else {
        $appStore.notifyNegative('There was an error removing the category or its items.');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error removing the category.');
    } finally {
      submitting.value = false;
      isRemoveCategoryModalOpen.value = false;
    }
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.deleteCategoryDialog"
    title="Remove Category from Pack"
    @handle-cancel="[
      dialogStates.deleteCategoryDialog = false,
      removeItemCheckbox = false,
      activeCategoryId = undefined
    ]">
    <template #content>
      <div>
        <p class="font-bold mb-0 text-base">
          Are you sure you want to remove this category from this pack?
        </p>
        <p class="!font-bold mb-4 text-base text-danger">
          This action cannot be undone!
        </p>
      </div>
      <div class="flex items-center gap-4">
        <gc-checkbox
          id="remove-item-checkbox"
          v-model="removeItemCheckbox"
          label="Remove items from closet?" />
        <icon-info
          v-tippy="{ content: 'Checking this will remove all items from the category as well as your closet.' }"
          class="h-4 w-4" />
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="dialogStates.deleteCategoryDialog = false" />
      <gc-button
        :disabled="submitting"
        label="Remove Category"
        :loading="submitting"
        size="sm"
        variant="danger"
        @click="handleSubmit" />
    </template>
  </gc-modal>
</template>
