<script lang='ts' setup>
  import type { Database } from '@/types';
  import type { ExtendedCategory, ExtendedPack } from '@/types/helpers';

  const $store = useClosetStore();

  /**
   * Creates a new default category.
   */
  const $appStore = useAppStore();
  const submitting = ref(false);
  const createDefaultCategory = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: createdCategory, error } = await supabase
        .rpc('create_category_and_item', {
          p_items: [{
            consumable: false,
            generic_type: 'Miscellaneous',
            name: 'Miscellaneous',
            price: 0,
            quantity: 0,
            weight: 0,
            worn: false,
          }],
          p_name: 'Miscellaneous',
          p_pack_id: $store.data.selectedPack?.id as number,
        })
        .returns<ExtendedCategory>();

      if (createdCategory && !error) {
        ($store.data.selectedPack as ExtendedPack).categories.push(createdCategory);
        $appStore.notifyPositive('Category created successfully.');
      } else {
        $appStore.notifyNegative('There was an error creating the category.');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating the category.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <div>
    <gc-empty-state data-testid="pack-summary-empty-state">
      <typography
        class="mb-2 font-bold"
        variant="h5">
        Successfully created your new {{ $store.data.selectedPack?.name }} pack!
      </typography>
      <typography class="mb-0">
        The next step is to add some items to your pack.
      </typography>
      <typography class="mb-4">
        You can add items to your pack by clicking the Get Started button below or by uploading a CSV file.
      </typography>
      <div class="flex items-center justify-center gap-4">
        <button-root
          size="sm"
          @click="createDefaultCategory">
          Get started
        </button-root>
        <button-root
          size="sm"
          variant="outline"
          @click="$store.dialogStates.uploadCsvDialog = true">
          Upload CSV
        </button-root>
      </div>
    </gc-empty-state>
  </div>
</template>
