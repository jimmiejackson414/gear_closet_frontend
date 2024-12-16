import type { ColumnDef } from '@tanstack/vue-table';
import { Tippy } from 'vue-tippy';
import { ButtonRoot, IconApple, IconGripVertical, IconLink, IconShirt, IconTrash, SelectContent , SelectGroup, SelectItem, SelectRoot, SelectTrigger, Typography } from '#components';
import type { RowItem } from '@/components/closet/PackItemsTable.vue';
import GcInlineEdit from '@/components/common/GcInlineEdit.vue';
import { weightOptions } from '@/utils/helpers';

export const useTableColumns = (emit: any) => {
  const $store = useClosetStore();

  // define table columns
  const columns: ColumnDef<RowItem>[] = [
    {
      accessorFn: (row) => row.meta.category.id,
      accessorKey: 'category_id',
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
        const name: string = row.getValue('name');
        return h('div', { class: 'text-left' }, [
          h(GcInlineEdit, {
            hideEditBtn: true,
            'model-value': name,
            name: `item_name_${row.id}`,
            size: 'sm',
            spanClasses: 'min-w-[5rem]',
            'onUpdate:model-value': (newValue: string) => $store.updateItem(row.original, 'name', newValue, row.original.meta.category.id),
          }, {
            default: () => [
              h(Typography, { class: `text-left ${!name ? "!text-gray-400" : ""}`, variant: 'muted' }, () => name || 'Item Name'),
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
            'onUpdate:model-value': (newValue: string) => $store.updateItem(row.original, 'generic_type', newValue, row.original.meta.category.id),
          }, {
            default: () => [
              h(Typography, { class: 'text-left' }, () => genericType || 'Item Description'),
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
                row.original.meta.category.id,
              ),
          }, [
            h(IconApple, {
              class: `h-5 w-5 ${
                row.getValue('consumable') ? 'text-primary-foreground' : 'text-dark-grey'
              }`,
            }),
          ]),
        ]),
      meta: { headerClassName: 'w-28' },
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
            row.getValue('worn') ? 'bg-accent-alt dark:bg-accent-light hover:bg-accent-alt/70' : 'bg-transparent hover:bg-gray-200'
          }`,
          onClick: () =>
            $store.updateItem(
              row.original,
              'worn',
              !row.getValue('worn'),
              row.original.meta.category.id,
            ),
        }, [
          h(IconShirt, {
            class: `h-5 w-5 ${
              row.getValue('worn') ? 'text-primary-foreground' : 'text-dark-grey'
            }`,
          }),
        ]),
      ]),
      meta: { headerClassName: 'w-28' },
    },
    {
      accessorKey: 'weight',
      header: () => h(Typography, {
        class: 'font-semibold text-center',
        variant: 'muted',
      }, () => 'Weight'),
      cell: ({ row }) => {
        return h('div', {
          class: 'px-0 py-3 text-center flex justify-center items-center w-fit mx-auto',
        }, [
          h(GcInlineEdit, {
            key: `weight-inline-edit-${row.id}`,
            'data-testid': 'weight-cell',
            'hide-edit-btn': true,
            'model-value': row.getValue('weight'),
            'name': `item_weight_${row.id}`,
            'size': 'sm',
            'span-classes': 'justify-center min-w-[3rem] w-fit',
            'onUpdate:model-value': (value: any) => $store.updateItem(row.original, 'weight', Number(value), row.original.meta.category.id),
          }, () => row.getValue('weight')),

          h(SelectRoot, {
            key: `weight-select-${row.id}`,
            class: 'w-4',
            'model-value': row.original.unit,
            'name': `weight-total-unit-select-${row.id}`,
            'onUpdate:model-value': (value: any) => $store.updateItem(row.original, 'unit', value, row.original.meta.category.id),
          }, {
            default: () => [
              h(SelectTrigger, { class: 'border-0 justify-start w-fit' }, () => [
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
      meta: { headerClassName: 'w-24' },
    },
    {
      accessorKey: 'price',
      header: () => h(Typography, {
        class: 'font-semibold text-center',
        variant: 'muted',
      }, () => 'Price'),
      cell: ({ row }) => {
        const price = row.getValue('price');
        return h('div', { class: 'text-center' }, [
          h(GcInlineEdit, {
            hideEditBtn: true,
            'model-value': price,
            name: `item_price_${row.id}`,
            size: 'sm',
            type: 'number',
            spanClasses: 'min-w-[2rem] !mx-auto',
            'onUpdate:model-value': (newValue: string) => $store.updateItem(row.original, 'price', newValue, row.original.meta.category.id),
          }, {
            default: () => [
              h(Typography, { class: 'text-left' }, () => `$${price}` || '$0'),
            ],
          }),
        ]);
      },
      meta: { headerClassName: 'w-28' },
    },
    {
      accessorKey: 'quantity',
      header: () => h(Typography, {
        class: 'font-semibold text-center',
        variant: 'muted',
      }, () => 'Quantity'),
      cell: ({ row }) => {
        const quantity = row.getValue('quantity');
        return h('div', { class: 'text-center' }, [
          h(GcInlineEdit, {
            hideEditBtn: true,
            'model-value': quantity,
            name: `item_quantity_${row.id}`,
            size: 'sm',
            type: 'number',
            spanClasses: 'min-w-[2rem] w-fit !mx-auto justify-center',
            'onUpdate:model-value': (newValue: string) => $store.updateItem(row.original, 'quantity', newValue, row.original.meta.category.id),
          }, {
            default: () => [
              h(Typography, { class: 'text-left' }, () => quantity || '0'),
            ],
          }),
        ]);
      },
      meta: { headerClassName: 'w-28' },
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
          h(Tippy, {
            content: 'Add/Modify URL',
            placement: 'top', // Adjust placement if needed
          }, {
            default: () => h(ButtonRoot, {
              class: `cursor-pointer duration-150 ease-snap flex justify-center items-center h-8 w-8 rounded-full transition ${
                rowData.url ? 'bg-tertiary dark:bg-tertiary-foreground hover:bg-tertiary/70' : 'bg-transparent hover:bg-gray-200 dark:hover:bg-tertiary-foreground'
              }`,
              'data-testid': 'add-url-btn',
              onClick: () => emit('handleAddUrl', rowData.meta.category.id),
              variant: 'ghost',
            }, {
              default: () => h(IconLink, {
                class: `h-5 w-5 ${
                  rowData.url ? 'text-primary-foreground' : 'text-dark-grey'
                }`,
              }),
            }),
          }),

          // Remove from Category Button
          h(ButtonRoot, {
            class: 'cursor-pointer duration-150 ease-snap justify-center items-center w-8 h-8 rounded-full bg-transparent hover:bg-destructive/10 dark:hover:bg-destructive-light dark:hover:text-destructive transition',
            'data-testid': 'remove-item-btn',
            onClick: () => emit('handleRemoveItem', rowData),
            variant: 'ghost',
          }, {
            default: () => h(IconTrash, {
              class: 'h-5 w-5',
            }),
          }),
        ]);
      },
      enableHiding: false,
      meta: {
        headerClassName: 'w-28 !pr-2',
      },
    },
  ];

  return columns;
};
