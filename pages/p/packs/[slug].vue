<script lang='ts' setup>
  // import { Tabs, type InstanceOptions, type TabItem, type TabsOptions } from 'flowbite';
  // import type { Column } from '@/components/closet/PackItemsTable.vue';
  import { cn } from '@/lib/utils';
  import type { Database, Tables } from '@/types';
  import type { ExtendedComment, ExtendedReply, PublicPack } from '@/types/helpers';
  import tailwind from '@/utils/tailwind';

  definePageMeta({ layout: 'public-layout', colorMode: 'light', public: true });

  /**
   * Fetches the pack data.
   */
  const $appStore = useAppStore();
  const $store = useClosetStore();
  const $route = useRoute();
  const fetchPack = async () => {
    try {
      $store.pageLoading = true;
      const supabase = useSupabaseClient<Database>();
      const { data: fetchedPack, error } = await supabase
        .from('packs')
        .select(`
          *,
          profile:profiles (*),
          categories(*,
            category_items(*,
              item:item_id(*)
            )
          ),
          comments(*,
            profile:profiles (*),
            replies(*,
              profile:profiles (*)
            )
          )
        `)
        // .returns<PublicPack | undefined>()
        .eq('slug', $route.params.slug)
        .order('created_at', { referencedTable: 'comments', ascending: false })
        .order('created_at', { referencedTable: 'comments.replies', ascending: false })
        .maybeSingle();

      if (error) throw error;
      if (!fetchedPack) throw new Error('No pack data found');
      $store.data.selectedPack = fetchedPack as PublicPack;
      // pack.value = fetchedPack;
    } catch (error) {
      $appStore.notifyNegative('Failed to fetch pack data');
    } finally {
      $store.pageLoading = false;
    }
  };
  await fetchPack();

  /**
   * Instantiates the tabs component
   */
  // const activeTab = ref('tables');
  // const instantiateTabs = () => {
  //   const tabsElement = document?.getElementById('default-tab') as HTMLElement;
  //   if (tabsElement) {
  //     const tabElements: TabItem[] = [
  //       {
  //         id: 'tables',
  //         triggerEl: document?.querySelector('#tables-tab') as HTMLElement,
  //         targetEl: document?.querySelector('#tables') as HTMLElement,
  //       },
  //       ...(pack.value?.allow_comments ? [{
  //         id: 'comments',
  //         triggerEl: document?.querySelector('#comments-tab') as HTMLElement,
  //         targetEl: document?.querySelector('#comments') as HTMLElement,
  //       }] : []),
  //     ];

  //     const options: TabsOptions = {
  //       defaultTabId: activeTab.value,
  //       activeClasses: 'font-bold text-primary hover:text-primary !border-primary border-primary border-b-2',
  //       inactiveClasses: 'text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300',
  //     };

  //     const instanceOptions: InstanceOptions = {
  //       id: 'default-tab',
  //       override: true,
  //     };

  //     new Tabs(tabsElement, tabElements, options, instanceOptions);
  //   }
  // };
  // onMounted(() => instantiateTabs());

  // define table columns
  const columns = [
    { name: 'name', label: 'Name', align: 'left' },
    { name: 'generic_type', label: 'Description', align: 'left' },
    { name: 'consumable', label: 'Consumable', align: 'center' },
    { name: 'worn', label: 'Worn', align: 'center' },
    { name: 'weight', label: 'Weight', align: 'center' },
    { name: 'price', label: 'Price', align: 'center' },
    { name: 'quantity', label: 'Quantity', align: 'center' },
  ];
  // define item header classes
  const headerClasses = (header: any): string => {
    if (header.name === 'drag') return 'px-2 py-3 w-8';
    else if (header.name === 'actions') return 'text-right pl-6 pr-4 py-3';
    else if (header.name === 'name' || header.name === 'generic_type') return 'pr-6 pl-4 py-3 text-left';
    return 'px-6 py-3 text-center';
  };

  const user = useSupabaseUser();

  /**
   * Adds a comment to the pack
   */
  const quillEditorRef = ref<any | null>(null);
  const submitting = ref(false);
  const addComment = async () => {
    const text = quillEditorRef.value?.getText()
      .trim();
    if (!text) return;

    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      // insert comment
      const { data, error } = await supabase
        .from('comments')
        .insert({
          pack_id: $store.data.selectedPack?.id as number,
          profile_id: user.value?.id as string,
          text,
        })
        .select();

      if (error || !data) throw error;

      // retrieve extended comment data
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .select(`
          *,
          profile:profiles (first_name, last_name, trail_name, image),
          replies(*,
            profile:profiles (first_name, last_name, trail_name, image)
          )
        `)
        .eq('id', data?.[0]?.id as number)
        .order('created_at', { referencedTable: 'replies', ascending: false })
        .returns<ExtendedComment | undefined>()
        .maybeSingle();

      if (!comment || commentError) throw commentError;
      ($store.data.selectedPack as PublicPack)?.comments?.unshift(comment);
      quillEditorRef.value?.setText('');
      $appStore.notifyPositive('Comment successfully added!');
    } catch (error) {
      $appStore.notifyNegative('Failed to add comment');
    } finally {
      submitting.value = false;
    }
  };

  /**
   * Adds a reply to a comment
   */
  const handleAddReply = (reply: ExtendedReply) => {
    // @ts-ignore
    const comment = pack.value?.comments.find(c => c.id === reply.comment_id);
    if (comment) comment.replies = [reply, ...comment.replies];
  };

  const displayPrivatePackWarning = ref($store.data.selectedPack?.private ?? true);

  const selectedPackName = computed(() => {
    const name = $store.data.selectedPack?.name || '';
    return name.toLowerCase()
      .includes('Pack') ? name : name + ' Pack';
  });

  enum TableTabs {
    DETAILS,
    COMMENTS,
  }
  const activeTab = ref(TableTabs.DETAILS);
</script>

<template>
  <div class="py-8">
    <div v-if="!displayPrivatePackWarning">
      <div class="card card-main">
        <div class="flex justify-start items-center gap-4 mb-4">
          <h1 class="text-2xl">
            {{ friendlyUsername(($store.data.selectedPack as PublicPack)?.profile, { includeTrailName: true }) }}'s
          </h1>
          <h1 class="font-bold text-2xl">
            {{ selectedPackName }}
          </h1>
        </div>
        <card class="px-8 py-4 rounded-3xl">
          <div class="grid lg:grid-cols-[1fr,auto,40%] grid-cols-1 gap-6">
            <closet-pack-chart />
            <separator orientation="vertical" />
            <closet-pack-details />
          </div>
        </card>

        <tabs
          v-model="activeTab"
          activation-mode="manual"
          class="mt-14"
          :default-value="TableTabs.DETAILS">
          <tabs-list class="bg-background border-b border-muted-foreground pb-0 rounded-none">
            <tabs-trigger
              class="!shadow-none border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold data-[state=inactive]:border-transparent outline-none rounded-none hover:text-primary"
              :value="TableTabs.DETAILS">
              Details
            </tabs-trigger>
            <tabs-trigger
              class="!shadow-none border-b-2 data-[state=active]:border-primary data-[state=active]:font-bold data-[state=inactive]:border-transparent outline-none rounded-none hover:text-primary"
              :value="TableTabs.COMMENTS">
              Comments
            </tabs-trigger>
          </tabs-list>
          <tabs-content :value="TableTabs.DETAILS">
            <closet-pack-categories />
          </tabs-content>
          <tabs-content :value="TableTabs.COMMENTS">
            Comments
          </tabs-content>
        </tabs>

        <!-- <div class="border-b border-gray-200 mt-14">
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
                v-tippy="{ content: !$store.data.selectedPack?.allow_comments ? 'Comments are disabled for this pack' : '' }"
                aria-controls="comments"
                aria-selected="true"
                class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
                :class="{ 'cursor-not-allowed': !$store.data.selectedPack?.allow_comments }"
                role="tab"
                type="button">
                Comments ({{ ($store.data.selectedPack as PublicPack)?.comments?.length || 0 }})
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
              v-for="category in $store.data.selectedPack?.categories"
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
                        <icon-apple
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
                        <icon-shirt
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
            v-if="$store.data.selectedPack?.allow_comments"
            id="comments"
            aria-labelledby="comments-tab"
            class="bg-gray-50 hidden p-4 rounded-lg"
            role="tabpanel">
            <gc-empty-state v-if="!($store.data.selectedPack as PublicPack)?.comments?.length">
              <p class="text-base">
                No comments have been made yet.
              </p>
            </gc-empty-state>
            <div v-else>
              <div
                v-if="!!user"
                class="flex items-end flex-col px-6">
                <p class="my-2 text-gray-500 text-sm">
                  Commenting as <span class="font-bold">{{ friendlyUsername(($store.data.selectedPack as PublicPack)?.profile) }}</span>
                </p>
                <client-only>
                  <quill-editor
                    ref="quillEditorRef"
                    class="custom-editor"
                    :enable="!submitting"
                    :options="{ modules: { toolbar: false } }"
                    placeholder="Add a comment"
                    theme="snow" />
                </client-only>
                <button-root
                  class="mt-2"
                  :disabled="submitting"
                  :loading="submitting"
                  size="sm"
                  @click="addComment">
                  Submit
                </button-root>
              </div>
              <public-pack-comment
                v-for="comment in ($store.data.selectedPack as PublicPack)?.comments"
                :key="comment.id"
                :comment="comment"
                @handle-add-reply="handleAddReply" />
            </div>
          </div>
        </div> -->
      </div>
    </div>

    <div v-else>
      <alert-dialog v-model:open="displayPrivatePackWarning">
        <alert-dialog-content class="max-w-96">
          <div class="flex flex-col place-content-center place-items-center">
            <gc-logo-icon
              :fill="tailwind.theme.colors.primary.DEFAULT"
              wrapper-class="h-8 w-8 mb-4" />
            <typography
              class="mb-4"
              variant="large">
              This pack is private!
            </typography>
            <typography>
              Please contact the pack owner for access.
            </typography>
          </div>
        </alert-dialog-content>
      </alert-dialog>
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
