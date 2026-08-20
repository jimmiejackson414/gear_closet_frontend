<script lang='ts' setup>
  import type { Database } from '@/types';
  import type { ExtendedPack } from '@/types/closet';

  const $store = useClosetStore();
  const $appStore = useAppStore();
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
        const category = ($store.data.selectedPack as ExtendedPack).categories.find(c => c.id === Number($store.activeCategoryId));

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
    } catch {
      $appStore.notifyNegative('There was an error removing the item.');
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    submitting.value = false;
    $store.activeItem = undefined;
    $store.activeCategoryId = undefined;
    removeItemCheckbox.value = false;
    $store.dialogStates.removeItemDialog = false;
  };
</script>

<template>
  <alert-dialog v-model:open="$store.dialogStates.removeItemDialog">
    <alert-dialog-content
      class="max-h-[90dvh] sm:max-w-112.5 lg:max-w-162.5"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <alert-dialog-header>
        <alert-dialog-title>
          Remove from Category
        </alert-dialog-title>
        <alert-dialog-description>
          <typography class="mb-4">
            Are you sure you want to remove this item from the category? <span class="font-bold">This action cannot be undone!</span>
          </typography>
          <div class="flex items-center gap-x-2">
            <checkbox
              id="accept-checkbox"
              v-model="removeItemCheckbox"
              variant="destructive" />
            <div class="flex items-center gap-1.5 leading-none">
              <label
                class="font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive text-sm"
                for="accept-checkbox">
                Remove from closet?
              </label>
              <icon-info
                v-tippy="{ content: 'Checking this will additionally remove the item from your closet.' }"
                class="h-4 w-4" />
            </div>
          </div>
        </alert-dialog-description>
      </alert-dialog-header>
      <alert-dialog-footer>
        <alert-dialog-cancel
          :disabled="submitting"
          @click="handleClose">
          Cancel
        </alert-dialog-cancel>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          variant="destructive"
          @click="handleSubmit">
          Remove Item
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>
