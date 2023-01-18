<template>
  <q-card
    id="shopping-widget"
    class="widget box-shadow-light aside">
    <div v-if="loading">
      <ChecklistSkeleton
        v-for="i in [0,1,2]"
        :key="`shopping-${i}`" />
    </div>
    <div v-else>
      <q-card-section class="header">
        <q-icon
          name="bi-bag-check-fill"
          color="primary"
          size="sm" />
        <p class="text-body1 title">
          Shopping
        </p>
        <q-btn
          round
          color="primary"
          size="sm"
          unelevated
          :ripple="false"
          icon="bi-plus-lg"
          @click="handleCreate" />
      </q-card-section>
      <q-tabs
        v-model="tab"
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-6"
        align="justify"
        :breakpoint="0">
        <q-tab
          name="you"
          :ripple="false"
          :label="`You (${userItems.length || 0})`" />
        <q-tab
          name="group"
          :ripple="false"
          :label="`Group (${groupItems.length || 0})`" />
      </q-tabs>
      <q-separator />
      <q-tab-panels
        v-model="tab"
        class="todos-panels"
        animated
        transition-next="jump-right"
        transition-prev="jump-left">
        <q-tab-panel
          name="you"
          class="q-pt-none">
          <ListTable
            :data="userItems"
            :columns="columns"
            no-data-message="You haven't created any Todos yet!"
            @handle-delete="handleDelete"
            @handle-update="handleUpdate" />
        </q-tab-panel>
        <q-tab-panel
          name="group"
          class="q-pt-none">
          <ListTable
            :data="groupItems"
            :columns="columns"
            no-data-message="You haven't created any Shopping Items yet!"
            @handle-delete="handleDelete"
            @handle-update="handleUpdate" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-card>
</template>

<script lang='ts' setup>
  import { computed, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { QTableProps } from 'quasar';
  import { usePlanningStore } from '@/stores/planning';
  import { CreateShoppingItemInput, ResourceType, ShoppingItem } from '@/generated/types';
  import ChecklistSkeleton from './loading/ChecklistSkeleton.vue';
  import ListTable from './ListTable.vue';

  const store = usePlanningStore();
  const { loading, shoppingItems, selectedTrip } = storeToRefs(store);
  const tab = ref('you');

  const columns = [
    {
      name: 'completed', label: 'Completed', field: 'quantity', align: 'left', sortable: true, style: 'width: 40px',
    },
    {
      name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true,
    },
    {
      name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center', sortable: true,
    },
  ] as QTableProps['columns'];

  const userItems = computed(() => shoppingItems.value.filter(item => item.resource_type === ResourceType.User));

  const groupItems = computed(() => shoppingItems.value.filter(item => item.resource_type === ResourceType.Group));

  // handle creating new detail
  const handleCreate = async (): Promise<void> => {
    const newItem = {
      title: 'New Item',
      completed: false,
      quantity: 0,
      trip_id: selectedTrip.value?.id,
      resource_type: tab.value === 'you' ? ResourceType.User : ResourceType.Group,
    } as CreateShoppingItemInput;

    await store.createShoppingItem(newItem);
  };

  const handleDelete = async (item: ShoppingItem): Promise<void> => {
    await store.deleteShoppingItem(item.id);
  };

  const handleUpdate = (item: ShoppingItem): void => {
    const payload = { ...item };
    delete payload.created_at;
    delete payload.updated_at;

    store.updateShoppingItem(payload);
  };
</script>

<style lang='scss'>
  @import "@/css/planning/aside";

  .shopping-list-table {
    background-color: transparent;

    .q-table {
      td {
        color: $text;
      }
    }
  }
</style>
