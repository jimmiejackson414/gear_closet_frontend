<script lang='ts' setup>
  import type { Database } from '@/types';
  import type { ExtendedPack } from '@/types/helpers';

  const $store = useClosetStore();
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

      // If removeFromCloset is true, remove items from closet as well
      if (removeItemCheckbox.value) {
        const { data: deletedCategoryItems, error: categoryItemsError } = await supabase
          .from('category_items')
          .delete()
          .match({ category_id: $store.activeCategoryId })
          .select();

        const { error: removeItemsError } = await supabase
          .from('items')
          .delete()
          .in('id', deletedCategoryItems?.map((ci: any) => ci.item_id) || []);

        closetError = categoryItemsError || removeItemsError;
      }

      // Remove category from pack
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', $store.activeCategoryId as number);

      if (!error && !closetError) {
        // Find the index of the category in the pack
        const categoryIndex = ($store.data.selectedPack as ExtendedPack).categories.findIndex(c => c.id === $store.activeCategoryId);

        // Remove the category from the pack
        if (categoryIndex !== -1) {
          ($store.data.selectedPack as ExtendedPack).categories.splice(categoryIndex, 1);
        }
        $appStore.notifyPositive(`Category ${removeItemCheckbox.value ? 'and its items' : ''} removed successfully.`);
        $store.dialogStates.deleteCategoryDialog = false;
      } else {
        $appStore.notifyNegative('There was an error removing the category or its items.');
      }
    } catch {
      $appStore.notifyNegative('There was an error removing the category.');
    } finally {
      submitting.value = false;
      isRemoveCategoryModalOpen.value = false;
    }
  };

  const handleClose = () => {
    $store.dialogStates.deleteCategoryDialog = false;
    removeItemCheckbox.value = false;
    $store.activeCategoryId = undefined;
  };
</script>

<template>
  <dialog-root v-model:open="$store.dialogStates.deleteCategoryDialog">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-112.5 lg:max-w-162.5"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>
          Remove Category from Pack
        </dialog-title>
        <dialog-description>
          <typography class="mb-4">
            Are you sure you want to remove this category from your pack? The items within this category will still remain in your closet. <span class="font-bold">This action cannot be undone!</span>
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
                Remove items from closet?
              </label>
              <icon-info
                v-tippy="{ content: 'Checking this will additionally remove all items associated with this category from your closet.' }"
                class="h-4 w-4" />
            </div>
          </div>
        </dialog-description>
      </dialog-header>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="handleClose">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          variant="destructive"
          @click="handleSubmit">
          Remove Category
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
