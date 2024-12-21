<script lang='ts' setup>
  import { type Mass } from 'convert';
  import { type DraggableEvent, vDraggable } from 'vue-draggable-plus';
  import { SelectContent , SelectGroup, SelectItem, SelectRoot, SelectTrigger, Typography } from '#components';
  import GcInlineEdit from '@/components/common/GcInlineEdit.vue';
  import { cn } from '@/lib/utils';
  import type { TablesUpdate } from '@/types';
  import { weightOptions } from '@/utils/helpers';

  const $store = useClosetStore();
  const { data } = storeToRefs($store);
  const emit = defineEmits([
    'handleUpdateCategory',
    'handleRemoveCategory',
    'handleAddUrl',
    'handleRemoveItem',
  ]);

  // generate table rows and columns
  const columns = [
    { value: 'drag', label: 'Drag', visible: false, cellClass: 'text-left' },
    { value: 'name', label: 'Name', visible: true, cellClass: 'text-left' },
    { value: 'generic_type', label: 'Description', visible: true, cellClass: 'text-left' },
    { value: 'consumable', label: 'Consumable', visible: true, cellClass: 'text-center' },
    { value: 'worn', label: 'Worn', visible: true, cellClass: 'text-center' },
    { value: 'weight', label: 'Weight', visible: true, cellClass :'text-center' },
    { value: 'price', label: 'Price', visible: true, cellClass: 'text-center' },
    { value: 'quantity', label: 'Quantity', visible: true, cellClass: 'text-center' },
    { value: 'actions', label: 'Actions', visible: true, cellClass: 'text-right' },
  ];

  /**
   * Optimistically create a new item
   * @param categoryId number
   * @returns Promise<void>
   */
  const createDefaultItem = async (categoryId: number) => {
    await $store.createItem(categoryId);
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
  // TODO: Fix this method
  const calculateUpdatedPositions = (event: DraggableEvent) => {
    const { oldIndex, newIndex, to, from } = event;

    if (!oldIndex || !newIndex) return [];

    // Parse category IDs
    const newCategoryId = parseInt(to?.getAttribute('data-category-id')!);
    const oldCategoryId = parseInt(from?.getAttribute('data-category-id')!);

    // Early return if positions haven't changed
    if (oldIndex === newIndex) return [];

    const updatedRows: TablesUpdate<'category_items'>[] = [];
    const movedRow = event.data;

    // Handle if the item is moved within the same category
    if (oldCategoryId === newCategoryId) {
      // Get the category items for the oldCategoryId
      const categoryItems = data.value.selectedPack?.categories.find(
        (c) => c.id === oldCategoryId,
      )?.category_items;

      if (!categoryItems) return []; // Return early if no category items are found

      // Update position for each item
      categoryItems.forEach((row, index) => {
        if (row.id === movedRow.id) {
          updatedRows.push({
            id: movedRow.id,
            position: index + 1,
            category_id: oldCategoryId,
          });
        } else if (
          (oldIndex < newIndex && index > oldIndex && index <= newIndex) ||
          (oldIndex > newIndex && index < oldIndex && index >= newIndex)
        ) {
          // For rows that shift positions due to the move, update their positions
          updatedRows.push({
            id: row.id,
            position: index + (oldIndex < newIndex ? -1 : 1), // Adjust position based on direction of move
            category_id: oldCategoryId,
          });
        }
      });
    } else {
      // Handle if the item is moved to a different category
      updatedRows.push({
        id: movedRow.id,
        category_id: newCategoryId,
        position: Number(newIndex) + 1, // Position in the new category
      });
    }

    return updatedRows;
  };
</script>

<template>
  <card class="mb-6 overflow-y-visible px-4 lg:px-8 py-4">
    <div class="overflow-x-auto relative">
      <table-root>
        <template
          v-for="category in data.selectedPack?.categories"
          :key="category.id">
          <!-- Category title header -->
          <table-header>
            <table-row
              class="bg-gray-100 dark:bg-accent group"
              no-hover-effect>
              <table-head
                class="p-0 w-8"
                colspan="1">
                <icon-grip-vertical class="!size-6 category-handle cursor-move ease-snap group-hover:opacity-100 opacity-0 stroke-1 text-muted-foreground transition" />
              </table-head>
              <table-head
                class="font-bold px-0 py-2"
                :colspan="columns.length - 2">
                <gc-inline-edit
                  data-testid="category-name"
                  hide-edit-btn
                  input-classes="w-full max-w-[25rem]"
                  :model-value="category.name"
                  :name="`category_id_${category.id}`"
                  placeholder="Category Name"
                  size="sm"
                  @update:model-value="emit('handleUpdateCategory', {
                    id: category.id,
                    field: 'name',
                    value: $event
                  })">
                  <typography
                    :class="!category.name ? 'text-gray-400' : 'text-text'"
                    variant="h5">
                    {{ category.name || 'Category Name' }}
                  </typography>
                </gc-inline-edit>
              </table-head>
              <table-head class="pr-2">
                <div class="flex justify-end">
                  <button-root
                    class="bg-transparent dark:hover:bg-destructive-light hover:bg-destructive/10 cursor-pointer duration-150 ease-snap h-8 dark:hover:text-destructive items-center justify-center rounded-full transition w-8"
                    size="icon"
                    variant="ghost"
                    @click="emit('handleRemoveCategory', category.id)">
                    <icon-trash />
                  </button-root>
                </div>
              </table-head>
            </table-row>
          </table-header>

          <!-- Column Headers -->
          <table-header>
            <table-row no-hover-effect>
              <table-head
                v-for="column in columns"
                :key="column.value"
                class="font-bold px-0 py-2"
                :class="cn(
                  column.visible ? 'opacity-1' : 'opacity-0',
                  column.cellClass,
                  { '!pr-2': column.value === 'actions', 'w-8': column.value === 'drag' },
                )">
                {{ column.label }}
              </table-head>
            </table-row>
          </table-header>

          <table-body
            v-if="category.category_items.length"
            v-draggable="[category.category_items, {
              animation: 150,
              direction: 'vertical',
              group: {
                name: 'category_items',
                put: true,
                pull: true,
              },
              handle: '.row-handle',
              onEnd: (event: DraggableEvent) => {
                console.log({ event });
                const updatedRows = calculateUpdatedPositions(event);
                console.log({ updatedRows });
                // updatePositions(updatedRows);
              },
            }]"
            :data-category-id="category.id">
            <table-row
              v-for="catItem in category.category_items"
              :key="catItem.id"
              class="group">
              <!-- drag -->
              <table-cell class="p-0">
                <icon-grip-vertical class="!size-6 cursor-move ease-snap group-hover:opacity-100 opacity-0 row-handle stroke-1 text-muted-foreground transition" />
              </table-cell>

              <table-cell class="pl-0 pr-1 py-1">
                <!-- name -->
                <gc-inline-edit
                  hide-edit-btn
                  :model-value="catItem.item.name"
                  :name="`item_name_${catItem.id}`"
                  size="sm"
                  span-classes="min-w-[5rem]"
                  @update:model-value="$store.updateItem(catItem.item, 'name', ($event as string | undefined), category.id)">
                  <typography
                    :class="cn({ '!text-gray-400': !catItem.item.name })"
                    variant="muted">
                    {{ catItem.item.name || 'Item Name' }}
                  </typography>
                </gc-inline-edit>
              </table-cell>

              <!-- generic_type -->
              <table-cell class="p-1">
                <gc-inline-edit
                  hide-edit-btn
                  :model-value="catItem.item.generic_type"
                  :name="`item_generic_type_${catItem.id}`"
                  size="sm"
                  span-classes="min-w-[5rem]"
                  @update:model-value="$store.updateItem(catItem.item, 'generic_type', ($event as string | undefined), category.id)">
                  <typography :class="cn({ '!text-gray-400': !catItem.item.generic_type })">
                    {{ catItem.item.generic_type || 'Item Description' }}
                  </typography>
                </gc-inline-edit>
              </table-cell>

              <!-- consumable -->
              <table-cell class="p-1">
                <div class="flex place-content-center w-full">
                  <button
                    class="cursor-pointer duration-150 ease-expo flex justify-center items-center h-8 rounded-full transition w-8"
                    :class="catItem.item.consumable ? 'bg-primary hover:bg-primary/70' : 'bg-transparent hover:bg-gray-200'"
                    @click="$store.updateItem(catItem.item, 'consumable', !catItem.item.consumable, category.id)">
                    <icon-apple
                      class="h-5 w-5"
                      :class="catItem.item.consumable ? 'text-primary-foreground' : 'text-dark-grey'" />
                  </button>
                </div>
              </table-cell>

              <!-- worn -->
              <table-cell class="p-1">
                <div class="flex place-content-center w-full">
                  <button
                    class="cursor-pointer duration-150 ease-expo flex justify-center items-center h-8 rounded-full transition w-8"
                    :class="catItem.item.worn ? 'bg-accent-alt dark:bg-accent-light hover:bg-accent-alt/70' : 'bg-transparent hover:bg-gray-200'"
                    @click="$store.updateItem(catItem.item, 'worn', !catItem.item.worn, category.id)">
                    <icon-shirt
                      class="h-5 w-5"
                      :class="catItem.item.worn ? 'text-primary-foreground' : 'text-dark-grey'" />
                  </button>
                </div>
              </table-cell>

              <!-- weight -->
              <table-cell class="p-1">
                <div class="flex mx-auto place-content-center w-fit">
                  <gc-inline-edit
                    hide-edit-btn
                    :model-value="catItem.item.weight"
                    :name="`item_weight_${catItem.id}`"
                    size="sm"
                    span-classes="min-w-[3rem] justify-center !w-fit"
                    @update:model-value="$store.updateItem(catItem.item, 'weight', ($event as Mass | undefined), category.id)">
                    <typography>
                      {{ catItem.item.weight }}
                    </typography>
                  </gc-inline-edit>
                  <select-root
                    class="w-4"
                    :model-value="(catItem.item.unit as Mass)"
                    :name="`item_unit_${catItem.id}`"
                    @update:model-value="$store.updateItem(catItem.item, 'unit', $event, category.id)">
                    <select-trigger class="border-0 justify-start w-fit">
                      <span>
                        {{ weightOptions({ shortLabel: true }).find(w => w.value === catItem.item.unit)?.label || 'Select Unit' }}
                      </span>
                    </select-trigger>
                    <select-content>
                      <select-group>
                        <select-item
                          v-for="option in weightOptions()"
                          :key="option.value"
                          hide-checkmark
                          :value="option.value">
                          {{ option.label }}
                        </select-item>
                      </select-group>
                    </select-content>
                  </select-root>
                </div>
              </table-cell>

              <!-- price -->
              <table-cell class="p-1">
                <div class="flex place-content-center w-full">
                  <gc-inline-edit
                    hide-edit-btn
                    :model-value="catItem.item.price"
                    :name="`item_price_${catItem.id}`"
                    size="sm"
                    span-classes="min-w-[2rem] !mx-auto justify-center"
                    @update:model-value="$store.updateItem(catItem.item, 'price', ($event as number | undefined), category.id)">
                    <typography>
                      ${{ catItem.item.price }}
                    </typography>
                  </gc-inline-edit>
                </div>
              </table-cell>

              <!-- quantity -->
              <table-cell class="p-1">
                <div class="flex place-content-center w-full">
                  <gc-inline-edit
                    hide-edit-btn
                    :model-value="catItem.item.quantity"
                    :name="`item_quantity_${catItem.id}`"
                    size="sm"
                    span-classes="min-w-[2rem] !mx-auto justify-center"
                    @update:model-value="$store.updateItem(catItem.item, 'quantity', ($event as number | undefined), category.id)">
                    <typography>
                      {{ catItem.item.quantity || 0 }}
                    </typography>
                  </gc-inline-edit>
                </div>
              </table-cell>

              <!-- actions -->
              <table-cell class="p-1 pr-2">
                <div class="grid grid-cols-[auto,auto] gap-1 justify-end items-center">
                  <button-root
                    v-tippy="{ content: 'Add/Modify URL', placement: 'top' }"
                    :class="cn('bg-transparent dark:hover:bg-destructive-light hover:bg-destructive/10 cursor-pointer duration-150 ease-snap h-8 dark:hover:text-destructive items-center justify-center rounded-full transition w-8', catItem.item.url ? 'bg-tertiary dark:bg-tertiary-foreground hover:bg-tertiary/70' : 'bg-transparent hover:bg-gray-200 dark:hover:bg-tertiary-foreground')"
                    size="icon"
                    variant="ghost"
                    @click="emit('handleAddUrl', catItem.category_id)">
                    <icon-link :class="cn('h-5 w-5', catItem.item.url ? 'text-primary-foreground' : 'text-dark-gray')" />
                  </button-root>
                  <button-root
                    class="bg-transparent dark:hover:bg-destructive-light hover:bg-destructive/10 cursor-pointer duration-150 ease-snap h-8 dark:hover:text-destructive items-center justify-center rounded-full transition w-8"
                    size="icon"
                    variant="ghost"
                    @click="emit('handleRemoveItem', catItem.id)">
                    <icon-trash class="h-5 w-5" />
                  </button-root>
                </div>
              </table-cell>
            </table-row>
          </table-body>

          <!-- Empty Row -->
          <table-body v-else>
            <table-row>
              <table-empty>
                No items in this category
              </table-empty>
            </table-row>
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
                    {{ calculateCategoryWeight(category) }}
                  </span>
                  <select-root
                    class="max-w-4"
                    :model-value="(category.unit as Mass)"
                    @update:model-value="emit('handleUpdateCategory', {
                      id: category.id,
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
                ${{ calculateCategoryPrice(category) }}
              </table-cell>
              <table-cell
                class="px-0 py-2 text-center w-fit"
                colspan="1">
                {{ calculateCategoryQuantity(category) }}
              </table-cell>
              <table-cell
                class="px-0 py-2 text-right w-fit"
                colspan="1">
                <button-root
                  size="sm"
                  variant="outline"
                  @click="() => createDefaultItem(category.id)">
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