<script lang='ts' setup>
  import type { RowItem } from './PackItemsTable.vue';
  import type { Database } from '@/types';
  import type { ExtendedCategory, ExtendedPack } from '@/types/helpers';

  const $store = useClosetStore();
  const { activeCategoryId, activeItem, data, dialogStates } = storeToRefs($store);

  interface UpdateCategoryPayload {
    field: keyof ExtendedCategory;
    value: string;
  }

  /**
   * Optimistically creates a category.
   */
  const $appStore = useAppStore();
  const createDefaultCategory = async () => {
    try {
      // This is the category for the optimistic update
      const optimisticCategory = {
        id: 0, // temporary id
        name: '',
        pack_id: data.value.selectedPack?.id as number,
        slug: '',
        unit: 'g',
        position: 1,
        created_at: new Date()
          .toISOString(),
        updated_at: new Date()
          .toISOString(),
        category_items: [],
      };

      data.value.selectedPack?.categories.unshift(optimisticCategory);

      // This is the item data for the optimistic update
      const itemData = [{
        name: 'New Item',
        generic_type: 'Description',
        weight: "0",
        quantity: 1,
        price: 0,
        consumable: false,
        worn: false,
        slug: '',
      }];

      const supabase = useSupabaseClient<Database>();
      const { data: createdCategory, error: categoryError } = await supabase.rpc('create_category_and_item', {
        p_name: 'Category Name',
        p_pack_id: data.value.selectedPack?.id as number,
        p_items: itemData,
      })
        .returns<ExtendedCategory>();
      if (categoryError) throw categoryError;

      // Update the category with the created category
      data.value.selectedPack?.categories.splice(0, 1, { ...createdCategory });
    } catch (err) {
      data.value.selectedPack?.categories.shift();
      $appStore.notifyNegative('Error creating category');
    }
  };

  /**
   * Adds a new URL to a category.
   */
  const newUrl = ref('');
  const handleInitialAddUrl = (row: RowItem, categoryId: number) => {
    dialogStates.value.addUrlDialog = true;
    $store.activeItem = row;
    $store.activeCategoryId = categoryId;
  };
  watch(() => dialogStates.value.addUrlDialog, (newVal) => {
    newVal ? nextTick(() => newUrl.value = $store.activeItem?.url || '') : newUrl.value = '';
  });

  /**
   * Updates a category.
   */
  const submitting = ref(false);
  const updateCategory = async ({ field, value }: UpdateCategoryPayload) => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: updatedCategory, error } = await supabase
        .from('categories')
        .update({
          [field]: value,
        })
        .eq('id', activeCategoryId?.value as number)
        .select();

      if (updatedCategory && !error) {
        // Find the category
        const category = (data.value.selectedPack as ExtendedPack).categories.find(c => c.id === Number(activeCategoryId?.value));

        if (category) {
          // Update the category
          category[field] = value;
        }
        $appStore.notifyPositive('Category updated successfully.');
      } else {
        $appStore.notifyNegative('There was an error updating the category.');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the category.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <div class="mt-10">
    <div class="flex justify-between items-center mb-4">
      <typography
        class="font-semibold"
        variant="h4">
        Pack Details
      </typography>
      <button-root
        size="sm"
        variant="outline"
        @click="createDefaultCategory">
        <icon-plus class="h-4 text-primary dark:text-primary-light w-4" />
        Add Category
      </button-root>
    </div>
    <pack-items-table
      @handle-add-url="handleInitialAddUrl"
      @handle-remove-category="[
        activeCategoryId = $event,
        dialogStates.deleteCategoryDialog = true
      ]"
      @handle-remove-item="[
        activeCategoryId = $event.meta.category.id,
        activeItem = $event,
        dialogStates.removeItemDialog = true
      ]"
      @handle-update-category="[
        activeCategoryId = $event.id,
        updateCategory($event)
      ]" />
  </div>
</template>
