<script lang='ts' setup>
  import type { Database, Tables, TablesUpdate } from '@/types';
  import type { ExtendedCategory, ExtendedPack } from '@/types/closet';

  const $store = useClosetStore();

  /** Only the inline-editable category columns are ever emitted from the table. */
  interface UpdateCategoryPayload {
    id: number;
    field: 'name' | 'unit';
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
        pack_id: $store.data.selectedPack?.id as number,
        slug: '',
        unit: 'g',
        position: 1,
        created_at: new Date()
          .toISOString(),
        updated_at: new Date()
          .toISOString(),
        category_items: [],
      };

      $store.data.selectedPack?.categories.unshift(optimisticCategory);

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
      const { data: createdCategoryData, error: categoryError } = await supabase.rpc('create_category_and_item', {
        p_name: 'Category Name',
        p_pack_id: $store.data.selectedPack?.id as number,
        p_items: itemData,
      });
      if (categoryError) throw categoryError;

      // Update the category with the created category
      const createdCategory = createdCategoryData as ExtendedCategory;
      $store.data.selectedPack?.categories.splice(0, 1, { ...createdCategory });
    } catch {
      $store.data.selectedPack?.categories.shift();
      $appStore.notifyNegative('Error creating category');
    }
  };

  /**
   * Opens Add URL dialog for a category item.
   */
  const handleInitialAddUrl = (row: Tables<'items'>, categoryId: number) => {
    $store.dialogStates.addUrlDialog = true;
    $store.activeItem = row;
    $store.activeCategoryId = categoryId;
  };

  /**
   * Updates a category.
   */
  const submitting = ref(false);
  const updateCategory = async ({ id, field, value }: UpdateCategoryPayload) => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const patch: TablesUpdate<'categories'> = { [field]: value };
      const { data: updatedCategory, error } = await supabase
        .from('categories')
        .update(patch)
        .eq('id', id)
        .select();

      if (updatedCategory && !error) {
        const category = ($store.data.selectedPack as ExtendedPack).categories.find(c => c.id === id);

        if (category) {
          category[field] = value;
        }
        $appStore.notifyPositive('Category updated successfully.');
      } else {
        $appStore.notifyNegative('There was an error updating the category.');
      }
    } catch {
      $appStore.notifyNegative('There was an error updating the category.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <div :class="$store.isPublicRoute ? 'mt-0' : 'mt-10'">
    <div
      v-if="!$store.isPublicRoute"
      class="flex justify-between items-center mb-4">
      <typography
        class="font-semibold"
        variant="h4">
        Pack Details
      </typography>
      <button-root
        size="sm"
        variant="outline"
        @click="createDefaultCategory">
        <icon-plus class="w-4 h-4 text-primary dark:text-primary-light" />
        New Category
      </button-root>
    </div>
    <pack-items-table
      @handle-add-url="handleInitialAddUrl"
      @handle-remove-category="[
        $store.activeCategoryId = $event,
        $store.dialogStates.deleteCategoryDialog = true
      ]"
      @handle-remove-item="[
        $store.activeCategoryId = $event.category_id,
        $store.activeItem = $event.item,
        $store.dialogStates.removeItemDialog = true
      ]"
      @handle-update-category="[
        $store.activeCategoryId = $event.id,
        updateCategory($event)
      ]" />
  </div>
</template>
