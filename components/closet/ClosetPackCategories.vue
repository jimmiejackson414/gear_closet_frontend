<script lang='ts' setup>
  import type { Database, Tables, TablesInsert } from '@/types';
  import type { ExtendedCategory, ExtendedPack } from '@/types/helpers';

  const $store = useClosetStore();
  const { activeCategoryId, activeItem, data, dialogStates } = storeToRefs($store);

  interface UpdateCategoryPayload {
    field: keyof ExtendedCategory;
    value: string;
  }

  interface RowItem extends Tables<'items'> {
    category_item_id: number;
    position: number;
  }

  /**
   * Optimistically creates a category.
   */
  const $appStore = useAppStore();
  const createDefaultCategory = async () => {
    try {
      // This is the category for the server request
      const newCategory: TablesInsert<'categories'> = {
        name: '',
        pack_id: data.value.selectedPack?.id as number,
      };

      // This is the category for the optimistic update
      const optimisticCategory = {
        name: '' as string,
        pack_id: data.value.selectedPack?.id as number,
        slug: '',
        unit: 'g',
        id: 0, // or some temporary id
        created_at: new Date()
          .toISOString(),
        updated_at: new Date()
          .toISOString(),
        category_items: [],
      };

      data.value.selectedPack?.categories.unshift(optimisticCategory);

      const supabase = useSupabaseClient<Database>();
      const { data: createdCategory, error: categoryError } = await supabase.from('categories')
        .insert([newCategory])
        .select();
      if (categoryError) throw categoryError;

      // replace the temporary category with the new category
      const newCategoryWithId = {
        ...optimisticCategory,
        id: createdCategory[0].id,
      };
      data.value.selectedPack?.categories.splice(0, 1, newCategoryWithId);
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
  const updateCategory = debounce(async ({ field, value }: UpdateCategoryPayload) => {
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
  }, 300);
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
        activeCategoryId = $event.category_id,
        activeItem = $event,
        dialogStates.removeItemDialog = true
      ]"
      @handle-update-category="[
        activeCategoryId = $event.id,
        updateCategory($event)
      ]" />
  </div>
</template>
