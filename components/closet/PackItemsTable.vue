<script lang='ts' setup>
  import { FlexRender, getCoreRowModel, getGroupedRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
  import type { Row, VisibilityState } from '@tanstack/vue-table';
  import convert from 'convert';
  import type { Mass } from 'convert';
  import { SelectContent , SelectGroup, SelectItem, SelectRoot, SelectTrigger, Typography } from '#components';
  import GcInlineEdit from '@/components/common/GcInlineEdit.vue';
  import { useTableColumns } from '@/composables/useTableColumns';
  import type { Tables } from '@/types';
  import type { ExtendedCategory } from '@/types/helpers';
  import { weightOptions } from '@/utils/helpers';

  export interface RowItem extends Tables<'items'> {
    category_item_id: number | null;
    position: number;
    meta: { category: ExtendedCategory };
    placeholder?: boolean;
  }

  const $store = useClosetStore();
  const { data } = storeToRefs($store);
  const emit = defineEmits([
    'handleUpdateCategory',
    'handleRemoveCategory',
    'handleAddUrl',
    'handleRemoveItem',
  ]);

  // generate table rows and columns
  const columns = useTableColumns(emit);
  const rows = ref<RowItem[]>([]);
  watch(() => data.value.selectedPack, (newVal) => {
    rows.value = newVal?.categories?.map(category => category.category_items.map(categoryItem => ({
      ...categoryItem?.item,
      position: categoryItem.position || 0,
      category_item_id: categoryItem.id,
      meta: { category },
    })))
      .flat() || [];
  }, { immediate: true, deep: true });

  const visibility = reactive<VisibilityState>({
    category_id: false,
    drag: true,
    name: true,
    generic_type: true,
    consumable: true,
    worn: true,
    weight: true,
    price: true,
    quantity: true,
    actions: true,
  });

  const table = useVueTable({
    data: rows,
    columns,
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: {
      size: 5,
      minSize: 5,
      maxSize: 50,
    },
    state: {
      columnVisibility: visibility,
      grouping: ['category_id'],
    },
  });

  const computeGroupTotal = (columnId: string, subRows: Row<RowItem>[]) => {
    return subRows.reduce((total, subRow) => {
      const cellValue = subRow
        .getVisibleCells()
        .find(cell => cell.column.id === columnId)
        ?.getValue();

      return total + (typeof cellValue === 'number' ? cellValue : 0);
    }, 0);
  };

  const computeGroupWeight = (subRows: Row<RowItem>[]) => {
    let totalWeightInMg = subRows.reduce((total, subRow) => {
      const item = subRow.original;

      // Ensure item has weight, unit, and quantity
      if (item.weight && item.unit && item.quantity) {
        const weightValue = parseFloat(item.weight);

        // If the weight is valid, convert it to mg and add it to the total (multiply by quantity if exists)
        if (!isNaN(weightValue)) {
          const weightInMg = convert(weightValue, item.unit)
            .to('mg'); // Convert each item to mg
          total += weightInMg * item.quantity;
        }
      }

      return total;
    }, 0);

    // Convert the total weight in mg to the category unit
    const categoryUnit = subRows[0].original.meta.category.unit as Mass;
    const convertedTotalWeight = convert(totalWeightInMg, 'mg')
      .to(categoryUnit);

    return parseFloat(convertedTotalWeight.toFixed(2));
  };
</script>

<template>
  <card class="mb-6 overflow-y-visible px-4 lg:px-8 py-4">
    <div class="overflow-x-auto relative">
      <table-root :style="{ width: table.getCenterTotalSize() }">
        <table-body>
          <template v-if="table.getRowModel().rows.length">
            <template
              v-for="row in table.getRowModel().rows"
              :key="row.id">
              <!-- Group Title -->
              <table-row
                v-if="row.getIsGrouped()"
                class="bg-gray-100 dark:bg-accent"
                no-hover-effect>
                <table-cell
                  class="font-bold"
                  :colspan="columns.length - 2">
                  <gc-inline-edit
                    data-testid="category-name"
                    input-classes="w-full max-w-[25rem]"
                    :model-value="row.original.meta.category.name"
                    :name="`category_id_${row.original.meta.category.id}`"
                    placeholder="Category Name"
                    size="sm"
                    @update:model-value="emit('handleUpdateCategory', {
                      id: row.original.meta.category.id,
                      field: 'name',
                      value: $event
                    })">
                    <typography
                      :class="!row.original.meta.category.name ? 'text-gray-400' : ''"
                      variant="h5">
                      {{ row.original.meta.category.name || 'Category Name' }}
                    </typography>
                  </gc-inline-edit>
                </table-cell>
                <table-cell>
                  <div class="flex justify-end">
                    <button-root
                      class="rounded-full hover:bg-destructive/10"
                      size="icon"
                      variant="ghost"
                      @click="emit('handleRemoveCategory', row.original.meta.category.id)">
                      <icon-trash class="text-destructive" />
                    </button-root>
                  </div>
                </table-cell>
              </table-row>

              <!-- Table Header -->
              <table-row no-hover-effect>
                <table-cell
                  v-for="header in table.getHeaderGroups()[0].headers"
                  :key="header.id"
                  class="px-0 py-4 text-left"
                  :class="[ header.column.columnDef.meta?.headerClassName, { '!pr-2': header.column.columnDef.id === 'actions' } ]">
                  <flex-render
                    v-if="!header.isPlaceholder"
                    :props="header.getContext()"
                    :render="header.column.columnDef.header" />
                </table-cell>
              </table-row>

              <!-- Render Sub-Rows (Items in each category) -->
              <template
                v-for="subRow in row.subRows"
                :key="subRow.id">
                <table-row class="group">
                  <table-cell
                    v-for="cell in subRow.getVisibleCells()"
                    :key="cell.id"
                    :class="cell.column.columnDef.id === 'actions' ? 'p-0 pr-2' : 'p-0'"
                    :style="{ minWidth: `${cell.column.columnDef.size}px`, maxWidth: `${cell.column.columnDef.size}px` }">
                    <flex-render
                      :props="cell.getContext()"
                      :render="cell.column.columnDef.cell" />
                  </table-cell>
                </table-row>
              </template>

              <!-- Totals Row for the Current Group -->
              <table-row class="font-bold">
                <table-cell
                  v-for="header in table.getHeaderGroups()[0].headers"
                  :key="header.id"
                  class="p-0 text-center w-fit">
                  <template v-if="header.column.id === 'name'">
                    <div class="text-left">
                      Totals
                    </div>
                  </template>
                  <template v-if="header.column.id === 'price'">
                    {{ computeGroupTotal('price', row.subRows) }}
                  </template>
                  <template v-else-if="header.column.id === 'quantity'">
                    {{ computeGroupTotal('quantity', row.subRows) }}
                  </template>
                  <template v-else-if="header.column.id === 'weight'">
                    <div class="flex justify-center items-center mx-auto p-0 text-center w-fit">
                      <span class="min-w-[3rem]">
                        {{ computeGroupWeight(row.subRows) }}
                      </span>
                      <select-root
                        class="max-w-4"
                        :model-value="(row.original.meta.category.unit as string)"
                        @update:model-value="emit('handleUpdateCategory', {
                          id: row.original.meta.category.id,
                          field: 'unit',
                          value: $event
                        })">
                        <select-trigger class="border-0 justify-start">
                          <select-value placeholder="Select a theme" />
                        </select-trigger>
                        <select-content>
                          <select-group>
                            <select-item
                              v-for="opt in weightOptions({ shortLabel: true })"
                              :key="opt.value"
                              hide-checkmark
                              :value="opt.value">
                              {{ opt.label }}
                            </select-item>
                          </select-group>
                        </select-content>
                      </select-root>
                    </div>
                  </template>
                  <template v-else>
                    <!-- Empty cells for other columns -->
                  </template>
                </table-cell>
              </table-row>
            </template>
          </template>

          <table-row v-else>
            <table-cell
              class="h-24 text-center"
              :colspan="columns.length">
              No results.
            </table-cell>
          </table-row>
        </table-body>
      </table-root>
    </div>
  </card>
</template>