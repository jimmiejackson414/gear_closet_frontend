<script lang='ts' setup>
  import { FlexRender, getCoreRowModel, getGroupedRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
  import type { ColumnDef, VisibilityState } from '@tanstack/vue-table';
  import { ButtonRoot, IconGripVertical , IconTrash, Typography } from '#components';
  import type { Tables } from '@/types';
  import type { ExtendedCategory, ExtendedPack } from '@/types/helpers';

  export interface RowItem extends Tables<'items'> {
    category_item_id: number;
    position: number;
  }

  // const props = defineProps<Props>();
  const $store = useClosetStore();
  const { data } = storeToRefs($store);
  const emit = defineEmits([
    'handleUpdateCategory',
    'handleRemoveCategory',
    'handleAddUrl',
    'handleRemoveItem',
  ]);

  // define table columns
  const columns: ColumnDef<RowItem>[] = [
    {
      accessorKey: 'category_name',
      header: () => null,
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'drag',
      header: () => null,
      cell: ({ row }) => {
        console.log('Rendering drag handle for row:', row.id); // Debug here
        return h('div', {
          class: 'px-2 py-3 stroke-primary',
        }, () => [
          h(IconGripVertical, {
            class: 'cursor-move',
          }),
        ]);
      },
      enableHiding: false,
    },
    // {
    //   id: 'drag',
    //   header: () => null,
    //   cell: () => h('div', {
    //     class: 'px-2 py-3 w-12 stroke-primary',
    //   }, () => [
    //     h(IconGripVertical, {
    //       class: 'cursor-move',
    //     }),
    //   ]),
    //   enableHiding: false,
    // },
    {
      accessorKey: 'name',
      header: () => h(Typography, {
        class: 'font-semibold',
        variant: 'muted',
      }, () => 'Name'),
      cell: ({ row }) => h('div', {
        class: 'pr-6 pl-4 py-3 text-left',
      }, row.getValue('name')),
    },
    {
      accessorKey: 'generic_type',
      header: () => h(Typography, {
        class: 'font-semibold',
        variant: 'muted',
      }, () => 'Description'),
      cell: ({ row }) => h('div', {
        class: 'pr-6 pl-4 py-3 text-left',
      }, row.getValue('generic_type')),
    },
    // {
    //   accessorKey: 'consumable',
    //   header: 'Consumable',
    //   cell: ({ row }) => h(ButtonRoot, {
    //     class: 'px-6 py-3 text-center',
    //     variant: 'ghost',
    // 'click': () => emit($store.updateItem, { field: 'consumable', value: !row.getValue('consumable') }),
    //   }, row.getValue('consumable') ? 'Yes' : 'No'),
    // },
    // {
    //   accessorKey: 'worn',
    //   header: 'Worn',
    //   cell: ({ row }) => h(ButtonRoot, {
    //     class: 'px-6 py-3 text-center',
    //     variant: 'ghost',
    // 'click': () => emit($store.updateItem, { field: 'consumable', value: !row.getValue('consumable') }),
    //   }, row.getValue('consumable') ? 'Yes' : 'No'),
    // },
    // {
    //   accessorKey: 'weight',
    //   header: 'Weight',
    //   cell: ({ row }) => h('div', {
    //     class: 'px-6 py-3 text-center',
    //   }, row.getValue('weight')),
    // },
    // {
    //   accessorKey: 'price',
    //   header: 'Price',
    //   cell: ({ row }) => h('div', {
    //     class: 'px-6 py-3 text-center',
    //   }, row.getValue('price')),
    // },
    // {
    //   accessorKey: 'quantity',
    //   header: 'Quantity',
    //   cell: ({ row }) => h('div', {
    //     class: 'px-6 py-3 text-center',
    //   }, row.getValue('quantity')),
    // },
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   cell: ({ row }) => {
    //     const rowItem = row.original;
    //     return h('div', {
    //       rowItem,
    //     });
    //   },
    //   enableHiding: false,
    // },
  ];

  // generate table rows
  const rows = ref<RowItem[]>([]);
  watch(() => data.value.selectedPack, (newVal) => {
    rows.value = newVal?.categories?.map(category => category.category_items.map(categoryItem => ({
      ...categoryItem?.item,
      position: categoryItem.position || 0,
      category_item_id: categoryItem.id,
      category_name: category.name,
    })))
      .flat() || [];
  }, { immediate: true, deep: true });

  const visibility = reactive<VisibilityState>({
    category_name: false,
    drag: true,
    name: true,
    generic_type: true,
  });

  const table = useVueTable({
    data: rows,
    columns,
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getRowId: row => row.id,
    state: {
      columnVisibility: visibility,
      grouping: ['category_name'],
    },
  });
</script>

<template>
  <card class="mb-6 overflow-y-visible px-4 lg:px-8 py-4">
    <div class="overflow-x-auto relative">
      <table-root>
        <table-body>
          <template v-if="table.getRowModel().rows.length">
            <template
              v-for="row in table.getRowModel().rows"
              :key="row.id">
              <!-- Group Title -->
              <table-row v-if="row.getIsGrouped()">
                <table-cell
                  class="bg-gray-100 dark:bg-accent font-bold rounded-t-2xl"
                  :colspan="columns.length">
                  <typography variant="h5">
                    {{ row.getGroupingValue('category_name') }}
                  </typography>
                </table-cell>
              </table-row>

              <!-- Table Header -->
              <table-row no-hover-effect>
                <th
                  v-for="header in table.getHeaderGroups()[0].headers"
                  :key="header.id"
                  class="px-4 py-2 text-left">
                  <flex-render
                    v-if="!header.isPlaceholder"
                    :props="header.getContext()"
                    :render="header.column.columnDef.header" />
                </th>
              </table-row>

              <!-- Render Sub-Rows -->
              <template
                v-for="( subRow, index ) in row.subRows"
                :key="subRow.id">
                <table-row :class="{ 'border-b-0': index === row.subRows.length - 1 }">
                  <table-cell
                    v-for="cell in subRow.getVisibleCells()"
                    :key="cell.id">
                    <flex-render
                      :props="cell.getContext()"
                      :render="cell.column.columnDef.cell" />
                  </table-cell>
                </table-row>
              </template>
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
