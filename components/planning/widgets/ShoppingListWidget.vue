<script lang='ts' setup>
  import { ResourceType, type Tables } from '@/types';

  const $store = usePlanningStore();

  const activeTab = ref<ResourceType>(ResourceType.USER);
  const userItems = computed(() => {
    return $store.data.shopping_items.filter(t => t.resource_type === ResourceType.USER);
  });

  const groupItems = computed(() => {
    return $store.data.shopping_items.filter(t => t.resource_type === ResourceType.GROUP);
  });

  const createShoppingItem = () => $store.createShoppingItem(activeTab.value);
  const updateShoppingItem = (
    shoppingItem: Tables<'shopping_list_items'>,
    payload: Parameters<typeof $store.updateShoppingItem>[1],
  ) => $store.updateShoppingItem(shoppingItem, payload);
  const batchUpdateShoppingItems = (completed: boolean | 'indeterminate', resourceType: ResourceType) => {
    return $store.batchUpdateShoppingItems(completed, resourceType);
  };
</script>

<template>
  <card class="px-4 sm:px-8 py-4 rounded-3xl">
    <div class="justify-start items-center grid grid-cols-[auto_auto_1fr] py-4">
      <icon-check-square-2 class="mr-6 w-6 h-6 text-primary" />
      <p class="font-bold! text-base">
        Shopping Items
      </p>
      <button-root
        v-if="!$store.pageLoading && $store.data?.shopping_items.length"
        aria-label="Add shopping item"
        class="justify-self-end rounded-full"
        size="icon"
        type="button"
        @click="createShoppingItem">
        <icon-plus aria-hidden="true" />
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
                  <table-head class="w-12.5">
                    <checkbox
                      :checked="userItems.every((u: Tables<'shopping_list_items'>) => u.completed)"
                      @update:checked="batchUpdateShoppingItems($event, ResourceType.USER)" />
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
            No shopping items yet.
          </typography>
        </tabs-content>
        <tabs-content :value="ResourceType.GROUP">
          <div v-if="groupItems.length">
            <table-root class="w-full">
              <table-header>
                <table-row no-hover-effect>
                  <table-head class="w-12.5">
                    <checkbox
                      :checked="groupItems.every((u: Tables<'shopping_list_items'>) => u.completed)"
                      @update:checked="batchUpdateShoppingItems($event, ResourceType.GROUP)" />
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
            No group shopping items yet.
          </typography>
        </tabs-content>
      </tabs>
    </div>
  </card>
</template>
