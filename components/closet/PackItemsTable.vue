<script lang='ts' setup>
  import { vDraggable, type DraggableEvent } from 'vue-draggable-plus';
  import { type Mass } from 'convert';
  import { SelectContent , SelectGroup, SelectItem, SelectRoot, SelectTrigger, Typography } from '#components';
  import GcInlineEdit from '@/components/common/GcInlineEdit.vue';
  import { cn } from '@/lib/utils';
  import { weightOptions } from '@/utils/packMath';
  import type { Tables, TablesUpdate } from '@/types';

  const $store = useClosetStore();
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
    if (!payload.length) return;
    await $store.updateCategoryItems(payload);
  };

  // Calculate the updated positions when a row is moved and build the payload
  const calculateUpdatedPositions = (event: DraggableEvent) => {
    const { oldIndex, newIndex, to, from } = event;

    const newCategoryId = parseInt(to?.getAttribute('data-category-id')!);
    const oldCategoryId = parseInt(from?.getAttribute('data-category-id')!);

    // Same index within the same category is a no-op; cross-category moves still persist
    // even when indexes match (e.g. A[0] → B[0]).
    if (oldIndex === newIndex && oldCategoryId === newCategoryId) return [];

    const movedRow = event.data;

    // Find the categories by ID
    const getCategoryItems = (categoryId: number) =>
      $store.data.selectedPack?.categories.find(c => c.id === categoryId)?.category_items || [];

    const oldCategoryItems = getCategoryItems(oldCategoryId);
    const newCategoryItems = oldCategoryId === newCategoryId
      ? oldCategoryItems
      : getCategoryItems(newCategoryId);

    const updatedRows: TablesUpdate<'category_items'>[] = [];

    if (oldCategoryId === newCategoryId) {
      // Reorder within the same category
      oldCategoryItems.forEach((item, index) => {
        if (item.position !== index + 1) {
          updatedRows.push({
            id: item.id,
            position: index + 1,
            category_id: oldCategoryId,
          });
        }
      });
    } else {
      // Reorder in the old category
      oldCategoryItems.forEach((item, index) => {
        if (item.id !== movedRow.id && item.position !== index + 1) {
          updatedRows.push({
            id: item.id,
            position: index + 1,
            category_id: oldCategoryId,
          });
        }
      });

      // Reorder in the new category
      newCategoryItems.forEach((item, index) => {
        if (item.id === movedRow.id) {
          updatedRows.push({
            id: movedRow.id,
            position: index + 1,
            category_id: newCategoryId,
          });
        } else if (item.position !== index + 1) {
          updatedRows.push({
            id: item.id,
            position: index + 1,
            category_id: newCategoryId,
          });
        }
      });
    }

    return updatedRows;
  };

  const openUrl = (url: string | null) => {
    if (url) window.open(url, '_blank');
  };
</script>

<template>
  <card class="mb-6 overflow-y-visible px-4 lg:px-8 py-4">
    <div class="overflow-x-auto relative">
      <table-root>
        <template
          v-for="category in $store.data.selectedPack?.categories"
          :key="category.id">
          <!-- Category title header -->
          <table-header>
            <table-row
              class="bg-gray-100 dark:bg-accent group"
              no-hover-effect>
              <table-head
                class="p-0 w-8"
                colspan="1" />
              <table-head
                class="font-bold px-0 py-2"
                :colspan="columns.length - 2">
                <gc-inline-edit
                  v-if="!$store.isPublicRoute"
                  data-testid="category-name"
                  hide-edit-btn
                  input-classes="w-full max-w-100"
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
                <typography
                  v-else
                  :class="!category.name ? 'text-gray-400' : 'text-text'"
                  variant="h5">
                  {{ category.name || 'Category Name' }}
                </typography>
              </table-head>
              <table-head class="pr-2">
                <div
                  v-if="!$store.isPublicRoute"
                  class="flex justify-end">
                  <button-root
                    aria-label="Remove category"
                    class="bg-transparent dark:hover:bg-destructive-light hover:bg-destructive/10 cursor-pointer duration-150 ease-out h-8 dark:hover:text-destructive items-center justify-center rounded-full transition w-8"
                    data-testid="remove-category-btn"
                    size="icon"
                    type="button"
                    variant="ghost"
                    @click="emit('handleRemoveCategory', category.id)">
                    <icon-trash aria-hidden="true" />
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
                  column.visible ? 'opacity-100' : 'opacity-0',
                  column.cellClass,
                  { 'pr-2!': column.value === 'actions', 'w-8': column.value === 'drag' },
                )">
                {{ column.label }}
              </table-head>
            </table-row>
          </table-header>

          <!-- Always render draggable body so empty categories remain drop targets -->
          <table-body
            v-draggable="[category.category_items, {
              animation: 150,
              direction: 'vertical',
              filter: '.empty-category-row',
              group: {
                name: 'category_items',
                put: ['category_items'],
                pull: true,
              },
              handle: '.row-handle',
              onEnd: (event: DraggableEvent) => {
                const updatedRows = calculateUpdatedPositions(event);
                updatePositions(updatedRows);
              },
            }]"
            :data-category-id="category.id">
            <table-row
              v-for="catItem in category.category_items"
              :key="catItem.id"
              class="group">
              <!-- drag -->
              <table-cell class="p-0">
                <icon-grip-vertical
                  v-if="!$store.isPublicRoute"
                  class="size-6! cursor-move ease-out group-hover:opacity-100 opacity-0 row-handle stroke-1 text-muted-foreground transition" />
              </table-cell>

              <table-cell class="pl-0 pr-1 py-1">
                <!-- name -->
                <gc-inline-edit
                  v-if="!$store.isPublicRoute"
                  hide-edit-btn
                  :model-value="catItem.item.name"
                  :name="`item_name_${catItem.id}`"
                  size="sm"
                  span-classes="min-w-20"
                  @update:model-value="$store.updateItem(catItem.item, 'name', ($event as string | undefined), category.id)">
                  <typography
                    :class="cn({ 'text-gray-400!': !catItem.item.name })"
                    variant="muted">
                    {{ catItem.item.name || 'Item Name' }}
                  </typography>
                </gc-inline-edit>
                <typography
                  v-else
                  :class="cn({ 'text-gray-400!': !catItem.item.name })"
                  variant="muted">
                  {{ catItem.item.name || 'Item Name' }}
                </typography>
              </table-cell>

              <!-- generic_type -->
              <table-cell
                class="p-1"
                data-testid="generic-type-cell">
                <gc-inline-edit
                  v-if="!$store.isPublicRoute"
                  hide-edit-btn
                  :model-value="catItem.item.generic_type"
                  :name="`item_generic_type_${catItem.id}`"
                  size="sm"
                  span-classes="min-w-20"
                  @update:model-value="$store.updateItem(catItem.item, 'generic_type', ($event as string | undefined), category.id)">
                  <typography :class="cn({ 'text-gray-400!': !catItem.item.generic_type })">
                    {{ catItem.item.generic_type || 'Item Description' }}
                  </typography>
                </gc-inline-edit>
                <typography
                  v-else
                  :class="cn({ 'text-gray-400!': !catItem.item.generic_type })">
                  {{ catItem.item.generic_type || 'Item Description' }}
                </typography>
              </table-cell>

              <!-- consumable -->
              <table-cell class="p-1">
                <div class="flex place-content-center w-full">
                  <button
                    v-if="!$store.isPublicRoute"
                    :aria-label="catItem.item.consumable ? 'Mark item as not consumable' : 'Mark item as consumable'"
                    :aria-pressed="Boolean(catItem.item.consumable)"
                    class="cursor-pointer duration-150 ease-out flex justify-center items-center h-8 rounded-full transition w-8 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    :class="catItem.item.consumable ? 'bg-primary hover:bg-primary/70' : 'bg-transparent hover:bg-gray-200'"
                    data-testid="consumable-btn"
                    type="button"
                    @click="$store.updateItem(catItem.item, 'consumable', !catItem.item.consumable, category.id)">
                    <icon-apple
                      aria-hidden="true"
                      class="h-5 w-5"
                      :class="catItem.item.consumable ? 'text-primary-foreground' : 'text-muted-foreground'" />
                  </button>
                  <span
                    v-else
                    class="cursor-default duration-150 ease-out flex justify-center items-center h-8 rounded-full transition w-8"
                    :class="catItem.item.consumable ? 'bg-primary' : 'bg-transparent'">
                    <icon-apple
                      class="h-5 w-5"
                      :class="catItem.item.consumable ? 'text-primary-foreground' : 'text-muted-foreground'" />
                  </span>
                </div>
              </table-cell>

              <!-- worn -->
              <table-cell class="p-1">
                <div class="flex place-content-center w-full">
                  <button
                    v-if="!$store.isPublicRoute"
                    :aria-label="catItem.item.worn ? 'Mark item as not worn' : 'Mark item as worn'"
                    :aria-pressed="Boolean(catItem.item.worn)"
                    class="cursor-pointer duration-150 ease-out flex justify-center items-center h-8 rounded-full transition w-8 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    :class="catItem.item.worn ? 'bg-accent-alt dark:bg-accent-light hover:bg-accent-alt/70' : 'bg-transparent hover:bg-gray-200'"
                    data-testid="worn-btn"
                    type="button"
                    @click="$store.updateItem(catItem.item, 'worn', !catItem.item.worn, category.id)">
                    <icon-shirt
                      aria-hidden="true"
                      class="h-5 w-5"
                      :class="catItem.item.worn ? 'text-primary-foreground' : 'text-muted-foreground'" />
                  </button>
                  <span
                    v-else
                    class="cursor-default duration-150 ease-out flex justify-center items-center h-8 rounded-full transition w-8"
                    :class="catItem.item.worn ? 'bg-accent-alt dark:bg-accent-light' : 'bg-transparent'">
                    <icon-shirt
                      class="h-5 w-5"
                      :class="catItem.item.worn ? 'text-primary-foreground' : 'text-muted-foreground'" />
                  </span>
                </div>
              </table-cell>

              <!-- weight -->
              <table-cell
                class="p-1"
                data-testid="weight-cell">
                <div
                  v-if="!$store.isPublicRoute"
                  class="flex mx-auto place-content-center w-fit">
                  <gc-inline-edit
                    hide-edit-btn
                    :model-value="catItem.item.weight"
                    :name="`item_weight_${catItem.id}`"
                    size="sm"
                    span-classes="min-w-12 justify-center w-fit!"
                    @update:model-value="$store.updateItem(catItem.item, 'weight', ($event as Mass | undefined), category.id)">
                    <typography>
                      {{ catItem.item.weight }}
                    </typography>
                  </gc-inline-edit>
                  <select-root
                    class="w-4"
                    :model-value="(catItem.item.unit as Mass)"
                    :name="`item_unit_${catItem.id}`"
                    @update:model-value="$store.updateItem(catItem.item, 'unit', $event as Tables<'items'>['unit'], category.id)">
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
                <div
                  v-else
                  class="flex mx-auto place-content-center w-fit">
                  <typography>
                    {{ catItem.item.weight }} {{ catItem.item.unit }}
                  </typography>
                </div>
              </table-cell>

              <!-- price -->
              <table-cell
                class="p-1"
                data-testid="price-cell">
                <div class="flex place-content-center w-full">
                  <gc-inline-edit
                    v-if="!$store.isPublicRoute"
                    hide-edit-btn
                    :model-value="catItem.item.price"
                    :name="`item_price_${catItem.id}`"
                    size="sm"
                    span-classes="min-w-8 mx-auto! justify-center"
                    @update:model-value="$store.updateItem(catItem.item, 'price', ($event as number | undefined), category.id)">
                    <typography>
                      ${{ catItem.item.price }}
                    </typography>
                  </gc-inline-edit>
                  <typography v-else>
                    ${{ catItem.item.price }}
                  </typography>
                </div>
              </table-cell>

              <!-- quantity -->
              <table-cell
                class="p-1"
                data-testid="quantity-cell">
                <div class="flex place-content-center w-full">
                  <gc-inline-edit
                    v-if="!$store.isPublicRoute"
                    hide-edit-btn
                    :model-value="catItem.item.quantity"
                    :name="`item_quantity_${catItem.id}`"
                    size="sm"
                    span-classes="min-w-8 mx-auto! justify-center"
                    @update:model-value="$store.updateItem(catItem.item, 'quantity', ($event as number | undefined), category.id)">
                    <typography>
                      {{ catItem.item.quantity || 0 }}
                    </typography>
                  </gc-inline-edit>
                  <typography v-else>
                    {{ catItem.item.quantity || 0 }}
                  </typography>
                </div>
              </table-cell>

              <!-- actions -->
              <table-cell class="p-1 pr-2">
                <div class="grid grid-cols-[auto_auto] gap-1 justify-end items-center">
                  <button-root
                    v-if="!$store.isPublicRoute"
                    v-tippy="{ content: 'Add/Modify URL', placement: 'top' }"
                    aria-label="Add or edit item URL"
                    :class="cn('bg-transparent dark:hover:bg-destructive-light hover:bg-destructive/10 cursor-pointer duration-150 ease-out h-8 dark:hover:text-destructive items-center justify-center rounded-full transition w-8', catItem.item.url ? 'bg-tertiary dark:bg-tertiary-foreground hover:bg-tertiary/70' : 'bg-transparent hover:bg-gray-200 dark:hover:bg-tertiary-foreground')"
                    data-testid="add-url-btn"
                    size="icon"
                    type="button"
                    variant="ghost"
                    @click="emit('handleAddUrl', catItem.item, catItem.category_id)">
                    <icon-link
                      aria-hidden="true"
                      :class="cn('h-5 w-5', catItem.item.url ? 'text-primary-foreground' : 'text-dark-gray')" />
                  </button-root>
                  <button-root
                    v-if="!$store.isPublicRoute"
                    aria-label="Remove item"
                    class="bg-transparent dark:hover:bg-destructive-light hover:bg-destructive/10 cursor-pointer duration-150 ease-out h-8 dark:hover:text-destructive items-center justify-center rounded-full transition w-8"
                    data-testid="remove-item-btn"
                    size="icon"
                    type="button"
                    variant="ghost"
                    @click="emit('handleRemoveItem', catItem)">
                    <icon-trash
                      aria-hidden="true"
                      class="h-5 w-5" />
                  </button-root>
                  <button-root
                    v-if="$store.isPublicRoute"
                    v-tippy="{ content: 'Visit URL', placement: 'top' }"
                    aria-label="Visit item URL"
                    :class="cn('bg-transparent dark:hover:bg-destructive-light hover:bg-destructive/10 cursor-pointer duration-150 ease-out h-8 dark:hover:text-destructive items-center justify-center rounded-full transition w-8', catItem.item.url ? 'bg-tertiary dark:bg-tertiary-foreground hover:bg-tertiary/70' : 'bg-transparent hover:bg-gray-200 dark:hover:bg-tertiary-foreground')"
                    :disabled="!catItem.item.url"
                    size="icon"
                    type="button"
                    variant="ghost"
                    @click="openUrl(catItem.item.url)">
                    <icon-link
                      aria-hidden="true"
                      :class="cn('h-5 w-5', catItem.item.url ? 'text-primary-foreground' : 'text-dark-gray')" />
                  </button-root>
                </div>
              </table-cell>
            </table-row>

            <table-row
              v-if="!category.category_items.length"
              class="empty-category-row">
              <table-cell
                class="p-4 text-center text-sm text-muted-foreground"
                :colspan="columns.length">
                No items in this category
              </table-cell>
            </table-row>
          </table-body>

          <!-- Totals Row -->
          <table-body class="last:[&>tr]:border-b-0 bg-card border-t font-medium w-full">
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
                  <span
                    class="min-w-12"
                    data-testid="weight-total">
                    {{ calculateCategoryWeight(category) }}
                  </span>
                  <select-root
                    v-if="!$store.isPublicRoute"
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
                  <typography
                    v-else
                    class="font-bold!">
                    {{ category.unit }}
                  </typography>
                </div>
              </table-cell>
              <table-cell
                class="px-0 py-2 text-center w-fit"
                colspan="1"
                data-testid="price-total">
                ${{ calculateCategoryPrice(category) }}
              </table-cell>
              <table-cell
                class="px-0 py-2 text-center w-fit"
                colspan="1"
                data-testid="quantity-total">
                {{ calculateCategoryQuantity(category) }}
              </table-cell>
              <table-cell
                class="px-0 py-2 text-right w-fit"
                colspan="1">
                <button-root
                  v-if="!$store.isPublicRoute"
                  data-testid="new-item-btn"
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