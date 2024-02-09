<script lang='ts' setup>
  import { Tabs, type InstanceOptions, type TabItem, type TabsOptions } from 'flowbite';
  import { AppleIcon, ShirtIcon } from 'lucide-vue-next';
  import tailwind from '@/utils/tailwind';
  import type { Database } from '@/types';
  import type { PublicPack } from '@/types/helpers';
  import type { Column } from '@/components/closet/PackItemsTable.vue';

  definePageMeta({ layout: 'public-layout' });

  const $appStore = useAppStore();

  /**
   * Fetches the pack data.
   */
  const $route = useRoute();
  const pack = ref<PublicPack | undefined>(undefined);
  const fetchPack = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: fetchedPack, error } = await supabase
        .from('packs')
        .select(`
          *,
          profile:profiles (first_name, last_name, trail_name, image),
          categories(*,
            category_items(*,
              item:item_id(*)
            )
          ),
          comments(*,
            profile:profiles (first_name, last_name, trail_name, image),
            replies(*,
              profile:profiles (first_name, last_name, trail_name, image)
            )
          )
        `)
        .eq('slug', $route.params.slug)
        .returns<PublicPack | undefined>()
        .maybeSingle();

      if (error) throw error;
      if (!fetchedPack) throw new Error('No pack data found');
      pack.value = fetchedPack;
    } catch (error) {
      $appStore.notifyNegative('Failed to fetch pack data');
    }
  };
  await fetchPack();

  /**
   * Instantiates the tabs component
   */
  const activeTab = ref('tables');
  // let tabs: TabsInterface | null = null;
  const instantiateTabs = () => {
    const tabsElement = document?.getElementById('default-tab') as HTMLElement;
    if (tabsElement) {
      const tabElements: TabItem[] = [
        {
          id: 'tables',
          triggerEl: document?.querySelector('#tables-tab') as HTMLElement,
          targetEl: document?.querySelector('#tables') as HTMLElement,
        },
        ...(pack.value?.allow_comments ? [{
          id: 'comments',
          triggerEl: document?.querySelector('#comments-tab') as HTMLElement,
          targetEl: document?.querySelector('#comments') as HTMLElement,
        }] : []),
      ];

      const options: TabsOptions = {
        defaultTabId: activeTab.value,
        activeClasses: 'text-primary hover:text-primary !border-primary border-primary border-b-2',
        inactiveClasses: 'text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300',
      };

      const instanceOptions: InstanceOptions = {
        id: 'default-tab',
        override: true,
      };

      new Tabs(tabsElement, tabElements, options, instanceOptions);
    }
  };
  onMounted(() => instantiateTabs());

  // define table columns
  const columns: Column[] = [
    { name: 'name', label: 'Name', align: 'left' },
    { name: 'generic_type', label: 'Description', align: 'left' },
    { name: 'consumable', label: 'Consumable', align: 'center' },
    { name: 'worn', label: 'Worn', align: 'center' },
    { name: 'weight', label: 'Weight', align: 'center' },
    { name: 'price', label: 'Price', align: 'center' },
    { name: 'quantity', label: 'Quantity', align: 'center' },
  ];
  // define item header classes
  const headerClasses = (header: Column): string => {
    if (header.name === 'drag') return 'px-2 py-3 w-8';
    else if (header.name === 'actions') return 'text-right pl-6 pr-4 py-3';
    else if (header.name === 'name' || header.name === 'generic_type') return 'pr-6 pl-4 py-3 text-left';
    return 'px-6 py-3 text-center';
  };
</script>

<template>
  <div class="py-8">
    <div v-if="!pack?.private">
      <div class="card card-main">
        <div class="flex justify-start items-center gap-4 mb-4">
          <h1 class="text-2xl">
            {{ friendlyUsername(pack?.profile as any, { includeTrailName: true }) }}'s
          </h1>
          <h1 class="font-bold text-2xl">
            {{ pack?.name }}
          </h1>
        </div>
        <public-pack-summary :pack="pack" />

        <div class="border-b border-gray-200 mt-14">
          <ul
            id="default-tab"
            class="-mb-px flex flex-wrap font-medium text-center text-gray-500 text-sm"
            role="tablist">
            <li
              class="me-2"
              role="presentation">
              <button
                id="tables-tab"
                aria-controls="tables"
                aria-selected="false"
                class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
                role="tab"
                type="button">
                Details
              </button>
            </li>
            <li
              class="me-2"
              role="presentation">
              <button
                id="comments-tab"
                v-tippy="{ content: !pack?.allow_comments ? 'Comments are disabled for this pack' : '' }"
                aria-controls="comments"
                aria-selected="true"
                class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
                :class="{ 'cursor-not-allowed': !pack?.allow_comments }"
                role="tab"
                type="button">
                Comments ({{ pack?.comments?.length || 0 }})
              </button>
            </li>
          </ul>
        </div>
        <div id="default-tab-content">
          <div
            id="tables"
            aria-labelledby="tables-tab"
            class="hidden"
            role="tabpanel">
            <div
              v-for="category in pack?.categories"
              :key="category.id"
              class="bg-gray-50 mb-8 overflow-x-auto px-2 py-4 rounded-lg w-full">
              <p class="!font-bold mb-3 ml-4 text-base">
                {{ category.name }}
              </p>
              <ul>
                <li class="grid grid-cols-[1fr,1fr,130px,87px,96px,82px,108px] text-gray-700 text-xs uppercase">
                  <div
                    v-for="column in columns"
                    :key="column.name"
                    :class="[headerClasses(column), {
                      'text-left': column.align === 'left',
                      'text-center': column.align === 'center',
                      'text-right': column.align === 'right',
                    }]">
                    {{ column.label }}
                  </div>
                </li>
              </ul>
              <ul>
                <li
                  v-for="row in category.category_items"
                  :key="row.item.id"
                  class="border-b last:border-0 duration-150 ease-expo grid grid-cols-[1fr,1fr,130px,87px,96px,82px,108px] group transition hover:bg-gray-50">
                  <div class="font-medium px-4 py-2 text-gray-900 whitespace-nowrap">
                    <p class="!font-medium text-gray-900">
                      {{ row.item.name }}
                    </p>
                  </div>

                  <div class="px-4 py-2">
                    <p class="!font-medium text-gray-500">
                      {{ row.item.generic_type }}
                    </p>
                  </div>

                  <div class="px-4 py-2">
                    <div class="flex justify-center items-center h-full">
                      <div
                        class="flex justify-center items-center h-8 rounded-full w-8"
                        :class="row.item.consumable ? 'bg-info' : 'bg-transparent'">
                        <apple-icon
                          class="h-5 text-gray-500 w-5"
                          :class="row.item.consumable ? 'text-white' : 'text-dark-grey'" />
                      </div>
                    </div>
                  </div>

                  <div class="px-4 py-2">
                    <div class="flex justify-center items-center h-full">
                      <div
                        class="flex justify-center items-center h-8 rounded-full w-8"
                        :class="row.item.worn ? 'bg-positive' : 'bg-transparent'">
                        <shirt-icon
                          class="h-5 text-gray-500 w-5"
                          :class="row.item.worn ? 'text-white' : 'text-dark-grey'" />
                      </div>
                    </div>
                  </div>

                  <div class="px-4 py-2">
                    <div class="flex justify-center items-center max-w-[4rem] mx-auto">
                      {{ row.item.weight }}
                    </div>
                  </div>

                  <div class="px-4 py-2">
                    <div class="flex justify-center items-center">
                      {{ convertCurrency(row.item.price || 0) }}
                    </div>
                  </div>

                  <div class="px-4 py-2">
                    <div class="flex justify-center items-center max-w-[4rem] mx-auto">
                      {{ row.item.quantity }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="pack?.allow_comments"
            id="comments"
            aria-labelledby="comments-tab"
            class="bg-gray-50 hidden p-4 rounded-lg"
            role="tabpanel">
            <gc-empty-state v-if="!pack?.comments?.length">
              <p class="text-base">
                No comments have been made yet.
              </p>
            </gc-empty-state>
            <div v-else>
              <public-pack-comment
                v-for="comment in pack?.comments"
                :key="comment.id"
                :comment="comment" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="relative">
      <div class="absolute inset-0 bg-white flex flex-col h-96 m-auto p-8 place-content-center place-items-center rounded-lg shadow text-center w-96 z-10">
        <gc-logo-icon
          :fill="tailwind.theme.colors.primary"
          wrapper-class="h-8 w-8 mb-4" />
        <p class="mb-4 text-base-lg">
          This pack is private!
        </p>
        <p class="text-base">
          Please contact the pack owner for access.
        </p>
      </div>
      <div class="blur-sm card card-main">
        <div
          class="max-w-xl mx-auto p-4 md:p-6 w-full"
          role="status">
          <div class="bg-gray-200 h-2.5 mb-2.5 rounded-full w-32" />
          <div class="bg-gray-200 h-2 mb-10 rounded-full w-48" />
          <div class="flex items-baseline mt-4">
            <div class="bg-gray-200 h-72 rounded-t-lg w-full" />
            <div class="bg-gray-200 h-56 ms-6 rounded-t-lg w-full" />
            <div class="bg-gray-200 h-72 ms-6 rounded-t-lg w-full" />
            <div class="bg-gray-200 h-64 ms-6 rounded-t-lg w-full" />
            <div class="bg-gray-200 h-80 ms-6 rounded-t-lg w-full" />
            <div class="bg-gray-200 h-72 ms-6 rounded-t-lg w-full" />
            <div class="bg-gray-200 h-80 ms-6 rounded-t-lg w-full" />
          </div>
          <span class="sr-only">Loading...</span>
        </div>

        <div
          class="divide-gray-200 divide-y max-w-xl mt-14 mx-auto p-4 md:p-6 space-y-4"
          role="status">
          <div class="flex justify-between items-center">
            <div>
              <div class="bg-gray-300 h-2.5 mb-2.5 rounded-full w-24" />
              <div class="bg-gray-200 h-2 rounded-full w-32" />
            </div>
            <div class="bg-gray-300 h-2.5 rounded-full w-12" />
          </div>
          <div class="flex justify-between items-center pt-4">
            <div>
              <div class="bg-gray-300 h-2.5 mb-2.5 rounded-full w-24" />
              <div class="bg-gray-200 h-2 rounded-full w-32" />
            </div>
            <div class="bg-gray-300 h-2.5 rounded-full w-12" />
          </div>
          <div class="flex justify-between items-center pt-4">
            <div>
              <div class="bg-gray-300 h-2.5 mb-2.5 rounded-full w-24" />
              <div class="bg-gray-200 h-2 rounded-full w-32" />
            </div>
            <div class="bg-gray-300 h-2.5 rounded-full w-12" />
          </div>
          <div class="flex justify-between items-center pt-4">
            <div>
              <div class="bg-gray-300 h-2.5 mb-2.5 rounded-full w-24" />
              <div class="bg-gray-200 h-2 rounded-full w-32" />
            </div>
            <div class="bg-gray-300 h-2.5 rounded-full w-12" />
          </div>
          <div class="flex justify-between items-center pt-4">
            <div>
              <div class="bg-gray-300 h-2.5 mb-2.5 rounded-full w-24" />
              <div class="bg-gray-200 h-2 rounded-full w-32" />
            </div>
            <div class="bg-gray-300 h-2.5 rounded-full w-12" />
          </div>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>
