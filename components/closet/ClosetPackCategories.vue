<script lang='ts' setup>
  import { PlusIcon } from 'lucide-vue-next';
  import type { ExtendedCategory, ExtendedPack } from '@/types/helpers';
  import type { Database, Tables, TablesInsert } from '@/types';

  const $store = useClosetStore();
  const { data, dialogStates } = storeToRefs($store);
  const activeCategoryId = ref<number | null>(null);

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
        unit: '',
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
  const activeRow = ref<RowItem | undefined>(undefined);
  const handleInitialAddUrl = (row: RowItem, categoryId: number) => {
    dialogStates.value.addUrlDialog = true;
    activeRow.value = row;
    activeCategoryId.value = categoryId;
  };
  watch(() => dialogStates.value.addUrlDialog, (newVal) => {
    newVal ? nextTick(() => newUrl.value = activeRow.value?.url || '') : newUrl.value = '';
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
        .eq('id', activeCategoryId.value as number)
        .select();

      if (updatedCategory && !error) {
        // Find the category
        const category = (data.value.selectedPack as ExtendedPack).categories.find(c => c.id === Number(activeCategoryId.value));

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
      <h6 class="text-xl">
        Pack Details
      </h6>
      <gc-button
        outlined
        size="sm"
        @click="createDefaultCategory">
        <plus-icon class="h-4 mr-2 text-primary w-4" />
        Add Category
      </gc-button>
    </div>
    <pack-items-table
      v-for="item in data.selectedPack?.categories"
      :key="item.id"
      :category="item"
      @handle-add-url="handleInitialAddUrl"
      @handle-remove-category="[ activeCategoryId = item.id, dialogStates.deleteCategoryDialog = true ]"
      @handle-remove-item="[ activeCategoryId = item.id, activeRow = $event, dialogStates.removeItemDialog = true ]"
      @handle-update-category="($event: UpdateCategoryPayload) => { activeCategoryId = item.id, updateCategory($event) }" />
  </div>
</template>
