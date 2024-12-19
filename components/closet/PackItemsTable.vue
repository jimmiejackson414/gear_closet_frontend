<script lang='ts' setup>
  import { FlexRender, getCoreRowModel, getGroupedRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
  import type { Row, VisibilityState } from '@tanstack/vue-table';
  import convert from 'convert';
  import type { Mass } from 'convert';
  import { type SortableEvent, useDraggable, vDraggable } from 'vue-draggable-plus';
  import { SelectContent , SelectGroup, SelectItem, SelectRoot, SelectTrigger, Typography } from '#components';
  import GcInlineEdit from '@/components/common/GcInlineEdit.vue';
  import { useTableColumns } from '@/composables/useTableColumns';
  import type { Database, Tables, TablesUpdate } from '@/types';
  import type { ExtendedCategory } from '@/types/helpers';
  import { weightOptions } from '@/utils/helpers';

  // TODO: Rethink whether to use items or category_items, and if manually adding position is necessary or to keep the category_item position the source of truth
  export interface RowItem extends Tables<'items'> {
    category_item_id: number | null;
    position: number;
    meta: { category: ExtendedCategory };
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
    rows.value = newVal?.categories?.map(category => {
      // Check if the category has no items and render a placeholder row if empty
      const categoryItems = category.category_items?.map(categoryItem => ({
        ...categoryItem?.item,
        position: categoryItem.position || 0,
        category_item_id: categoryItem.id,
        meta: { category },
      })) || [];

      if (categoryItems.length === 0) {
        // If the category is empty, return a single row with a message
        return [{
          position: 0,
          meta: { category },
        }] as RowItem[];
      }

      return categoryItems;
    })
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

  /**
   * Optimistically create a new item
   * @param categoryId number
   * @returns Promise<void>
   */
  const $appStore = useAppStore();
  const createDefaultItem = async (categoryId: number) => {
    try {
      const user = useSupabaseUser();
      const supabase = useSupabaseClient<Database>();

      // Find the category up front for later use
      const category = data.value.selectedPack?.categories.find(cat => cat.id === categoryId);
      if (!category) throw new Error('Category not found');

      // Generate the new item for both server request and optimistic update
      const newItem = { ...generateItem(), profile_id: user.value?.id } as Tables<'items'>;
      const optimisticItem = { ...newItem, id: 0 };

      // Optimistic update for category item
      const optimisticCategoryItem = {
        id: 0,
        category_id: categoryId,
        item_id: optimisticItem.id,
        position: (category?.category_items?.length ?? 0) + 1,
        created_at: new Date()
          .toISOString(),
        updated_at: new Date()
          .toISOString(),
        item: optimisticItem,
      };

      // Optimistically update category's category_items
      const updatedCategoryItems = [...category.category_items, optimisticCategoryItem];

      // Perform optimistic update
      data.value.selectedPack!.categories = data.value.selectedPack!.categories.map(cat =>
        cat.id === categoryId ? { ...cat, category_items: updatedCategoryItems } : cat,
      );

      // Insert the new item into the database
      const { data: createdItem, error: itemError } = await supabase.from('items')
        .insert([newItem])
        .select();

      if (itemError) throw itemError;

      // Create the new category_item after item is created
      const newCategoryItem = {
        category_id: categoryId,
        item_id: createdItem[0].id,
        position: updatedCategoryItems.length,
      };

      const { data: createdCategoryItem, error: categoryItemError } = await supabase.from('category_items')
        .insert([newCategoryItem])
        .select();

      if (categoryItemError) throw categoryItemError;

      // Replace the temporary optimistic item with the real item after creation
      const finalCategoryItem = {
        ...optimisticCategoryItem,
        id: createdCategoryItem[0].id,
        item_id: createdItem[0].id,
        item: createdItem[0],
      };

      // Final optimistic update of category items
      data.value.selectedPack!.categories = data.value.selectedPack!.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, category_items: cat.category_items.map(item =>
            item.item_id === optimisticCategoryItem.item_id ? finalCategoryItem : item,
          ) }
          : cat,
      );
    } catch (err) {
      const category = data.value.selectedPack?.categories.find(cat => cat.id === categoryId);
      if (category) {
        // Rollback the optimistic update by filtering out the item
        category.category_items = category.category_items.filter(item => item.id !== 0);
      }
      $appStore.notifyNegative('Error creating item');
    }
  };

  /**
   * Compute the total weight of a category
   * @param subRows Row<RowItem>[]
   * @returns number
   */
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

  /**
   * Compute the total of a column for a group
   * @param columnId string
   * @param subRows Row<RowItem>[]
   * @returns number
   */
  const computeGroupTotal = (columnId: string, subRows: Row<RowItem>[]) => {
    return subRows.reduce((total, subRow) => {
      const cellValue = subRow
        .getVisibleCells()
        .find(cell => cell.column.id === columnId)
        ?.getValue();

      return total + (typeof cellValue === 'number' ? cellValue : 0);
    }, 0);
  };

  /**
   * Update the positions of the category items
   * @param payload TablesUpdate<'category_items'>[]
   * @returns Promise<void>
   */
  const updatePositions = async (payload: TablesUpdate<'category_items'>[]) => {
    console.log({ payload });
  };

  // Calculate the updated positions when a row is moved and build the payload
  const calculateUpdatedPositions = (
    { oldIndex, newIndex }: SortableEvent,
    reorderedCategoryRows: Row<RowItem>[],
  ) => {
    // Validate indices
    if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') return;
    if (oldIndex === newIndex) return; // No changes required

    const updatedRows: TablesUpdate<'category_items'>[] = [];

    // Update the positions in the reordered rows
    reorderedCategoryRows.forEach((row, index) => {
      const newPosition = index + 1; // The new position is just the index + 1

      // Log for debugging
      console.log(`Row ID: ${row.original.id}, Current position: ${row.original.position}, New position: ${newPosition}`);

      // Update the row's position directly based on its new index
      updatedRows.push({
        id: row.original.id,
        category_id: row.original.meta.category.id,
        position: newPosition,
      });

      // Update the row's local position
      row.original.position = newPosition; // Set the new position for the row
    });

    // Proceed to map over rows.value to reflect changes
    console.log({ updatedRows });
    rows.value = rows.value.map((row) => {
      const updatedRow = updatedRows.find((uRow) => uRow.id === row.id);
      console.log({ updatedRow });

      if (updatedRow) {
        // Update the row's position and category ID in rows.value
        row.position = updatedRow.position as number;
        row.meta.category.category_items = row.meta.category.category_items.map((item) => {
          if (item.id === row.id) {
            item.position = updatedRow.position as number;
          }
          return item;
        });
        row.meta.category.id = updatedRow.category_id as number;
      }

      return row;
    });

    console.log('Final rows:', JSON.stringify(rows.value, null, 2));

    // Return the updated rows to sync with the server
    return updatedRows;
  };

  // useDraggable('#tableBodyRef', rows, {
  //   animation: 150,
  //   direction: 'vertical',
  //   draggable: '.draggable',
  //   handle: '.handle',
  //   group: {
  //     name: 'rows',
  //     put: true,
  //     pull: true,
  //   },
  //   onEnd ({ oldIndex, newIndex, from, to }) {
  //     console.log({ oldIndex, newIndex, from, to });
  //     if (oldIndex === newIndex) return;  // No need to update if no change

  //     if (oldIndex !== undefined && newIndex !== undefined) {
  //       const oldRow = rows.value[oldIndex];
  //       const newRow = rows.value[newIndex];
  //       const oldCategoryId = oldRow.meta.category.id;
  //       const newCategoryId = newRow.meta.category.id;
  //       const updatedRows = calculateUpdatedPositions(oldIndex, newIndex, oldCategoryId, newCategoryId);
  //       console.log({ updatedRows });

  //       updatePositions(updatedRows);
  //     }
  //   },
  // });
</script>

<template>
  <card class="mb-6 overflow-y-visible px-4 lg:px-8 py-4">
    <div class="overflow-x-auto relative">
      <table-root :style="{ width: table.getCenterTotalSize() }">
        <template
          v-for="row in table.getRowModel().rows"
          :key="row.id">
          <table-header>
            <table-row
              class="bg-gray-100 dark:bg-accent group"
              no-hover-effect>
              <!-- Group title header  -->
              <table-head
                class="p-0 w-8"
                colspan="1">
                <icon-grip-vertical class="!size-6 category-handle cursor-move group-hover:opacity-100 opacity-0 stroke-1 text-muted-foreground" />
              </table-head>
              <table-head
                class="font-bold px-0"
                :colspan="columns.length - 3">
                <gc-inline-edit
                  data-testid="category-name"
                  hide-edit-btn
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
                    :class="!row.original.meta.category.name ? 'text-gray-400' : 'text-text'"
                    variant="h5">
                    {{ row.original.meta.category.name || 'Category Name' }}
                  </typography>
                </gc-inline-edit>
              </table-head>
              <table-head class="pr-2">
                <div class="flex justify-end">
                  <button-root
                    class="bg-transparent dark:hover:bg-destructive-light hover:bg-destructive/10 cursor-pointer duration-150 ease-snap h-8 dark:hover:text-destructive items-center justify-center rounded-full transition w-8"
                    size="icon"
                    variant="ghost"
                    @click="emit('handleRemoveCategory', row.original.meta.category.id)">
                    <icon-trash />
                  </button-root>
                </div>
              </table-head>
            </table-row>
            <!-- Column Headers for Items -->
            <table-row
              class="w-full"
              no-hover-effect>
              <table-head
                v-for="header in table.getHeaderGroups()[0].headers"
                :key="header.id"
                class="px-0 py-4 text-left"
                :class="[
                  header.column.columnDef.meta?.headerClassName,
                  { '!pr-2': header.column.columnDef.id === 'actions' },
                  { 'w-8': header.column.columnDef.id === 'drag' },
                ]"
                colspan="1">
                <flex-render
                  v-if="!header.isPlaceholder"
                  :props="header.getContext()"
                  :render="header.column.columnDef.header" />
              </table-head>
            </table-row>
          </table-header>

          <!-- Render rows -->
          <table-body
            v-draggable="[
              row.subRows,
              {
                group: 'rows',
                handle: '.handle',
                animation: 150,
                direction: 'vertical',
                onEnd: (e) => {
                  const updatedRows = calculateUpdatedPositions(e, row.subRows);
                  if (updatedRows?.length) updatePositions(updatedRows);
                },
              }
            ]">
            <template v-if="row.subRows.length">
              <table-row
                v-for="subRow in row.subRows"
                :key="subRow.id"
                class="group w-full">
                <table-cell
                  v-for="cell in subRow.getVisibleCells()"
                  :key="cell.id"
                  class="p-0"
                  :class="cell.column.columnDef.id === 'actions' ? 'pr-2' : ''">
                  <flex-render
                    :props="cell.getContext()"
                    :render="cell.column.columnDef.cell" />
                </table-cell>
              </table-row>
            </template>
            <template v-else>
              <table-empty>
                No items in this category
              </table-empty>
            </template>
          </table-body>

          <!-- Totals Row -->
          <table-body class="[&>tr]:last:border-b-0 bg-card border-t font-medium w-full">
            <table-row
              class="font-bold"
              no-hover-effect>
              <table-cell class="px-0 py-2 w-fit" />
              <table-cell
                class="px-0 py-2 text-left w-fit"
                colspan="1">
                Total
              </table-cell>
              <table-cell class="px-0 py-2 w-fit" />
              <table-cell class="px-0 py-2 w-fit" />
              <table-cell class="px-0 py-2 w-fit" />
              <table-cell
                class="px-0 py-2 text-center w-fit"
                colspan="1">
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
              </table-cell>
              <table-cell
                class="px-0 py-2 text-center w-fit"
                colspan="1">
                ${{ computeGroupTotal('price', row.subRows) }}
              </table-cell>
              <table-cell
                class="px-0 py-2 text-center w-fit"
                colspan="1">
                {{ computeGroupTotal('quantity', row.subRows) }}
              </table-cell>
              <table-cell
                class="justify-end px-0 py-2 w-fit"
                colspan="1">
                <button-root
                  size="sm"
                  variant="outline"
                  @click="() => createDefaultItem(row.original.meta.category.id)">
                  <icon-plus class="h-4 text-primary dark:text-primary-light w-4" />
                  New Item
                </button-root>
              </table-cell>
            </table-row>
          </table-body>
        </template>
      </table-root>
    </div>
  </card>
</template>