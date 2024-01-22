<script lang='ts' setup>
  import { AppleIcon, GripVerticalIcon, LinkIcon, ShirtIcon, TrashIcon } from 'lucide-vue-next';
  import type { ExtendedCategory } from '@/types/helpers';
  import type { Item } from '@/types';

  interface Column {
    name: string;
    label: string;
    align: string;
  }

  interface RowItem extends Item {
    position: number;
  }
  
  interface Props {
    category: ExtendedCategory;
  }

  const props = defineProps<Props>();

  const emit = defineEmits(['update:modelValue', 'handleDeleteModal']);

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

  const rows = computed<RowItem[]>(() => {
    return props.category.category_items.map(categoryItem => ({
      ...categoryItem?.item,
      position: categoryItem.position || 0,
    }));
  });

  const updateItem = (
    item: RowItem,
    key: string,
    value: string | number | boolean | undefined,
  ) => {
    console.log(`updateItem: ${item}, ${key}, ${value}`);
  };

  const isAddUrlModalOpen = ref(false);
  const isRemoveItemModalOpen = ref(false);
</script>

<template>
  <div class="card card-aside">
    <div class="flex justify-between items-center">
      <gc-inline-edit
        class="mb-3"
        input-classes="w-full max-w-[25rem]"
        :model-value="category.name"
        name="category_name"
        size="sm"
        @handle-update="emit('update:modelValue', $event)">
        <p class="!font-bold text-base">
          {{ category.name }}
        </p>
      </gc-inline-edit>
      <gc-button
        :icon="TrashIcon"
        round
        variant="danger"
        @click="emit('handleDeleteModal', category)" />
    </div>

    <!-- Table to display items of a category -->
    <div class="overflow-x-auto relative rounded-b-2xl">
      <table class="text-gray-500 text-left text-sm w-full">
        <thead class="bg-gray-50 text-gray-700 text-xs uppercase">
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
        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="index"
            class="bg-white hover:bg-gray-50 border-b last:border-0 duration-150 ease-expo transition">
            <th>
              <grip-vertical-icon class="cursor-move h-4 text-gray-400 w-4" />
            </th>
            <th
              class="font-medium px-6 py-4 text-gray-900 whitespace-nowrap"
              scope="row">
              <gc-inline-edit
                hide-edit-btn
                :model-value="row.name"
                name="item_name"
                size="sm"
                @handle-update="updateItem(row, 'name', $event)">
                <p class="!font-medium text-gray-900">
                  {{ row.name }}
                </p>
              </gc-inline-edit>
            </th>
            <td class="px-6 py-4">
              <gc-inline-edit
                hide-edit-btn
                :model-value="row.generic_type"
                name="item_generic_type"
                size="sm"
                @handle-update="updateItem(row, 'generic_type', $event)">
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
                  @click="updateItem(row, 'consumable', !row.consumable)">
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
                  @click="updateItem(row, 'worn', !row.worn)">
                  <shirt-icon
                    class="h-5 text-gray-500 w-5"
                    :class="row.worn ? 'text-white' : 'text-dark-grey'" />
                </button>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center items-center">
                <gc-inline-edit
                  hide-edit-btn
                  :model-value="row.weight"
                  name="item_weight"
                  size="sm"
                  @handle-update="updateItem(row, 'weight', Number($event))">
                  {{ row.weight }}
                </gc-inline-edit>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center items-center">
                <gc-inline-edit
                  hide-edit-btn
                  :model-value="row.price"
                  name="item_price"
                  size="sm"
                  @handle-update="updateItem(row, 'price', Number($event))">
                  {{ convertCurrency(row.price || 0) }}
                </gc-inline-edit>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center items-center">
                <gc-inline-edit
                  hide-edit-btn
                  :model-value="row.quantity"
                  name="item_quantity"
                  size="sm"
                  @handle-update="updateItem(row, 'quantity', Number($event))">
                  {{ row.quantity }}
                </gc-inline-edit>
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="grid grid-cols-2 gap-4 justify-end items-center">
                <!-- Add URL -->
                <button
                  class="justify-self-end"
                  @click="isAddUrlModalOpen = true">
                  <link-icon class="duration-150 ease-snap h-5 text-gray-500 hover:text-primary transition w-5" />
                </button>
                <!-- Remove From Category -->
                <button
                  class="justify-self-end"
                  @click="isRemoveItemModalOpen = true">
                  <trash-icon class="duration-150 ease-snap h-5 text-gray-500 hover:text-danger transition w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add URL Modal -->

    <!-- Remove Item Modal -->
  </div>
</template>
