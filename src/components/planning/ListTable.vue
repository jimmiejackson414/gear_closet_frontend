<template>
  <q-table
    v-if="data?.length"
    :rows="data"
    :columns="columns"
    row-key="id"
    flat
    hide-header
    hide-bottom
    hide-selected-banner
    hide-pagination
    separator="horizontal"
    card-class="todos-table"
    style="max-height: 300px;"
    virtual-scroll
    :rows-per-page-options="[0]">
    <template #body="rows">
      <q-tr
        :props="rows"
        class="item-row">
        <q-td
          key="completed"
          :props="rows">
          <q-checkbox
            v-model="rows.row.completed"
            :ripple="false"
            color="green-4"
            @update:model-value="handleUpdate(rows.row)" />
        </q-td>
        <q-td
          key="title"
          :props="rows">
          <InlineEdit
            :model="rows.row"
            field="title"
            hide-edit-btn
            @handle-update="handleUpdate">
            <p class="text-body2 q-mb-none">
              {{ rows.row.title }}
            </p>
          </InlineEdit>
        </q-td>
        <q-td
          v-if="columns?.length === 3"
          key="quantity"
          :props="rows">
          <InlineEdit
            :model="rows.row"
            field="quantity"
            hide-edit-btn
            type="number"
            :slot-styles="{ width: 'fit-content', marginLeft: '25%' }"
            :input-styles="{ maxWidth: 'fit-content' }"
            @handle-update="handleUpdate">
            <p class="text-body2 q-mb-none">
              {{ rows.row.quantity }}
            </p>
          </InlineEdit>
        </q-td>
        <q-td class="text-right">
          <q-btn
            icon="bi-trash3"
            color="negative"
            class="delete-btn"
            flat
            rounded
            size="sm"
            @click="handleDelete(rows.row)" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <q-list v-else>
    <q-item>
      <q-item-section class="text-center">
        <q-item-label>{{ noDataMessage }}</q-item-label>
        <q-item-label>Click on the <b>Add</b> button to get started.</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang='ts' setup>
  import { QTableProps } from 'quasar';
  import InlineEdit from '@/components/common/InlineEdit.vue';

  interface Props {
    data: any[];
    columns: QTableProps['columns'];
    noDataMessage: string;
  }

  defineProps<Props>();

  const emit = defineEmits(['handleUpdate', 'handleDelete']);

  const handleUpdate = (row: any): void => {
    emit('handleUpdate', row);
  };

  const handleDelete = (row: any): void => {
    emit('handleDelete', row);
  };
</script>

<style lang="scss" scoped>
  .item-row {
    .delete-btn {
      opacity: 0;
      transition: 0.2s opacity $cubic-bezier;
    }

    &:hover {
      .delete-btn {
        opacity: 1;
      }
    }
  }
</style>
