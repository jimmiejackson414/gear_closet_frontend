<script lang='ts' setup>
  import { InfoIcon } from 'lucide-vue-next';
  import type { Database } from '@/types';
  import type { ExtendedPack } from '@/types/helpers';

  const $store = useClosetStore();
  const $appStore = useAppStore();
  const { data, dialogStates } = storeToRefs($store);
  const removeItemCheckbox = ref(false);
  const submitting = ref(false);

  /**
   * Remove item from pack
   */
  const handleSubmit = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      let closetError = null;

      // Remove item from category
      const { error } = await supabase
        .from('category_items')
        .delete()
        .match({ category_id: $store.activeCategoryId, item_id: $store.activeItem?.id });

      // If removeFromCloset is true, remove item from closet as well
      if (removeItemCheckbox.value) {
        const result = await supabase
          .from('items')
          .delete()
          .match({ id: $store.activeItem?.id });
        closetError = result.error;
      }

      if (!error && !closetError) {
        // Find the category
        const category = (data.value.selectedPack as ExtendedPack).categories.find(c => c.id === Number($store.activeCategoryId));

        if (category) {
          // Find the index of the category_item in the category
          const categoryItemIndex = category.category_items.findIndex(category_item => category_item.item.id === Number($store.activeItem?.id));

          // Remove the category_item from the category
          if (categoryItemIndex !== -1) {
            category.category_items.splice(categoryItemIndex, 1);
          }
        }
        $appStore.notifyPositive('Item removed successfully.');
      } else {
        $appStore.notifyNegative('There was an error removing the item.');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error removing the item.');
    } finally {
      submitting.value = false;
      dialogStates.value.removeItemDialog = false;
      $store.activeItem = undefined;
      $store.activeCategoryId = undefined;
    }
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.removeItemDialog"
    title="Remove from Category"
    @handle-cancel="[ dialogStates.removeItemDialog = false, removeItemCheckbox = false ]">
    <template #content>
      <div>
        <p class="font-bold mb-0 text-base">
          Are you sure you want to remove this item from the category?
        </p>
        <p class="!font-bold mb-4 text-base text-danger">
          This action cannot be undone!
        </p>
      </div>
      <div class="flex items-center gap-4">
        <gc-checkbox
          id="remove-item-checkbox"
          v-model="removeItemCheckbox"
          label="Remove from closet?" />
        <info-icon
          v-tippy="{ content: 'Checking this will remove the item from your closet as well.' }"
          class="h-4 w-4" />
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="[ dialogStates.removeItemDialog = false, removeItemCheckbox = false ]" />
      <gc-button
        :disabled="submitting"
        label="Remove Item"
        :loading="submitting"
        size="sm"
        variant="danger"
        @click="handleSubmit" />
    </template>
  </gc-modal>
</template>
