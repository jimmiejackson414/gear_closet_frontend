<script lang='ts' setup>
  import { Tabs } from 'flowbite';
  import { CheckSquare2Icon, PlusIcon } from 'lucide-vue-next';
  import { ResourceType, type Database, type ShoppingListItem, type UpdateShoppingListItem } from '@/types';
  import type { InstanceOptions, TabsOptions, TabsInterface, TabItem } from 'flowbite';

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const $route = useRoute();
  const { data, pageLoading, selectedTripId } = storeToRefs($store);

  const userItems = computed(() => {
    return data.value.shopping_items.filter(t => t.resource_type === ResourceType.USER);
  });

  const groupItems = computed(() => {
    return data.value.shopping_items.filter(t => t.resource_type === ResourceType.GROUP);
  });

  /**
   * Creates a new shopping item for the selected trip.
   */
  const createShoppingItem = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const activeTab = tabs?.getActiveTab();
      const { data: newItem, error } = await supabase.from('shopping_list_items')
        .insert({
          completed: false,
          profile_id: user.value?.id as string,
          quantity: 1,
          resource_type: activeTab?.id as ResourceType,
          title: 'New shopping item',
          trip_id: selectedTripId?.value as number,
        })
        .select();

      if (newItem?.length && !error) {
        data.value.shopping_items.push(newItem[0]);
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new shopping item.');
    }
  };

  /**
   *  Updates a shopping item.
   * @param shoppingItem 
   */
  const updateShoppingItem = async (shoppingItem: ShoppingListItem, payload: UpdateShoppingListItem) => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedShoppingItem, error } = await supabase.from('shopping_list_items')
        .update(payload)
        .eq('id', shoppingItem.id as number)
        .select();

      if (updatedShoppingItem?.length && !error) {
        const index = data.value.shopping_items.findIndex((t) => t.id === shoppingItem.id);
        data.value.shopping_items[index] = updatedShoppingItem[0];
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the shopping item.');
    }
  };

  /**
   * Instantiates the tabs component.
   */
  const activeTab = ref(ResourceType.USER);
  let tabs: TabsInterface | null = null;
  const instantiateTabs = () => {
    const tabsElement = document?.getElementById('shopping-items-tab') as HTMLElement;
    if (tabsElement) {
      const tabElements: TabItem[] = [
        {
          id: ResourceType.USER,
          triggerEl: document?.querySelector('#your-items-tab') as HTMLElement,
          targetEl: document?.querySelector('#your-items') as HTMLElement,
        },
        {
          id: ResourceType.GROUP,
          triggerEl: document?.querySelector('#group-items-tab') as HTMLElement,
          targetEl: document?.querySelector('#group-items') as HTMLElement,
        },
      ];
      const options: TabsOptions = {
        defaultTabId: activeTab.value,
        activeClasses: 'text-primary hover:text-primary !border-primary border-primary border-b-2',
        inactiveClasses: 'text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300',
      };
      const instanceOptions: InstanceOptions = {
        id: 'your-items-tab',
        override: true,
      };
      tabs = new Tabs(tabsElement, tabElements, options, instanceOptions);
    }
  };

  /**
   * Watch for changes to the page loading state and todos length.
   * If the page is no longer loading and there are todos, instantiate the tabs.
   */
  watch([() => pageLoading.value, () => data.value.shopping_items.length, activeTab, () => $route.fullPath], async (newValues) => {
    const [newPageLoading, newItemsLength] = newValues;

    if (!newPageLoading && newItemsLength > 0) {
      await nextTick();
      instantiateTabs();
    }

  }, { immediate: true });
</script>

<template>
  <div class="card card-aside">
    <div class="grid grid-cols-[auto,auto,1fr] justify-start items-center py-4">
      <check-square-2-icon class="h-6 mr-6 text-primary w-6" />
      <p class="!font-bold text-base">
        Shopping Items
      </p>
      <gc-button
        v-if="!pageLoading && data?.shopping_items.length"
        class="justify-self-end"
        :icon="PlusIcon"
        round
        size="sm"
        @click="createShoppingItem" />
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !data?.shopping_items.length">
      <p class="mb-4 text-base">
        You haven't added any shopping items to this trip yet!
      </p>
      <gc-button
        label="Get Started"
        outlined
        size="sm"
        @click="createShoppingItem" />
    </gc-empty-state>
    <div v-else>
      <div class="border-b border-gray-200">
        <ul
          id="shopping-items-tab"
          class="-mb-px flex flex-wrap font-medium text-center text-gray-500 text-sm"
          role="tablist">
          <li
            class="me-2"
            role="presentation">
            <button
              id="your-items-tab"
              aria-controls="your-items"
              aria-selected="false"
              class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
              role="tab"
              type="button">
              You
            </button>
          </li>
          <li
            class="me-2"
            role="presentation">
            <button
              id="group-items-tab"
              aria-controls="group-items"
              aria-selected="false"
              class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
              role="tab"
              type="button">
              Group
            </button>
          </li>
        </ul>
      </div>
      <div id="default-tab-content">
        <div
          id="your-items"
          aria-labelledby="your-items-tab"
          class="bg-gray-50 hidden p-4 rounded-lg"
          role="tabpanel">
          <div v-if="userItems.length">
            <table class="text-gray-500 text-left text-sm w-full">
              <thead class="bg-gray-50 text-gray-700 text-xs uppercase">
                <tr>
                  <th
                    class="p-0"
                    scope="col">
                    <div class="flex items-center" />
                  </th>
                  <th
                    class="px-6 py-0"
                    scope="col">
                    Title
                  </th>
                  <th
                    class="px-6 py-0"
                    scope="col">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in userItems"
                  :key="item.id">
                  <td class="p-0 w-4">
                    <div class="flex items-center">
                      <gc-checkbox
                        :id="`item-${item.id}`"
                        :model-value="item.completed"
                        strike-through
                        @update:model-value="e => updateShoppingItem(item, { completed: e })" />
                    </div>
                  </td>
                  <th
                    class="font-medium px-6 py-2 text-gray-900 whitespace-nowrap"
                    scope="row">
                    <gc-inline-edit
                      hide-edit-btn
                      :model-value="item.title"
                      name="title"
                      size="sm"
                      @handle-update="e => updateShoppingItem(item, { title: e })">
                      <p
                        class="font-medium text-grey text-sm"
                        :class="{ 'line-through': item.completed }">
                        {{ item.title }}
                      </p>
                    </gc-inline-edit>
                  </th>
                  <th
                    class="font-medium px-6 py-2 text-gray-900 whitespace-nowrap"
                    scope="row">
                    <gc-inline-edit
                      hide-edit-btn
                      :model-value="item.quantity"
                      name="quantity"
                      size="sm"
                      @handle-update="e => updateShoppingItem(item, { quantity: e })">
                      <p
                        class="font-medium text-grey text-sm"
                        :class="{ 'line-through': item.completed }">
                        {{ item.quantity }}
                      </p>
                    </gc-inline-edit>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <p
            v-else
            class="text-base text-center">
            No shopping items found.
          </p>
        </div>
        <div
          id="group-items"
          aria-labelledby="group-items-tab"
          class="bg-gray-50 hidden p-4 rounded-lg"
          role="tabpanel">
          <div v-if="groupItems.length">
            <table class="text-gray-500 text-left text-sm w-full">
              <thead class="bg-gray-50 text-gray-700 text-xs uppercase">
                <tr>
                  <th
                    class="p-0"
                    scope="col">
                    <div class="flex items-center" />
                  </th>
                  <th
                    class="px-6 py-0"
                    scope="col">
                    Title
                  </th>
                  <th
                    class="px-6 py-0"
                    scope="col">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in groupItems"
                  :key="item.id">
                  <td class="p-0 w-4">
                    <div class="flex items-center">
                      <gc-checkbox
                        :id="`item-${item.id}`"
                        :model-value="item.completed"
                        strike-through
                        @update:model-value="e => updateShoppingItem(item, { completed: e })" />
                    </div>
                  </td>
                  <th
                    class="font-medium px-6 py-2 text-gray-900 whitespace-nowrap"
                    scope="row">
                    <gc-inline-edit
                      hide-edit-btn
                      :model-value="item.title"
                      name="title"
                      size="sm"
                      @handle-update="e => updateShoppingItem(item, { title: e })">
                      <p
                        class="font-medium text-grey text-sm"
                        :class="{ 'line-through': item.completed }">
                        {{ item.title }}
                      </p>
                    </gc-inline-edit>
                  </th>
                  <th
                    class="font-medium px-6 py-2 text-gray-900 whitespace-nowrap"
                    scope="row">
                    <gc-inline-edit
                      hide-edit-btn
                      :model-value="item.quantity"
                      name="quantity"
                      size="sm"
                      @handle-update="e => updateShoppingItem(item, { quantity: e })">
                      <p class="font-medium text-grey text-sm">
                        {{ item.quantity }}
                      </p>
                    </gc-inline-edit>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <p
            v-else
            class="text-center text-sm">
            No group shopping items found.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
