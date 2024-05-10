<script lang='ts' setup>
  import type { Database } from '@/types';
  import type { ExtendedCategory, ExtendedPack } from '@/types/helpers';

  const $store = useClosetStore();
  const { data, dialogStates, pageLoading } = storeToRefs($store);

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
          p_name: 'Miscellaneous',
          p_pack_id: data.value.selectedPack?.id as number,
          p_items: [{
            name: 'Miscellaneous',
            generic_type: 'Miscellaneous',
            weight: 0,
            quantity: 0,
            price: 0,
            consumable: false,
            worn: false,
          }],
        })
        .returns<ExtendedCategory>();

      if (createdCategory && !error) {
        (data.value.selectedPack as ExtendedPack).categories.push(createdCategory);
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
  <div v-if="data.selectedPack && !pageLoading">
    <div v-if="!data.selectedPack.categories?.length">
      <gc-empty-state data-testid="pack-summary-empty-state">
        <h5 class="font-bold mb-2 text-base-lg">
          Successfully created your new {{ data.selectedPack.name }} pack!
        </h5>
        <p class="mb-0 text-base">
          The next step is to add some items to your pack.
        </p>
        <p class="mb-4 text-base">
          You can add items to your pack by clicking the Get Started button below or by uploading a CSV file.
        </p>
        <div class="flex justify-center items-center gap-4">
          <gc-button
            label="Get started"
            size="sm"
            @click="createDefaultCategory" />
          <gc-button
            label="Upload CSV"
            outlined
            size="sm"
            @click="dialogStates.uploadCsvDialog = true" />
        </div>
      </gc-empty-state>
    </div>
    <div v-else>
      <div
        class="card card-main"
        data-testid="pack-summary-widget">
        <div class="grid lg:grid-cols-[60%,40%] grid-cols-1 gap-6 pt-4">
          <closet-pack-chart />
          <closet-pack-details />
        </div>
      </div>
      <closet-pack-categories />
    </div>
  </div>
</template>
