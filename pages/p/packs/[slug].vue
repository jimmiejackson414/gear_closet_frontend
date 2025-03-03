<script lang='ts' setup>
  import tailwind from '@/utils/tailwind';
  import type { Database } from '@/types';
  import type { ExtendedComment, PublicPack } from '@/types/helpers';

  const user = useSupabaseUser();
  definePageMeta({ colorMode: 'light', layout: 'public-layout', public: true });

  /**
   * Fetches the pack data.
   */
  const $appStore = useAppStore();
  const $store = useClosetStore();
  const $route = useRoute();
  const displayPrivatePackWarning = ref(true);

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
      displayPrivatePackWarning.value = fetchedPack.private;
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
    COMMENTS = 'COMMENTS',
    DETAILS = 'DETAILS',
  }
  const activeTab = ref(TableTabs.DETAILS);

  useHead({ title: selectedPackName.value || 'Public Pack' });
</script>

<template>
  <div class="py-8">
    <div v-if="!displayPrivatePackWarning">
      <div>
        <div class="mb-4 flex items-center justify-start gap-4">
          <h1 class="text-2xl">
            {{ friendlyUsername(($store.data.selectedPack as PublicPack)?.profile, { includeTrailName: true }) }}'s
          </h1>
          <h1 class="text-2xl font-bold">
            {{ selectedPackName }}
          </h1>
        </div>
        <card class="rounded-3xl px-8 py-4">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,auto,40%]">
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
          <tabs-list class="rounded-none border-b border-muted-foreground bg-background pb-0 dark:bg-background">
            <tabs-trigger
              class="rounded-none border-b-[3px] !shadow-none outline-none hover:text-primary data-[state=active]:border-primary data-[state=inactive]:border-transparent data-[state=active]:font-bold dark:data-[state=active]:border-primary-light dark:data-[state=inactive]:text-accent-light"
              :value="TableTabs.DETAILS">
              Details
            </tabs-trigger>
            <tabs-trigger
              class="rounded-none border-b-[3px] !shadow-none outline-none hover:text-primary data-[state=active]:border-primary data-[state=inactive]:border-transparent data-[state=active]:font-bold dark:data-[state=inactive]:text-accent-light"
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
              <div class="mx-auto flex max-w-6xl flex-col items-start p-6">
                <div
                  v-if="user"
                  class="w-full">
                  <textarea-root
                    v-model="newCommentValue"
                    class="w-full rounded-xl shadow-sm disabled:pointer-events-none disabled:bg-gray-100"
                    :disabled="submitting"
                    placeholder="Add a comment" />
                  <div class="my-2 flex w-full items-center justify-end gap-6">
                    <typography class="text-sm text-muted-foreground dark:text-muted-foreground">
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
                </div>
                <div
                  v-else
                  class="w-full">
                  <typography class="mb-4 text-center text-muted-foreground">
                    Please <nuxt-link
                      class="text-primary hover:underline"
                      to="/auth">
                      sign in
                    </nuxt-link> to leave a comment
                  </typography>
                  <separator class="mb-4" />
                </div>
                <gc-empty-state
                  v-if="!($store.data.selectedPack as PublicPack)?.comments?.length"
                  class="mx-auto">
                  <typography>
                    No comments yet
                  </typography>
                </gc-empty-state>
                <div
                  v-else
                  class="flex w-full flex-col items-end">
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
      <div class="blur-sm">
        <div
          class="mx-auto w-full max-w-xl p-4 md:p-6"
          role="status">
          <div class="mb-2.5 h-2.5 w-32 rounded-full bg-gray-200" />
          <div class="mb-10 h-2 w-48 rounded-full bg-gray-200" />
          <div class="mt-4 flex items-baseline">
            <div class="h-72 w-full rounded-t-lg bg-gray-200" />
            <div class="ms-6 h-56 w-full rounded-t-lg bg-gray-200" />
            <div class="ms-6 h-72 w-full rounded-t-lg bg-gray-200" />
            <div class="ms-6 h-64 w-full rounded-t-lg bg-gray-200" />
            <div class="ms-6 h-80 w-full rounded-t-lg bg-gray-200" />
            <div class="ms-6 h-72 w-full rounded-t-lg bg-gray-200" />
            <div class="ms-6 h-80 w-full rounded-t-lg bg-gray-200" />
          </div>
          <span class="sr-only">Loading...</span>
        </div>

        <div
          class="mx-auto mt-14 max-w-xl space-y-4 divide-y divide-gray-200 p-4 md:p-6"
          role="status">
          <div class="flex items-center justify-between">
            <div>
              <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
              <div class="h-2 w-32 rounded-full bg-gray-200" />
            </div>
            <div class="h-2.5 w-12 rounded-full bg-gray-300" />
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
              <div class="h-2 w-32 rounded-full bg-gray-200" />
            </div>
            <div class="h-2.5 w-12 rounded-full bg-gray-300" />
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
              <div class="h-2 w-32 rounded-full bg-gray-200" />
            </div>
            <div class="h-2.5 w-12 rounded-full bg-gray-300" />
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
              <div class="h-2 w-32 rounded-full bg-gray-200" />
            </div>
            <div class="h-2.5 w-12 rounded-full bg-gray-300" />
          </div>
          <div class="flex items-center justify-between pt-4">
            <div>
              <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300" />
              <div class="h-2 w-32 rounded-full bg-gray-200" />
            </div>
            <div class="h-2.5 w-12 rounded-full bg-gray-300" />
          </div>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>
