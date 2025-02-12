<script lang='ts' setup>
  import type { Database } from '@/types';
  import type { ExtendedComment, PublicPack } from '@/types/helpers';
  import tailwind from '@/utils/tailwind';

  const user = useSupabaseUser();
  // TODO: Figure out way to access user to dynamically set colorMode. Currently causes 500 error.
  definePageMeta({ layout: 'public-layout', public: true });

  /**
   * Fetches the pack data.
   */
  const $appStore = useAppStore();
  const $store = useClosetStore();
  const $route = useRoute();
  const displayPrivatePackWarning = ref($store.data.selectedPack?.private ?? true);

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
        .eq('slug', $route.params.slug)
        .order('created_at', { ascending: false, referencedTable: 'comments' })
        .order('created_at', { ascending: false, referencedTable: 'comments.replies' })
        .maybeSingle();

      if (error) throw error;
      if (!fetchedPack) throw new Error('No pack data found');
      $store.data.selectedPack = fetchedPack as PublicPack;
    } catch (error) {
      $appStore.notifyNegative('Failed to fetch pack data');
    } finally {
      $store.pageLoading = false;
    }
  };
  await fetchPack();


  /**
   * Adds a comment to the pack
   */
  const newCommentValue = ref<string | undefined>(undefined);
  const submitting = ref(false);
  const addComment = async () => {
    const text = newCommentValue.value?.trim();
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
        .order('created_at', { ascending: false, referencedTable: 'replies' })
        .returns<ExtendedComment | undefined>()
        .maybeSingle();

      if (!comment || commentError) throw commentError;
      ($store.data.selectedPack as PublicPack)?.comments?.unshift(comment);
      newCommentValue.value = undefined;
      $appStore.notifyPositive('Comment successfully added!');
    } catch (error) {
      $appStore.notifyNegative('Failed to add comment');
    } finally {
      submitting.value = false;
    }
  };

  const selectedPackName = computed(() => {
    const name = $store.data.selectedPack?.name || '';
    return name.toLowerCase()
      .includes('Pack') ? name : name + ' Pack';
  });

  /**
   * Tabs functionality
   */
  enum TableTabs {
    DETAILS,
    COMMENTS,
  }
  const activeTab = ref(TableTabs.DETAILS);

  useHead({ title: selectedPackName.value || 'Public Pack' });
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
          <tabs-list class="bg-background dark:bg-background border-b border-muted-foreground pb-0 rounded-none">
            <tabs-trigger
              class="!shadow-none border-b-[3px] data-[state=active]:border-primary dark:data-[state=active]:border-primary-light dark:data-[state=inactive]:text-accent-light data-[state=active]:font-bold data-[state=inactive]:border-transparent outline-none rounded-none hover:text-primary"
              :value="TableTabs.DETAILS">
              Details
            </tabs-trigger>
            <tabs-trigger
              class="!shadow-none border-b-[3px] data-[state=active]:border-primary dark:data-[state=inactive]:text-accent-light data-[state=active]:font-bold data-[state=inactive]:border-transparent outline-none rounded-none hover:text-primary"
              :disabled="!$store.data.selectedPack?.allow_comments"
              :value="TableTabs.COMMENTS">
              Comments ({{ ($store.data.selectedPack as PublicPack)?.comments?.length || 0 }})
            </tabs-trigger>
          </tabs-list>
          <tabs-content :value="TableTabs.DETAILS">
            <closet-pack-categories />
          </tabs-content>
          <tabs-content :value="TableTabs.COMMENTS">
            <card
              v-if="$store.data.selectedPack?.allow_comments"
              id="comments"
              aria-labelledby="comments-tab"
              role="tabpanel">
              <div
                v-if="user"
                class="flex items-start flex-col max-w-6xl mx-auto px-6 py-6">
                <textarea-root
                  v-model="newCommentValue"
                  class="rounded-xl shadow-sm w-full disabled:bg-gray-100 disabled:pointer-events-none"
                  :disabled="submitting"
                  placeholder="Add a comment" />
                <div class="flex items-center gap-6 ml-auto my-2">
                  <typography class="text-muted-foreground dark:text-muted-foreground text-sm">
                    Commenting as <span class="font-bold">{{ friendlyUsername(($store.data.selectedPack as PublicPack)?.profile) }}</span>
                  </typography>
                  <button-root
                    :disabled="submitting"
                    :loading="submitting"
                    size="sm"
                    @click="addComment">
                    Submit
                  </button-root>
                </div>
                <separator class="mb-4" />
                <gc-empty-state
                  v-if="!($store.data.selectedPack as PublicPack)?.comments?.length"
                  class="mx-auto">
                  <typography>
                    Be the first to comment!
                  </typography>
                </gc-empty-state>
                <div
                  v-else
                  class="flex items-end flex-col w-full">
                  <public-pack-comment
                    v-for="comment in ($store.data.selectedPack as PublicPack)?.comments"
                    :key="comment.id"
                    :comment="comment" />
                </div>
              </div>
            </card>
          </tabs-content>
        </tabs>
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
