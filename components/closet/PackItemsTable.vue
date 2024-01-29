<script lang='ts' setup>
  import { DragHandle, SlickList, SlickItem } from 'vue-slicksort';
  import { AppleIcon, GripVerticalIcon, LinkIcon, ShirtIcon, TrashIcon } from 'lucide-vue-next';
  import { useAppStore } from '@/stores/app';
  import type { ExtendedCategory } from '@/types/helpers';
  import type { Database, Item } from '@/types';

  interface Column {
    name: string;
    label: string;
    align: string;
  }

  export interface RowItem extends Item {
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

  const columns: Column[] = [
    { name: 'drag', label: '', align: 'left' },
    { name: 'name', label: 'Name', align: 'left' },
    { name: 'generic_type', label: 'Description', align: 'left' },
    { name: 'consumable', label: 'Consumable', align: 'center' },
    { name: 'worn', label: 'Worn', align: 'center' },
    { name: 'weight', label: 'Weight', align: 'center' },
    { name: 'price', label: 'Price', align: 'center' },
    { name: 'quantity', label: 'Quantity', align: 'center' },
    { name: 'actions', label: 'Actions', align: 'right' },
  ];

  const rows = ref<RowItem[]>([]);
  watch(() => props.category.category_items, (newVal) => {
    rows.value = newVal.map(categoryItem => ({
      ...categoryItem?.item,
      position: categoryItem.position || 0,
    }));
  }, { immediate: true });

  const $appStore = useAppStore();
  const onSortEnd = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      await nextTick();

      const originalPositions = rows.value.map(row => row.position);
      const updatedRows = rows.value.map((row, index) => ({ ...row, position: index + 1 }));

      const payload = updatedRows.map((row, index) => {
        return {
          category_id: props.category.id,
          item_id: row.id,
          new_position: index + 1,
        };
      })
        .filter((row, index) => row.new_position !== originalPositions[index]);
      const { error } = await supabase.rpc('update_positions', { records: payload });
      if (error) throw error;
    } catch (err: any) {
      $appStore.notifyNegative('Error updating item position');
    }
  };
</script>

<template>
  <div class="!bg-gray-100 !shadow-none card card-aside">
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

    <!-- Table to display items of a category -->
    <div class="overflow-x-auto relative rounded-b-2xl">
      <table class="text-gray-500 text-left text-sm w-full">
        <thead class="bg-gray-100 text-gray-700 text-xs uppercase">
          <tr>
            <th
              v-for="column in columns"
              :key="column.name"
              :class="[
                { 'text-center': column.align === 'center' },
                { 'text-left': column.align === 'left' },
                { 'text-right': column.align === 'right' },
                column.name === 'drag' ? 'w-4 px-2 py-3' : 'px-6 py-3',
              ]"
              scope="col">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <slick-list
          v-model:list="rows"
          :accept="true"
          axis="y"
          :dragged-setting-duration="150"
          group="category-table"
          lock-axis="y"
          tag="tbody"
          :transition-duration="250"
          use-drag-handle
          @sort-end="onSortEnd">
          <slick-item
            v-for="( row, i ) in rows"
            :key="row.id"
            class="bg-white hover:bg-gray-50 border-b last:border-0 duration-150 ease-expo group transition"
            :index="i"
            tag="tr">
            <drag-handle
              class="px-2 py-4"
              tag="th">
              <grip-vertical-icon class="cursor-move group-hover:opacity-100 h-4 opacity-0 text-gray-400 w-4" />
            </drag-handle>
            <th
              class="font-medium px-6 py-4 text-gray-900 whitespace-nowrap"
              scope="row">
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
            </th>
            <td class="px-6 py-4">
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
            </td>
            <td class="px-6 py-4">
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
            </td>
            <td class="px-6 py-4">
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
            </td>
            <td class="px-6 py-4">
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
            </td>
            <td class="px-6 py-4">
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
            </td>
            <td class="px-6 py-4">
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
            </td>
            <td class="px-6 py-4 text-right">
              <div class="grid grid-cols-[auto,auto] gap-4 justify-end items-center relative">
                <!-- Add URL -->
                <button
                  v-tippy="{ content: row.url ? 'Modify URL' : 'Add URL' }"
                  class="cursor-pointer duration-150 ease-snap flex justify-center justify-self-end items-center h-8 rounded-full transition w-8"
                  :class="row.url ? 'bg-warning hover:bg-warning/70' : 'bg-transparent hover:bg-gray-200'"
                  @click="emit('handleAddUrl', row, category.id)">
                  <link-icon
                    class="h-5 w-5 "
                    :class="row.url ? 'text-white' : 'text-dark-grey'" />
                </button>
                <!-- Remove From Category -->
                <button
                  v-tippy="{ content: 'Remove from category' }"
                  class="justify-self-end"
                  @click="emit('handleRemoveItem', row)">
                  <trash-icon class="duration-150 ease-snap h-5 text-gray-500 hover:text-danger transition w-5" />
                </button>
              </div>
            </td>
          </slick-item>
        </slick-list>
      </table>
    </div>
  </div>
</template>
