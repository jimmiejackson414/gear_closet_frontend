<script lang='ts' setup>
  import { type Database, ResourceType, type Tables, type TablesUpdate } from '@/types';

  const $appStore = useAppStore();
  const $store = usePlanningStore();

  const activeTab = ref<ResourceType>(ResourceType.USER);
  const userItems = computed(() => {
    return $store.data.shopping_items.filter(t => t.resource_type === ResourceType.USER);
  });

  const groupItems = computed(() => {
    return $store.data.shopping_items.filter(t => t.resource_type === ResourceType.GROUP);
  });

  /**
   * Creates a new shopping item for the selected trip.
   */
  const createShoppingItem = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: newItem, error } = await supabase.from('shopping_list_items')
        .insert({
          completed: false,
          profile_id: user.value?.sub as string,
          quantity: 1,
          resource_type: activeTab.value,
          title: 'New shopping item',
          trip_id: Number($store.selectedTripId),
        })
        .select();

      if (newItem?.length && !error) {
        const item = newItem[0];
        if (item) $store.data.shopping_items.push(item);
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new shopping item.');
    }
  };

  /**
   *  Updates a shopping item.
   * @param shoppingItem
   */
  const updateShoppingItem = async (shoppingItem: Tables<'shopping_list_items'>, payload: TablesUpdate<'shopping_list_items'>) => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedShoppingItem, error } = await supabase.from('shopping_list_items')
        .update(payload)
        .eq('id', shoppingItem.id as number)
        .select();

      if (updatedShoppingItem?.length && !error) {
        const updated = updatedShoppingItem[0];
        const index = $store.data.shopping_items.findIndex((t) => t.id === shoppingItem.id);
        if (updated && index !== -1) {
          $store.data.shopping_items[index] = updated;
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the shopping item.');
    }
  };

  /**
   * Batch updates all shopping items.
   */
  const batchUpdateShoppingItems = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedShoppingItems, error } = await supabase.from('shopping_list_items')
        .upsert($store.data.shopping_items)
        .select();

      if (updatedShoppingItems?.length && !error) {
        $store.data.shopping_items = updatedShoppingItems;
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the shopping items.');
    }
  };
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="justify-start items-center grid grid-cols-[auto_auto_1fr] py-4">
      <icon-check-square-2 class="mr-6 w-6 h-6 text-primary" />
      <p class="font-bold! text-base">
        Shopping Items
      </p>
      <button-root
        v-if="!$store.pageLoading && $store.data?.shopping_items.length"
        class="justify-self-end rounded-full"
        size="icon"
        @click="createShoppingItem">
        <icon-plus />
      </button-root>
    </div>
    <gc-skeleton v-if="$store.pageLoading" />
    <gc-empty-state v-else-if="!$store.pageLoading && !$store.data?.shopping_items.length">
      <p class="mb-4 text-base">
        You haven't added any shopping items to this trip yet!
      </p>
      <button-root
        size="sm"
        variant="outline"
        @click="createShoppingItem">
        Get Started
      </button-root>
    </gc-empty-state>
    <div v-else>
      <tabs
        v-model="activeTab"
        activation-mode="manual"
        class="w-full"
        :default-value="ResourceType.USER">
        <tabs-list class="grid grid-cols-2 w-full">
          <tabs-trigger :value="ResourceType.USER">
            You
          </tabs-trigger>
          <tabs-trigger :value="ResourceType.GROUP">
            Group
          </tabs-trigger>
        </tabs-list>
        <tabs-content :value="ResourceType.USER">
          <div v-if="userItems.length">
            <table-root class="w-full">
              <table-header>
                <table-row no-hover-effect>
                  <table-head class="w-[50px]">
                    <checkbox
                      :checked="userItems.every((u: Tables<'shopping_list_items'>) => u.completed)"
                      @update:checked="batchUpdateShoppingItems" />
                  </table-head>
                  <table-head class="font-bold">
                    Title
                  </table-head>
                  <table-head class="font-bold">
                    Quantity
                  </table-head>
                </table-row>
              </table-header>
              <table-body>
                <table-row
                  v-for="item in userItems"
                  :key="item.id">
                  <table-cell>
                    <checkbox
                      :checked="item.completed"
                      @update:checked="updateShoppingItem(item, { completed: $event })" />
                  </table-cell>
                  <table-cell>
                    <gc-inline-edit
                      :model-value="item.title ?? undefined"
                      name="title"
                      @update:model-value="updateShoppingItem(item, { title: $event as string })">
                      {{ item.title }}
                    </gc-inline-edit>
                  </table-cell>
                  <table-cell>
                    <gc-inline-edit
                      :model-value="item.quantity ?? undefined"
                      name="quantity"
                      @update:model-value="updateShoppingItem(item, { quantity: $event as number })">
                      {{ item.quantity }}
                    </gc-inline-edit>
                  </table-cell>
                </table-row>
              </table-body>
            </table-root>
          </div>
          <typography
            v-else
            class="text-base text-center">
            No todos found.
          </typography>
        </tabs-content>
        <tabs-content :value="ResourceType.GROUP">
          <div v-if="groupItems.length">
            <table-root class="w-full">
              <table-header>
                <table-row no-hover-effect>
                  <table-head class="w-[50px]">
                    <checkbox
                      :checked="groupItems.every((u: Tables<'shopping_list_items'>) => u.completed)"
                      @update:checked="batchUpdateShoppingItems" />
                  </table-head>
                  <table-head class="font-bold">
                    Title
                  </table-head>
                  <table-head class="font-bold">
                    Quantity
                  </table-head>
                </table-row>
              </table-header>
              <table-body>
                <table-row
                  v-for="item in groupItems"
                  :key="item.id">
                  <table-cell>
                    <checkbox
                      :checked="item.completed"
                      @update:checked="updateShoppingItem(item, { completed: $event })" />
                  </table-cell>
                  <table-cell>
                    <gc-inline-edit
                      :model-value="item.title ?? undefined"
                      name="title"
                      @update:model-value="updateShoppingItem(item, { title: $event as string })">
                      {{ item.title }}
                    </gc-inline-edit>
                  </table-cell>
                  <table-cell>
                    <gc-inline-edit
                      :model-value="item.quantity ?? undefined"
                      name="quantity"
                      @update:model-value="updateShoppingItem(item, { quantity: $event as number })">
                      {{ item.quantity }}
                    </gc-inline-edit>
                  </table-cell>
                </table-row>
              </table-body>
            </table-root>
          </div>
          <typography
            v-else
            class="text-base text-center">
            No group todos found.
          </typography>
        </tabs-content>
      </tabs>
    </div>
  </card>
</template>
