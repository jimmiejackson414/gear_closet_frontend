<template>
  <q-drawer
    ref="itemsDrawer"
    :model-value="itemsDrawerOpen"
    side="left"
    :overlay="true"
    class="items-drawer"
    @before-show="fetchAllItems">
    <p class="text-h6 text-weight-bold">
      All Items
    </p>
    <div
      v-if="loading"
      class="loading-wrapper">
      <q-circular-progress
        indeterminate
        size="50px"
        color="primary"
        class="q-ma-md" />
    </div>
    <div
      v-else
      class="items-wrapper">
      <q-input
        v-model.trim="search"
        debounce="500"
        outlined
        dense
        :loading="loading"
        label="Search"
        type="search"
        clear-icon="bi-x"
        @update:model-value="handleSearch">
        <template #append>
          <q-btn
            v-if="search"
            :ripple="false"
            flat
            dense
            round
            icon="bi-x"
            @click="handleReset" />
        </template>
      </q-input>
      <q-separator class="q-mt-md" />
      <q-list>
        <q-item
          v-for="item in filteredItems"
          :key="item.id">
          <q-item-section>
            <q-item-label>
              {{ item.name ?? 'Unnamed' }}
            </q-item-label>
            <q-item-label caption>
              {{ item.generic_type }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            class="actions">
            <q-btn
              :ripple="false"
              flat
              dense
              round
              icon="bi-pencil"
              size="0.75rem"
              @click="handleAddToCategoryDialog(item)" />
            <q-btn
              :ripple="false"
              flat
              dense
              round
              size="0.75rem"
              icon="bi-trash"
              @click="handleAlertDialog(item)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-drawer>
  <AlertDialog
    :is-open="alertIsOpen"
    title="Delete Item"
    btn-text="Delete"
    alert-color="negative"
    btn-color="red-9"
    has-cancel-btn
    @handle-close="handleCloseAlertDialog"
    @handle-continue="handleDeleteItem">
    <template #content>
      <p class="text-body1">
        Are you sure you want to delete this item?
      </p>
      <p class="text-body1">
        This will <strong>permanently</strong> delete this item from your Closet and cannot be undone.
      </p>
    </template>
  </AlertDialog>
  <AddToCategoryDialog
    :is-open="addToCategoryDialogOpen"
    :item="selectedItem"
    @handle-close="handleCloseAddToCategory" />
</template>

<script lang='ts' setup>
  import { defineAsyncComponent, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { onClickOutside } from '@vueuse/core';
  import { useAppStore } from '@/stores/app';
  import { useClosetStore } from '@/stores/closet';
  import { Item } from '@/generated/types';

  const AlertDialog = defineAsyncComponent(() => import('@/components/common/dialogs/AlertDialog.vue'));
  const AddToCategoryDialog = defineAsyncComponent(() => import('@/components/closet/dialogs/AddToCategoryDialog.vue'));

  const $appStore = useAppStore();
  const store = useClosetStore();
  const { allItems, itemsDrawerOpen } = storeToRefs(store);
  const itemsDrawer = ref(null);
  const loading = ref(false);
  const search = ref('');
  const filteredItems = ref<Item[]>([]);
  const alertIsOpen = ref(false);
  const addToCategoryDialogOpen = ref(false);
  const selectedItem = ref<Item | null>(null);

  onClickOutside(itemsDrawer, () => {
    itemsDrawerOpen.value = false;
    search.value = '';
  });

  // Fetch all items
  const fetchAllItems = async (): Promise<void> => {
    loading.value = true;
    await store.fetchAllItems();
    filteredItems.value = allItems.value;
    loading.value = false;
  };

  // Reset drawer
  const handleReset = (): void => {
    search.value = '';
    filteredItems.value = allItems.value;
  };

  // Search items
  const handleSearch = async (): Promise<void> => {
    loading.value = true;

    const filtered = allItems.value.filter(
      item => item.name?.toLowerCase()
        .includes(search.value.toLowerCase())
        || item.generic_type?.toLowerCase()
          .includes(search.value.toLowerCase()),
    );

    filteredItems.value = filtered;
    loading.value = false;
  };

  // Set alert dialog open state
  const handleAlertDialog = (item: Item): void => {
    selectedItem.value = item;
    alertIsOpen.value = true;
  };

  // Close alert dialog
  const handleCloseAlertDialog = (): void => {
    alertIsOpen.value = false;
    selectedItem.value = null;
  };

  // Set add to category dialog open state
  const handleAddToCategoryDialog = (item: Item): void => {
    selectedItem.value = item;
    addToCategoryDialogOpen.value = true;
  };

  // Close add to category dialog
  const handleCloseAddToCategory = (): void => {
    addToCategoryDialogOpen.value = false;
    selectedItem.value = null;
  };

  // Handle delete item from closet
  const handleDeleteItem = (): void => {
    store.deleteItem(selectedItem.value?.id as number);
    alertIsOpen.value = false;
    $appStore.notifyPositive('Item deleted');
  };
</script>

<style lang='scss'>
  .items-drawer {
    box-shadow: 2px 0 20px 0 rgb(0 0 0 / 20%);
    padding: 36px 1rem;

    .loading-wrapper {
      display: flex;
      justify-content: center;
    }

    .actions {
      flex-direction: row;
      justify-content: flex-end;
    }
  }
</style>
