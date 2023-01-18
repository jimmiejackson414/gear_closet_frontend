<template>
  <q-table
    class="category-table box-shadow-light"
    :rows="rows"
    :columns="columns"
    row-key="name"
    flat
    hide-selected-banner
    hide-pagination
    separator="horizontal"
    virtual-scroll
    :rows-per-page-options="[0]">
    <template #top-left>
      <InlineEdit
        :model="category"
        field="name"
        hide-edit-btn
        :slot-styles="{ minHeight: '1.5rem' }"
        @handle-update="cat => handleUpdateCategory(cat, 'name', cat.name)">
        <h6 class="text-h6 q-ma-none">
          {{ category.name || 'Unnamed category' }}
        </h6>
      </InlineEdit>
    </template>
    <template #top-right>
      <q-btn
        flat
        rounded
        size="sm"
        class="q-pa-none remove-cat-btn"
        icon="bi-trash"
        @click="handleDeleteCategory" />
    </template>
    <template #header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="text-weight-bold">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td class="drag-handle">
          <q-icon name="bi-grip-vertical" />
        </q-td>
        <q-td>
          <InlineEdit
            :model="props.row"
            field="generic_type"
            hide-edit-btn
            :slot-styles="{ minHeight: '1.5rem' }"
            @handle-update="item => handleUpdateItem(props.row, 'generic_type', item.generic_type)">
            {{ props.row.generic_type }}
          </InlineEdit>
        </q-td>
        <q-td>
          <InlineEdit
            :model="props.row"
            field="name"
            hide-edit-btn
            :slot-styles="{ minHeight: '1.5rem' }"
            @handle-update="item => handleUpdateItem(props.row, 'name', item.name)">
            {{ props.row.name }}
          </InlineEdit>
        </q-td>
        <q-td class="consumable-wrapper text-center">
          <q-btn
            round
            size="sm"
            :ripple="false"
            :class="{ active: props.row.consumable }"
            @click="() => handleUpdateItem(props.row, 'consumable', !props.row.consumable)">
            <span class="material-icons">
              restaurant
            </span>
          </q-btn>
        </q-td>
        <q-td class="worn-wrapper text-center">
          <q-btn
            round
            size="sm"
            :ripple="false"
            :class="{ active: props.row.worn }"
            @click="() => handleUpdateItem(props.row, 'worn', !props.row.worn)">
            <span class="material-icons">
              checkroom
            </span>
          </q-btn>
        </q-td>
        <q-td class="text-center flex items-center justify-center">
          <InlineEdit
            :model="props.row"
            field="weight"
            hide-edit-btn
            :slot-styles="{ minHeight: '1.5rem' }"
            @handle-update="item => handleUpdateItem(props.row, 'weight', item.weight)">
            {{ props.row.weight }}
          </InlineEdit>
          <q-select
            v-model="props.row.unit"
            :options="options"
            borderless
            dense
            hide-bottom-space
            class="q-ml-xs unit-select"
            @update:model-value="val => handleUpdateItem(props.row, 'unit', val)" />
        </q-td>
        <q-td class="text-center">
          <InlineEdit
            :model="props.row"
            field="price"
            hide-edit-btn
            :slot-styles="{ justifyContent: 'center', minHeight: '1.5rem' }"
            @handle-update="item => handleUpdateItem(props.row, 'price', item.price)">
            {{ convertCurrency(props.row.price) }}
          </InlineEdit>
        </q-td>
        <q-td class="text-center">
          <InlineEdit
            :model="props.row"
            field="quantity"
            hide-edit-btn
            type="number"
            :slot-styles="{ justifyContent: 'center', minHeight: '1.5rem' }"
            @handle-update="item => handleUpdateItem(props.row, 'quantity', item.quantity)">
            {{ props.row.quantity }}
          </InlineEdit>
        </q-td>
        <q-td class="text-right">
          <q-btn
            flat
            rounded
            :class="[ 'q-pa-none', 'q-mr-md', 'link-btn', { 'has-value': !!props.row.url } ]"
            icon="bi-link-45deg"
            @click="() => handleItemLink(props.row)">
            <q-tooltip>Add link</q-tooltip>
          </q-btn>
          <q-btn
            flat
            rounded
            class="q-pa-none remove-btn"
            icon="bi-x"
            @click="() => handleRemove(props.row)">
            <q-tooltip>Remove from category</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
    <template #bottom-row>
      <q-tr class="totals-row">
        <q-td colspan="1" />
        <q-td
          colspan="4"
          class="text-left">
          <p class="text-body2 text-weight-bold q-mb-none">
            Totals
          </p>
        </q-td>
        <q-td
          colspan="1"
          class="text-center flex items-center justify-center">
          <p class="text-body2 text-weight-bold q-mb-none">
            {{ computedWeightTotal }}
          </p>
          <q-select
            :model-value="tableProps.category.unit"
            :options="options"
            borderless
            dense
            hide-bottom-space
            class="q-ml-xs unit-select"
            @update:model-value="val => handleUpdateCategory(tableProps.category, 'unit', val)" />
        </q-td>
        <q-td
          colspan="1"
          class="text-center">
          <p class="text-body2 text-weight-bold q-mb-none">
            {{ computedPriceTotal }}
          </p>
        </q-td>
        <q-td
          colspan="1"
          class="text-center">
          <p class="text-body2 text-weight-bold q-mb-none">
            {{ computedQuantityTotal }}
          </p>
        </q-td>
        <q-td colspan="1" />
      </q-tr>
    </template>
    <template #bottom>
      <div class="text-left q-ml-xl">
        <q-btn
          size="sm"
          :ripple="false"
          color="primary"
          outline
          @click="handleCreateItem">
          <q-icon name="bi-plus" />
          Add item
        </q-btn>
      </div>
    </template>
  </q-table>
</template>

<script lang='ts' setup>
  import {
    nextTick, ref, watchEffect, computed,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import convert, { Mass } from 'convert';
  import { useClosetStore } from '@/stores/closet';
  import { Category, Item } from '@/generated/types';
  import {
    calculateCategoryQuantity, calculateCategoryPrice, calculateCategoryWeight, convertCurrency,
  } from '@/helpers/functions';
  import { columns } from '@/helpers/closetColumns';
  import InlineEdit from '@/components/common/InlineEdit.vue';

  // Props
  const tableProps = defineProps<{
    category: Category;
  }>();

  // Store
  const store = useClosetStore();
  const { confirmRemoveDialog, confirmRemoveCategoryDialog, itemLinkDialog } = storeToRefs(store);

  // Local state
  const rows = ref<Item[]>([]);
  const options = ['oz', 'lb', 'g', 'kg'];

  // Computed
  const computedWeightTotal = computed(() => {
    const total = calculateCategoryWeight(tableProps.category);
    return convert(total, 'mg')
      .to(tableProps.category.unit as Mass)
      .toFixed(2);
  });

  const computedPriceTotal = computed(() => {
    const total = (calculateCategoryPrice(tableProps.category) / 100);
    return total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  });

  const computedQuantityTotal = computed(() => {
    const total = calculateCategoryQuantity(tableProps.category);
    return total;
  });

  // CRUD methods
  const handleUpdateCategory = async (category: Category, field: string, value: string): Promise<void> => {
    const payload = { id: category.id, input: { [field]: value } };
    await store.updateCategory(payload);
  };

  const handleUpdateItem = async (item: Item, field: string, value: string | boolean | number | null): Promise<void> => {
    const payload = { id: item.id, input: { [field]: value } };
    await store.updateItem(payload);
  };

  const handleCreateItem = async (): Promise<void> => {
    await store.createItem(tableProps.category.id);
  };

  const handleRemove = async (item: Item): Promise<void> => {
    confirmRemoveDialog.value.selectedCategory = tableProps.category.id;
    confirmRemoveDialog.value.selectedItem = item.id;

    if (confirmRemoveDialog.value.remember) {
      nextTick(() => store.removeItem());
    } else {
      store.toggleConfirmRemoveDialog();
    }
  };

  const handleDeleteCategory = (): void => {
    confirmRemoveCategoryDialog.value.selectedCategory = tableProps.category.id;
    confirmRemoveCategoryDialog.value.visible = true;
  };

  const handleItemLink = (item: Item): void => {
    itemLinkDialog.value.selectedItem = item;
    itemLinkDialog.value.visible = true;
  };

  // Watch for changes
  watchEffect(() => {
    const items = tableProps.category.category_items.map(categoryItem => ({
      ...categoryItem?.item,
      position: categoryItem ? categoryItem.position : 0,
    }));
    rows.value = items as Item[];
  });
</script>

<style lang="scss">
  .category-table {
    .unit-select {
      padding-bottom: 2px;

      .q-icon {
        font-size: 12px;
      }
    }
  }
</style>

<style lang='scss' scoped>
  .category-table {
    border-radius: 1rem;
    margin-bottom: 2rem;

    .remove-cat-btn {
      color: $text;
      min-height: auto;

      &:hover {
        color: $negative;
      }
    }

    h6 {
      color: $text;
    }

    thead {
      tr {
        th {
          font-weight: bold;
        }
      }
    }

    /* stylelint-disable-next-line no-descending-specificity */
    tr {
      td {
        border-bottom-width: 1px;
      }

      &.totals-row {
        td {
          border-bottom-width: 0;
        }
      }

      .drag-handle i {
        opacity: 0;
        cursor: grab;
        transition: 0.2s opacity $cubic-bezier;
      }

      &:hover {
        .drag-handle i {
          opacity: 1;
        }
      }

      .consumable-wrapper {
        .q-btn {
          &.active {
            background-color: $light-blue-3;
          }
        }
      }

      .worn-wrapper {
        .q-btn {
          &.active {
            background-color: $deep-orange-2;
          }
        }
      }

      .remove-btn {
        min-height: auto;

        &:hover {
          color: $negative;
        }
      }

      .link-btn {
        min-height: auto;

        &:hover {
          color: $secondary;
        }

        &.has-value {
          color: $secondary;
        }
      }
    }

    .material-icons {
      font-size: 1rem;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    .q-table__bottom {
      border-top: none;
    }
  }
</style>
