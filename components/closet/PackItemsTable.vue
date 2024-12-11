<script lang='ts' setup>
  import { FlexRender, getCoreRowModel, getGroupedRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
  import type { ColumnDef, Row, VisibilityState } from '@tanstack/vue-table';
  import { ButtonRoot, IconApple, IconGripVertical, IconLink, IconShirt, IconTrash, SelectContent , SelectGroup, SelectItem, SelectRoot, SelectTrigger, Typography } from '#components';
  import GcInlineEdit from '@/components/common/GcInlineEdit.vue';
  import type { Tables } from '@/types';
  import type { ExtendedCategory } from '@/types/helpers';
  import { weightOptions } from '@/utils/helpers';

  export interface RowItem extends Tables<'items'> {
    category_item_id: number;
    category_id: number;
    category_name: string | null;
    position: number;
  }

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
      cell: () => h(IconGripVertical, {
        class: 'cursor-move text-muted-foreground opacity-0 group-hover:opacity-100 stroke-1 !size-6',
      }),
      enableHiding: false,
      meta: { headerClassName: 'w-12' },
    },
    {
      accessorKey: 'name',
      header: () => h(Typography, {
        class: 'font-semibold',
        variant: 'muted',
      }, () => 'Name'),
      cell: ({ row }) => {
        const name = row.getValue('name');
        return h('div', { class: 'text-left' }, [
          h(GcInlineEdit, {
            hideEditBtn: true,
            'model-value': name,
            name: `item_name_${row.id}`,
            size: 'sm',
            spanClasses: 'min-w-[5rem]',
            'onUpdate:model-value': (newValue: string) => $store.updateItem(row.original, 'name', newValue, row.original.category_id),
          }, {
            default: () => [
              h(Typography, { class: 'text-left', variant: 'muted' }, () => name),
            ],
          }),
        ]);
      },
    },
    {
      accessorKey: 'generic_type',
      header: () => h(Typography, {
        class: 'font-semibold',
        variant: 'muted',
      }, () => 'Description'),
      cell: ({ row }) => {
        const genericType = row.getValue('generic_type');
        return h('div', { class: 'text-left' }, [
          h(GcInlineEdit, {
            hideEditBtn: true,
            'model-value': genericType,
            name: `item_generic_type_${row.id}`,
            size: 'sm',
            spanClasses: 'min-w-[5rem]',
            'onUpdate:model-value': (newValue: string) => $store.updateItem(row.original, 'generic_type', newValue, row.original.category_id),
          }, {
            default: () => [
              h(Typography, { class: 'text-left' }, () => genericType),
            ],
          }),
        ]);
      },
    },
    {
      accessorKey: 'consumable',
      header: () => h(Typography, {
        class: 'font-semibold text-center',
        variant: 'muted',
      }, () => 'Consumable'),
      cell: ({ row }) =>
        h('div', { class: 'flex justify-center items-center' }, [
          h('button', {
            class: `cursor-pointer duration-150 ease-expo flex justify-center items-center h-8 w-8 rounded-full transition ${
              row.getValue('consumable') ? 'bg-primary hover:bg-primary/70' : 'bg-transparent hover:bg-gray-200'
            }`,
            onClick: () =>
              $store.updateItem(
                row.original,
                'consumable',
                !row.getValue('consumable'),
                row.original.category_id,
              ),
          }, [
            h(IconApple, {
              class: `h-5 w-5 ${
                row.getValue('consumable') ? 'text-primary-foreground' : 'text-dark-grey'
              }`,
            }),
          ]),
        ]),
    },
    {
      accessorKey: 'worn',
      header: () =>
        h(Typography, {
          class: 'font-semibold text-center',
          variant: 'muted',
        }, () => 'Worn'),
      cell: ({ row }) => h('div', { class: 'flex justify-center items-center' }, [
        h('button', {
          class: `cursor-pointer duration-150 ease-expo flex justify-center items-center h-8 w-8 rounded-full transition ${
            row.getValue('worn') ? 'bg-accent-alt hover:bg-accent-alt/70' : 'bg-transparent hover:bg-gray-200'
          }`,
          onClick: () =>
            $store.updateItem(
              row.original,
              'worn',
              !row.getValue('worn'),
              row.original.category_id,
            ),
        }, [
          h(IconShirt, {
            class: `h-5 w-5 ${
              row.getValue('worn') ? 'text-primary-foreground' : 'text-dark-grey'
            }`,
          }),
        ]),
      ]),
    },
    {
      accessorKey: 'weight',
      header: () => h(Typography, {
        class: 'font-semibold text-center',
        variant: 'muted',
      }, () => 'Weight'),
      cell: ({ row }) => {
        return h('div', {
          class: 'px-6 py-3 text-center flex justify-center items-center',
        }, [
          h(GcInlineEdit, {
            key: `weight-inline-edit-${row.id}`,
            'data-testid': 'weight-cell',
            'hide-edit-btn': true,
            'model-value': row.getValue('weight'),
            'name': `item_weight_${row.id}`,
            'size': 'sm',
            'span-classes': 'justify-center min-w-[3rem]',
            'onUpdate:model-value': (value: any) => $store.updateItem(row.original, 'weight', Number(value), row.original.category_id),
          }, () => row.getValue('weight')),

          h(SelectRoot, {
            key: `weight-select-${row.id}`,
            class: 'w-4',
            'model-value': row.original.unit,
            'name': `weight-total-unit-select-${row.id}`,
            'onUpdate:model-value': (value: any) => $store.updateItem(row.original, 'unit', value, row.original.category_id),
          }, {
            default: () => [
              h(SelectTrigger, { class: 'border-0' }, () => [
                h('span', { class: row.original.unit ? '' : 'text-muted' }, weightOptions({ shortLabel: true })
                  .find(w => w.value === row.original.unit)?.label || 'Select Unit'),
              ]),
              h(SelectContent, () => [
                h(SelectGroup, { key: 'weight-options' }, () => [
                  weightOptions()
                    .map((weightOption: any) =>
                      h(SelectItem, {
                        key: weightOption.value,
                        'value': weightOption.value,
                        'hide-checkmark': true,
                      }, () => weightOption.label),
                    ),
                ],
                ),
              ]),
            ],
          }),
        ]);
      },
    },
    {
      accessorKey: 'price',
      header: () => h(Typography, {
        class: 'font-semibold text-center',
        variant: 'muted',
      }, () => 'Price'),
      cell: ({ row }) => h('div', {
        class: 'px-6 py-3 text-center',
      }, row.getValue('price')),
    },
    {
      accessorKey: 'quantity',
      header: () => h(Typography, {
        class: 'font-semibold text-center',
        variant: 'muted',
      }, () => 'Quantity'),
      cell: ({ row }) => h('div', {
        class: 'px-6 py-3 text-center',
      }, row.getValue('quantity')),
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: () =>
        h(Typography, {
          class: 'font-semibold text-right',
          variant: 'muted',
        }, () => 'Actions'),
      cell: ({ row }) => {
        const rowData = row.original;
        return h('div', {
          class: 'grid grid-cols-[auto,auto] gap-1 justify-end items-center',
        }, [
          // Add/Modify URL Button
          h(ButtonRoot, {
            class: `cursor-pointer duration-150 ease-snap flex justify-center items-center h-8 w-8 rounded-full transition ${
              rowData.url ? 'bg-tertiary hover:bg-tertiary/70' : 'bg-transparent hover:bg-gray-200'
            }`,
            'data-testid': 'add-url-btn',
            onClick: () => emit('handleAddUrl', rowData, rowData.category_id),
            variant: 'ghost',
          }, {
            default: () => h(IconLink, {
              class: `h-5 w-5 ${
                rowData.url ? 'text-primary-foreground' : 'text-dark-grey'
              }`,
            }),
          }),

          // Remove from Category Button
          h(ButtonRoot, {
            class: 'cursor-pointer duration-150 ease-snap justify-center items-center w-8 h-8 rounded-full transition bg-transparent hover:bg-destructive/10',
            'data-testid': 'remove-item-btn',
            onClick: () => emit('handleRemoveItem', rowData),
            variant: 'ghost',
          }, {
            default: () => h(IconTrash, {
              class: 'h-5 w-5 text-destructive transition',
            }),
          }),
        ]);
      },
      enableHiding: false,
      meta: {
        headerClassName: 'w-12',
      },
    },
  ];

  // generate table rows
  const rows = ref<RowItem[]>([]);
  watch(() => data.value.selectedPack, (newVal) => {
    rows.value = newVal?.categories?.map(category => category.category_items.map(categoryItem => ({
      ...categoryItem?.item,
      position: categoryItem.position || 0,
      category_item_id: categoryItem.id,
      category_name: category.name,
      category_id: category.id,
    })))
      .flat() || [];
  }, { immediate: true, deep: true });

  const visibility = reactive<VisibilityState>({
    category_name: false,
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
      grouping: ['category_name'],
    },
  });

  const activeCategory = (categoryName: string) => {
    return data.value.selectedPack?.categories.find(category => category.name === categoryName) as ExtendedCategory;
  };

  const computeGroupTotal = (columnId: string, subRows: Row<RowItem>[]) => {
    return subRows.reduce((total, subRow) => {
      const cellValue = subRow
        .getVisibleCells()
        .find(cell => cell.column.id === columnId)
        ?.getValue();

      return total + (typeof cellValue === 'number' ? cellValue : 0);
    }, 0);
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

              <!-- Render Sub-Rows (Items in each category) -->
              <template
                v-for="subRow in row.subRows"
                :key="subRow.id">
                <table-row class="group">
                  <table-cell
                    v-for="cell in subRow.getVisibleCells()"
                    :key="cell.id"
                    class="p-0"
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
                  class="p-4 text-center">
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