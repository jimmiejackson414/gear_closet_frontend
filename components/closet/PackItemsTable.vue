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
      accessorKey: 'drag',
      header: () => null,
      cell: () => h(IconGripVertical, { class: 'cursor-move text-muted-foreground opacity-0 group-hover:opacity-100 stroke-1 !size-6' }),
      enableHiding: false,
      meta: {
        headerClassName: 'w-12',
      },
    },
    {
      accessorKey: 'name',
      header: () => h(Typography, {
        class: 'font-semibold',
        variant: 'muted',
      }, () => 'Name'),
      cell: ({ row }) => h('div', {
        class: 'text-left',
      }, row.getValue('name')),
    },
    {
      accessorKey: 'generic_type',
      header: () => h(Typography, {
        class: 'font-semibold',
        variant: 'muted',
      }, () => 'Description'),
      cell: ({ row }) => h('div', {
        class: 'text-left',
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
    defaultColumn: {
      size: 5,
      minSize: 5,
      maxSize: 50,
    },
    state: {
      columnVisibility: visibility,
      grouping: ['category_name'],
    },
  });

  const activeCategory = (categoryName: string) => {
    return data.value.selectedPack?.categories.find(category => category.name === categoryName) as ExtendedCategory;
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
              <table-row v-if="row.getIsGrouped()">
                <table-cell
                  class="bg-gray-100 dark:bg-accent font-bold py-2"
                  :colspan="columns.length">
                  <gc-inline-edit
                    data-testid="category-name"
                    input-classes="w-full max-w-[25rem]"
                    :model-value="activeCategory(row.getGroupingValue('category_name') as string).name"
                    :name="`category_name_${activeCategory(row.getGroupingValue('category_name') as string).id}`"
                    size="sm"
                    @update:model-value="emit('handleUpdateCategory', {
                      id: activeCategory(row.getGroupingValue('category_name') as string).id,
                      field: 'name',
                      value: $event
                    })">
                    <typography variant="h5">
                      {{ row.getGroupingValue('category_name') }}
                    </typography>
                  </gc-inline-edit>
                </table-cell>
              </table-row>

              <!-- Table Header -->
              <table-row no-hover-effect>
                <table-cell
                  v-for="header in table.getHeaderGroups()[0].headers"
                  :key="header.id"
                  class="p-4 text-left"
                  :class="header.column.columnDef.meta?.headerClassName">
                  <flex-render
                    v-if="!header.isPlaceholder"
                    :props="header.getContext()"
                    :render="header.column.columnDef.header" />
                </table-cell>
              </table-row>

              <!-- Render Sub-Rows -->
              <template
                v-for="( subRow, index ) in row.subRows"
                :key="subRow.id">
                <table-row
                  class="group"
                  :class="{ 'border-b-0': index === row.subRows.length - 1 }">
                  <table-cell
                    v-for="cell in subRow.getVisibleCells()"
                    :key="cell.id"
                    :style="{ minWidth: `${cell.column.columnDef.size}px`, maxWidth: `${cell.column.columnDef.size}px` }">
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
