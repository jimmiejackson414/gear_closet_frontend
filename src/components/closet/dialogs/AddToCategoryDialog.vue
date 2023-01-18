<template>
  <q-dialog
    :model-value="props.isOpen"
    class="update-item-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-form @submit.prevent.stop="handleUpdate">
        <q-card-section class="header">
          <div class="row align-center">
            <h6 class="text-h6 q-ma-none">
              Update Item
            </h6>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 q-col-gutter-sm">
              <!-- Name -->
              <q-input
                v-model="data.name"
                outlined
                dense
                :disable="isSubmitting"
                label="Name">
                <template #prepend>
                  <q-icon name="bi-fonts" />
                </template>
              </q-input>
              <!-- Generic Type -->
              <q-input
                v-model="data.generic_type"
                outlined
                dense
                :disable="isSubmitting"
                label="Item Type">
                <template #prepend>
                  <q-icon name="bi-fonts" />
                </template>
              </q-input>
              <!-- Add to category -->
              <q-select
                v-model="category"
                :options="options"
                label="Add to category"
                outlined
                dense
                clearable
                hide-bottom-space
                dropdown-icon="bi-chevron-down">
                <template #prepend>
                  <q-icon name="bi-plus-circle" />
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-between">
          <q-btn
            unelevated
            :ripple="false"
            flat
            text-color="text"
            label="Cancel"
            @click="emit('handleClose')" />
          <q-btn
            unelevated
            :ripple="false"
            color="primary"
            label="Update"
            type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import {
    computed, ref, reactive, watchEffect,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/stores/app';
  import { useClosetStore } from '@/stores/closet';
  import { Category, Item } from '@/generated/types';

  // define props
  const props = defineProps<{
    isOpen: boolean;
    item: Item | null;
  }>();

  // instantiate stores
  const appStore = useAppStore();
  const store = useClosetStore();

  // define emits
  const emit = defineEmits(['handleClose']);

  // local data
  const isSubmitting = ref(false);
  const data = reactive({
    name: props.item?.name || '',
    generic_type: props.item?.generic_type || '',
  });
  const category = ref<any>(null);
  const { selectedPack } = storeToRefs(store);

  const options = computed(() => {
    const categories = selectedPack.value?.categories as Category[];
    return categories.map(c => ({
      label: c.name,
      value: c.id,
    }));
  });

  // update item and add to category if necessary
  const handleUpdate = async (): Promise<void> => {
    isSubmitting.value = true;

    // if adding to category
    if (category.value) {
      await store.addItemToCategory(category.value.value, props.item?.id as number);
    }

    // update item
    const payload = { id: props.item?.id as number, input: { ...data } };
    await store.updateItem(payload);

    // close modal and notify of update
    emit('handleClose');
    appStore.notifyPositive('Item updated');
    isSubmitting.value = false;
  };

  watchEffect(() => {
    if (!props.isOpen) {
      data.name = '';
      data.generic_type = '';
      category.value = null;
    }
  });
</script>

<style lang='scss' scoped>
  .q-card {
    border-top: 5px solid $primary;
  }
</style>
