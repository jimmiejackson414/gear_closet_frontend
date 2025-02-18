<script lang='ts' setup>
  import type { Database, Tables } from '@/types';
  import type { ExtendedCategory, ExtendedPack } from '@/types/helpers';

  const $store = useClosetStore();

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
        category_items: [],
        created_at: new Date()
          .toISOString(),
        id: 0, // temporary id
        name: '',
        pack_id: $store.data.selectedPack?.id as number,
        position: 1,
        slug: '',
        unit: 'g',
        updated_at: new Date()
          .toISOString(),
      };

      $store.data.selectedPack?.categories.unshift(optimisticCategory);

      // This is the item data for the optimistic update
      const itemData = [{
        consumable: false,
        generic_type: 'Description',
        name: 'New Item',
        price: 0,
        quantity: 1,
        slug: '',
        weight: "0",
        worn: false,
      }];

      const supabase = useSupabaseClient<Database>();
      const { data: createdCategory, error: categoryError } = await supabase.rpc('create_category_and_item', {
        p_items: itemData,
        p_name: 'Category Name',
        p_pack_id: $store.data.selectedPack?.id as number,
      })
        .returns<ExtendedCategory>();
      if (categoryError) throw categoryError;

      // Update the category with the created category
      $store.data.selectedPack?.categories.splice(0, 1, { ...createdCategory });
    } catch (err) {
      $store.data.selectedPack?.categories.shift();
      $appStore.notifyNegative('Error creating category');
    }
  };

  /**
   * Adds a new URL to a category.
   */
  const newUrl = ref('');
  const handleInitialAddUrl = (row: Tables<'items'>, categoryId: number) => {
    $store.dialogStates.addUrlDialog = true;
    $store.activeItem = row;
    $store.activeCategoryId = categoryId;
  };
  watch(() => $store.dialogStates.addUrlDialog, (newVal) => {
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
        .eq('id', $store.activeCategoryId as number)
        .select();

      if (updatedCategory && !error) {
        const category = ($store.data.selectedPack as ExtendedPack).categories.find(c => c.id === Number($store.activeCategoryId));

        if (category) {
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
  <div :class="$store.isPublicRoute ? 'mt-0' : 'mt-10'">
    <div
      v-if="!$store.isPublicRoute"
      class="mb-4 flex items-center justify-between">
      <typography
        class="font-semibold"
        variant="h4">
        Pack Details
      </typography>
      <button-root
        size="sm"
        variant="outline"
        @click="createDefaultCategory">
        <icon-plus class="size-4 text-primary dark:text-primary-light" />
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
