<script lang='ts' setup>
  import EasyDataTable, { type Header, type HeaderItemClassNameFunction } from 'vue3-easy-data-table';
  import draggable from 'vuedraggable';
  import { AppleIcon, GripVerticalIcon, LinkIcon, PlusIcon, ShirtIcon, TrashIcon } from 'lucide-vue-next';
  import { useAppStore } from '@/stores/app';
  import type { ExtendedCategory } from '@/types/helpers';
  import type { Database, Item } from '@/types';

  export interface RowItem extends Item {
    category_item_id: number;
    position: number;
  }
  
  interface Props {
    category: ExtendedCategory;
  }

  const props = defineProps<Props>();
  const emit = defineEmits([
    'handleUpdateCategory',
    'handleRemoveCategory',
    'handleAddUrl',
    'handleRemoveItem',
  ]);
  const $store = useClosetStore();
  const { data } = storeToRefs($store);

  // define item header classes
  const headerItemClassNameFunction: HeaderItemClassNameFunction = (header: Header): string => {
    if (header.value === 'drag') return 'px-2 py-3 w-4';
    else if (header.value === 'actions') return 'text-right px-6 py-3';
    else if (header.value === 'name' || header.value === 'generic_type') return 'px-6 py-3 text-left';
    return 'px-6 py-3 text-center';
  };

  // define table columns
  const columns: Header[] = [
    { value: 'drag', text: '', width: 16 },
    { value: 'name', text: 'Name' },
    { value: 'generic_type', text: 'Description' },
    { value: 'consumable', text: 'Consumable' },
    { value: 'worn', text: 'Worn' },
    { value: 'weight', text: 'Weight' },
    { value: 'price', text: 'Price' },
    { value: 'quantity', text: 'Quantity' },
    { value: 'actions', text: 'Actions' },
  ];

  // generate table rows
  const rows = ref<RowItem[]>([]);
  watch(() => props.category.category_items, (newVal) => {
    rows.value = newVal.map(categoryItem => ({
      ...categoryItem?.item,
      position: categoryItem.position || 0,
      category_item_id: categoryItem.id,
    }));
  }, { immediate: true, deep: true });

  const $appStore = useAppStore();
  const updatePositions = async (records: any[]) => {
    const supabase = useSupabaseClient<Database>();
    const { error } = await supabase.rpc('update_positions', { records });
    if (error) throw error;
  };

  /**
   * Update the item positions when reordered within the same table
   */
  const onSortEnd = async () => {
    console.log(`onSortEnd`);
    // try {
    //   await nextTick();

    //   const originalPositions = rows.value.map(row => row.position);
    //   const updatedRows = rows.value.map((row, index) => ({ ...row, position: index + 1 }));

    //   const payload = updatedRows.map((row, index) => {
    //     return {
    //       category_item_id: row.category_item_id,
    //       category_id: props.category.id,
    //       item_id: row.id,
    //       new_position: index + 1,
    //     };
    //   })
    //     .filter((row, index) => row.new_position !== originalPositions[index]);
    //   if (!payload.length) return;
    //   await updatePositions(payload);
    // } catch (err: any) {
    //   $appStore.notifyNegative('Error updating item position');
    // }
  };

  /**
   * Updates the item positions when the user inserts a new item
   */
  const onSortInsert = ({ newIndex, value }: { newIndex: number, value: RowItem }) => {
    value.position = newIndex + 1;
    const payload = [{
      category_item_id: value.category_item_id,
      category_id: props.category.id,
      item_id: value.id,
      new_position: newIndex + 1,
    }];
    updatePositions(payload);
  };

  /**
   *  Updates the item positions when the user removes an item
   */
  const onSortRemove = ({ oldIndex }: { oldIndex: number }) => {
    // Get the removed item based on the oldIndex
    const removedItem = rows.value[oldIndex];
    if (!removedItem) {
      console.error('The removed item is undefined');
      return;
    }
    // Update the positions of the remaining items and persist the changes
    const updatedRows = rows.value.filter(row => row.id !== removedItem.id)
      .map((row, index) => ({ ...row, position: index + 1 }));
    const payload = updatedRows.map((row, index) => ({
      category_item_id: row.category_item_id,
      category_id: props.category.id,
      item_id: row.id,
      new_position: index + 1,
    }));
    updatePositions(payload);
  };

  /**
   * Optimistically create a new item
   */
  const createItem = async () => {
    try {
      const user = useSupabaseUser();

      // This is the item for the server request
      const newItem = { ...generateItem(), profile_id: user.value?.id } as Item;

      // This is the item for the optimistic update
      const optimisticItem = {
        ...newItem,
        id: 0,
      };

      // This is the category item for the optimistic update
      const optimisticCategoryItem = {
        id: 0,
        category_id: props.category.id,
        item_id: optimisticItem.id,
        position: rows.value.length + 1,
        created_at: new Date()
          .toISOString(),
        updated_at: new Date()
          .toISOString(),
        item: optimisticItem,
      };

      const category = data.value.selectedPack?.categories.find(cat => cat.id === props.category.id);
      category?.category_items.push(optimisticCategoryItem);

      const supabase = useSupabaseClient<Database>();
      const { data: createdItem, error: itemError } = await supabase.from('items')
        .insert([newItem])
        .select();
      if (itemError) throw itemError;

      const newCategoryItem = {
        category_id: props.category.id,
        item_id: createdItem[0].id,
        position: rows.value.length + 1,
      };

      const { data: createdCategoryItem, error: categoryItemError } = await supabase.from('category_items')
        .insert([newCategoryItem])
        .select();
      if (categoryItemError) throw categoryItemError;

      // replace the temporary item with the new item
      const newCategoryItemWithId = {
        ...optimisticCategoryItem,
        id: createdCategoryItem[0].id,
        item_id: createdItem[0].id,
        item: createdItem[0],
      };
      category?.category_items.splice(-1, 1, newCategoryItemWithId);
    } catch (err) {
      const category = data.value.selectedPack?.categories.find(cat => cat.id === props.category.id);
      category?.category_items.pop();
      $appStore.notifyNegative('Error creating item');
    }
  };
</script>

<template>
  <div class="!bg-gray-100 !shadow-none card card-aside mb-6">
    <div class="flex justify-between items-center">
      <gc-inline-edit
        class="mb-3"
        input-classes="w-full max-w-[25rem]"
        :model-value="category.name"
        :name="`category_name_${category.id}}`"
        size="sm"
        @handle-update="emit('handleUpdateCategory', { field: 'name', value: $event })">
        <p class="!font-bold text-base">
          {{ category.name }}
        </p>
      </gc-inline-edit>
      <gc-button
        :icon="TrashIcon"
        round
        variant="danger"
        @click="emit('handleRemoveCategory', category)" />
    </div>

    <div class="overflow-x-auto relative rounded-b-2xl">
      <easy-data-table
        body-row-class-name="bg-white hover:bg-gray-50 border-b last:border-0 duration-150 ease-expo group transition"
        :header-item-class-name="headerItemClassNameFunction"
        :headers="columns"
        hide-footer
        :items="rows"
        table-class-name="text-gray-500 text-left text-sm w-full [&_table]:w-full">
        <!-- Empty -->
        <template #empty-message>
          <div class="flex justify-center items-center flex-col py-8">
            <p class="mb-4 text-base text-gray-500">
              No items found
            </p>
            <gc-button
              outlined
              size="sm"
              variant="positive"
              @click="createItem">
              <plus-icon class="h-4 mr-3 w-4" />
              New Item
            </gc-button>
          </div>
        </template>

        <template #body>
          <draggable
            v-model="rows"
            class="vue3-easy-data-table__body"
            handle=".handle"
            item-key="id"
            tag="tbody"
            @end="onSortEnd">
            <template #item="{ element }">
              <tr class="bg-white hover:bg-gray-50 border-b last:border-0 duration-150 ease-expo group group transition last:rounded-b-2xl">
                <!-- Drag -->
                <td>
                  <div class="flex items-center px-2 py-4">
                    <grip-vertical-icon class="cursor-move group-hover:opacity-100 h-4 handle opacity-0 text-gray-400 w-4" />
                  </div>
                </td>

                <!-- Name -->
                <td>
                  <div class="font-medium px-6 py-4 text-gray-900 whitespace-nowrap">
                    <gc-inline-edit
                      hide-edit-btn
                      :model-value="element.name"
                      :name="`item_name_${element.id}}`"
                      size="sm"
                      span-classes="min-w-[5rem]"
                      @handle-update="$store.updateItem(element, 'name', $event, category.id)">
                      <p class="!font-medium text-gray-900">
                        {{ element.name }}
                      </p>
                    </gc-inline-edit>
                  </div>
                </td>

                <!-- Generic Type -->
                <td>
                  <div class="px-6 py-4">
                    <gc-inline-edit
                      hide-edit-btn
                      :model-value="element.generic_type"
                      :name="`item_generic_type_${element.id}}`"
                      size="sm"
                      span-classes="min-w-[6rem]"
                      @handle-update="$store.updateItem(element, 'generic_type', $event, category.id)">
                      <p class="!font-medium text-gray-500">
                        {{ element.generic_type }}
                      </p>
                    </gc-inline-edit>
                  </div>
                </td>

                <!-- Consumable -->
                <td>
                  <div class="px-6 py-4">
                    <div class="flex justify-center items-center">
                      <button
                        class="cursor-pointer duration-150 ease-expo flex justify-center items-center h-8 rounded-full transition w-8"
                        :class="element.consumable ? 'bg-info hover:bg-info/70' : 'bg-transparent hover:bg-gray-200'"
                        @click="$store.updateItem(element, 'consumable', !element.consumable, category.id)">
                        <apple-icon
                          class="h-5 text-gray-500 w-5"
                          :class="element.consumable ? 'text-white' : 'text-dark-grey'" />
                      </button>
                    </div>
                  </div>
                </td>

                <!-- Worn -->
                <td>
                  <div class="px-6 py-4">
                    <div class="flex justify-center items-center">
                      <button
                        class="cursor-pointer duration-150 ease-expo flex justify-center items-center h-8 rounded-full transition w-8"
                        :class="element.worn ? 'bg-positive hover:bg-positive/70' : 'bg-transparent hover:bg-gray-200'"
                        @click="$store.updateItem(element, 'worn', !element.worn, category.id)">
                        <shirt-icon
                          class="h-5 text-gray-500 w-5"
                          :class="element.worn ? 'text-white' : 'text-dark-grey'" />
                      </button>
                    </div>
                  </div>
                </td>

                <!-- Weight -->
                <td>
                  <div class="px-6 py-4">
                    <div class="flex justify-center items-center max-w-[4rem] mx-auto">
                      <gc-inline-edit
                        hide-edit-btn
                        :model-value="element.weight"
                        :name="`item_weight_${element.id}`"
                        size="sm"
                        span-classes="justify-center min-w-[3rem]"
                        @handle-update="$store.updateItem(element, 'weight', Number($event), category.id)">
                        {{ element.weight }}
                      </gc-inline-edit>
                    </div>
                  </div>
                </td>

                <!-- Price -->
                <td>
                  <div class="px-6 py-4">
                    <div class="flex justify-center items-center">
                      <gc-inline-edit
                        class="justify-center min-w-[3rem]"
                        hide-edit-btn
                        :model-value="(element.price ?? 0) / 100"
                        :name="`item_price_${element.id}`"
                        size="sm"
                        @handle-update="$store.updateItem(element, 'price', Number($event) * 100, category.id)">
                        {{ convertCurrency(element.price || 0) }}
                      </gc-inline-edit>
                    </div>
                  </div>
                </td>

                <!-- Quantity -->
                <td>
                  <div class="px-6 py-4">
                    <div class="flex justify-center items-center max-w-[4rem] mx-auto">
                      <gc-inline-edit
                        hide-edit-btn
                        :model-value="element.quantity"
                        :name="`item_quantity_${element.id}`"
                        size="sm"
                        span-classes="min-w-[3rem] justify-center"
                        @handle-update="$store.updateItem(element, 'quantity', Number($event), category.id)">
                        {{ element.quantity }}
                      </gc-inline-edit>
                    </div>
                  </div>
                </td>

                <!-- Actions -->
                <td>
                  <div class="px-6 py-4 text-right">
                    <div class="grid grid-cols-[auto,auto] gap-4 justify-end items-center relative">
                      <button
                        v-tippy="{ content: element.url ? 'Modify URL' : 'Add URL' }"
                        class="cursor-pointer duration-150 ease-snap flex justify-center justify-self-end items-center h-8 rounded-full transition w-8"
                        :class="element.url ? 'bg-warning hover:bg-warning/70' : 'bg-transparent hover:bg-gray-200'"
                        @click="emit('handleAddUrl', element, category.id)">
                        <link-icon
                          class="h-5 w-5 "
                          :class="element.url ? 'text-white' : 'text-dark-grey'" />
                      </button>
                      <button
                        v-tippy="{ content: 'Remove from category' }"
                        class="justify-self-end"
                        @click="emit('handleRemoveItem', element)">
                        <trash-icon class="duration-150 ease-snap h-5 text-gray-500 hover:text-danger transition w-5" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </draggable>
        </template>

        <!-- Drag -->
        <!-- <template #item-drag="">
          <div class="flex items-center px-2 py-4">
            <grip-vertical-icon class="cursor-move group-hover:opacity-100 h-4 opacity-0 text-gray-400 w-4" />
          </div>
        </template> -->

        <!-- Name -->
        <!-- <template #item-name="row">
          <div class="font-medium px-6 py-4 text-gray-900 whitespace-nowrap">
            <gc-inline-edit
              hide-edit-btn
              :model-value="row.name"
              :name="`item_name_${row.id}}`"
              size="sm"
              span-classes="min-w-[5rem]"
              @handle-update="$store.updateItem(row, 'name', $event, category.id)">
              <p class="!font-medium text-gray-900">
                {{ row.name }}
              </p>
            </gc-inline-edit>
          </div>
        </template> -->

        <!-- Generic Type -->
        <!-- <template #item-generic_type="row">
          <div class="px-6 py-4">
            <gc-inline-edit
              hide-edit-btn
              :model-value="row.generic_type"
              :name="`item_generic_type_${row.id}}`"
              size="sm"
              span-classes="min-w-[6rem]"
              @handle-update="$store.updateItem(row, 'generic_type', $event, category.id)">
              <p class="!font-medium text-gray-500">
                {{ row.generic_type }}
              </p>
            </gc-inline-edit>
          </div>
        </template> -->

        <!-- Consumable -->
        <!-- <template #item-consumable="row">
          <div class="px-6 py-4">
            <div class="flex justify-center items-center">
              <button
                class="cursor-pointer duration-150 ease-expo flex justify-center items-center h-8 rounded-full transition w-8"
                :class="row.consumable ? 'bg-info hover:bg-info/70' : 'bg-transparent hover:bg-gray-200'"
                @click="$store.updateItem(row, 'consumable', !row.consumable, category.id)">
                <apple-icon
                  class="h-5 text-gray-500 w-5"
                  :class="row.consumable ? 'text-white' : 'text-dark-grey'" />
              </button>
            </div>
          </div>
        </template> -->

        <!-- Worn -->
        <!-- <template #item-worn="row">
          <div class="px-6 py-4">
            <div class="flex justify-center items-center">
              <button
                class="cursor-pointer duration-150 ease-expo flex justify-center items-center h-8 rounded-full transition w-8"
                :class="row.worn ? 'bg-positive hover:bg-positive/70' : 'bg-transparent hover:bg-gray-200'"
                @click="$store.updateItem(row, 'worn', !row.worn, category.id)">
                <shirt-icon
                  class="h-5 text-gray-500 w-5"
                  :class="row.worn ? 'text-white' : 'text-dark-grey'" />
              </button>
            </div>
          </div>
        </template> -->

        <!-- Weight -->
        <!-- <template #item-weight="row">
          <div class="px-6 py-4">
            <div class="flex justify-center items-center max-w-[4rem] mx-auto">
              <gc-inline-edit
                hide-edit-btn
                :model-value="row.weight"
                :name="`item_weight_${row.id}`"
                size="sm"
                span-classes="justify-center min-w-[3rem]"
                @handle-update="$store.updateItem(row, 'weight', Number($event), category.id)">
                {{ row.weight }}
              </gc-inline-edit>
            </div>
          </div>
        </template> -->

        <!-- Price -->
        <!-- <template #item-price="row">
          <div class="px-6 py-4">
            <div class="flex justify-center items-center">
              <gc-inline-edit
                class="justify-center min-w-[3rem]"
                hide-edit-btn
                :model-value="(row.price ?? 0) / 100"
                :name="`item_price_${row.id}`"
                size="sm"
                @handle-update="$store.updateItem(row, 'price', Number($event) * 100, category.id)">
                {{ convertCurrency(row.price || 0) }}
              </gc-inline-edit>
            </div>
          </div>
        </template> -->

        <!-- Quantity -->
        <!-- <template #item-quantity="row">
          <div class="px-6 py-4">
            <div class="flex justify-center items-center max-w-[4rem] mx-auto">
              <gc-inline-edit
                hide-edit-btn
                :model-value="row.quantity"
                :name="`item_quantity_${row.id}`"
                size="sm"
                span-classes="min-w-[3rem] justify-center"
                @handle-update="$store.updateItem(row, 'quantity', Number($event), category.id)">
                {{ row.quantity }}
              </gc-inline-edit>
            </div>
          </div>
        </template> -->

        <!-- Actions -->
        <!-- <template #item-actions="row">
          <div class="px-6 py-4 text-right">
            <div class="grid grid-cols-[auto,auto] gap-4 justify-end items-center relative">
              <button
                v-tippy="{ content: row.url ? 'Modify URL' : 'Add URL' }"
                class="cursor-pointer duration-150 ease-snap flex justify-center justify-self-end items-center h-8 rounded-full transition w-8"
                :class="row.url ? 'bg-warning hover:bg-warning/70' : 'bg-transparent hover:bg-gray-200'"
                @click="emit('handleAddUrl', row, category.id)">
                <link-icon
                  class="h-5 w-5 "
                  :class="row.url ? 'text-white' : 'text-dark-grey'" />
              </button>
              <button
                v-tippy="{ content: 'Remove from category' }"
                class="justify-self-end"
                @click="emit('handleRemoveItem', row)">
                <trash-icon class="duration-150 ease-snap h-5 text-gray-500 hover:text-danger transition w-5" />
              </button>
            </div>
          </div>
        </template> -->
      </easy-data-table>
      <div
        v-if="rows.length > 0"
        class="flex justify-end py-3">
        <gc-button
          outlined
          size="sm"
          variant="positive"
          @click="createItem">
          <plus-icon class="h-4 mr-3 w-4" />
          New Item
        </gc-button>
      </div>
    </div>
  </div>
</template>
