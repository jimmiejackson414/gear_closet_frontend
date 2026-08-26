<script lang='ts' setup>
  import tailwind from '@/utils/tailwind';
  import type { Database } from '@/types';
  import type { PublicPack } from '@/types/closet';
  import type { ExtendedComment } from '@/types/planning';

  const user = useSupabaseUser();
  const $userStore = useUserStore();
  // TODO: Figure out way to access user to dynamically set colorMode. Currently causes 500 error.
  definePageMeta({ layout: 'public-layout', public: true });

  /**
   * Fetches the pack data.
   */
  const $appStore = useAppStore();
  const $store = useClosetStore();
  const $route = useRoute();
  /** Set only after fetch from the loaded pack — never from stale Pinia state. */
  type PublicPackGateReason = 'not_found' | 'error';
  const packGateReason = ref<PublicPackGateReason | null>(null);

  const packSlug = computed(() => {
    const raw = Array.isArray($route.params.slug) ? $route.params.slug[0] : $route.params.slug;
    return typeof raw === 'string' ? raw.trim() : '';
  });

  const showPackGate = computed(() => packGateReason.value !== null);

  const packGateCopy = computed(() => {
    switch (packGateReason.value) {
    case 'not_found':
      return {
        description: 'This link may be incorrect, the pack may have been removed, or it may not be shared publicly. Pack owners can turn off Private in pack settings to share a link with anyone.',
        title: 'Pack not found',
      };
    case 'error':
      return {
        description: 'Something went wrong while loading this pack. Please try again.',
        title: 'Couldn\'t load this pack',
      };
    default:
      return { description: '', title: '' };
    }
  });

  const canComposeComment = computed(() => {
    const pack = $store.data.selectedPack;
    const uid = user.value?.sub;
    if (!pack?.allow_comments || !uid) return false;
    if (!pack.private) return true;
    return pack.profile_id === uid;
  });

  const fetchPack = async () => {
    try {
      $store.pageLoading = true;
      // Clear warm closet store so a previous pack can't flash through the gate.
      $store.data.selectedPack = undefined;
      packGateReason.value = null;

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
        .eq('slug', packSlug.value)
        .order('position', { ascending: true, referencedTable: 'categories' })
        .order('position', { ascending: true, referencedTable: 'categories.category_items' })
        .order('created_at', { ascending: false, referencedTable: 'comments' })
        .order('created_at', { ascending: false, referencedTable: 'comments.replies' })
        .maybeSingle();

      if (error) throw error;

      // Privacy: RLS hides private packs from guests and non-party users
      // (maybeSingle returns null). Trip members and owners receive the row and
      // can view it even when the pack is private.
      if (!fetchedPack || (fetchedPack.private && !user.value)) {
        packGateReason.value = 'not_found';
        $store.data.selectedPack = undefined;
        return;
      }

      $store.data.selectedPack = fetchedPack as PublicPack;
      packGateReason.value = null;
    } catch {
      packGateReason.value = 'error';
      $store.data.selectedPack = undefined;
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
    if (!text || !user.value?.sub) return;

    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      // insert comment
      const { data, error } = await supabase
        .from('comments')
        .insert({
          pack_id: $store.data.selectedPack?.id as number,
          profile_id: user.value.sub,
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
        .maybeSingle();

      if (!comment || commentError) throw commentError;
      ($store.data.selectedPack as PublicPack)?.comments?.unshift(comment as ExtendedComment);
      newCommentValue.value = undefined;
      $appStore.notifyPositive('Comment successfully added!');
    } catch {
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

  const commentingAsName = computed(() =>
    friendlyUsername($userStore.profile) || 'you',
  );

  /**
   * Tabs functionality
   */
  enum TableTabs {
    DETAILS,
    COMMENTS,
  }
  const activeTab = ref(TableTabs.DETAILS);

  const commentsDisabledCopy = 'The pack owner has turned off comments for this pack.';

  useHead({ title: selectedPackName.value || 'Public Pack' });
</script>

<template>
  <div class="py-8">
    <div v-if="!showPackGate">
      <div class="card card-main">
        <div class="flex justify-start items-center gap-4 mb-4">
          <h1 class="text-2xl">
            {{ friendlyUsername(($store.data.selectedPack as PublicPack)?.profile, { includeTrailName: true }) }}'s
          </h1>
          <h1 class="font-bold text-2xl">
            {{ selectedPackName }}
          </h1>
        </div>
        <card class="px-4 sm:px-8 py-4 rounded-3xl">
          <div class="gap-6 grid grid-cols-1 lg:grid-cols-[1fr_auto_40%]">
            <closet-pack-chart />
            <separator
              class="hidden lg:block"
              orientation="vertical" />
            <closet-pack-details />
          </div>
        </card>

        <tabs
          v-model="activeTab"
          activation-mode="manual"
          class="mt-14"
          :default-value="TableTabs.DETAILS">
          <tabs-list class="bg-background dark:bg-background pb-0 border-muted-foreground border-b rounded-none">
            <tabs-trigger
              class="shadow-none! data-[state=active]:border-primary data-[state=inactive]:border-transparent dark:data-[state=active]:border-primary-light border-b-[3px] rounded-none outline-hidden data-[state=active]:font-bold hover:text-primary dark:data-[state=inactive]:text-accent-light"
              :value="TableTabs.DETAILS">
              Details
            </tabs-trigger>
            <tabs-trigger
              v-tippy="!$store.data.selectedPack?.allow_comments ? { content: commentsDisabledCopy } : undefined"
              class="shadow-none! data-[state=active]:border-primary data-[state=inactive]:border-transparent border-b-[3px] rounded-none outline-hidden data-[state=active]:font-bold hover:text-primary dark:data-[state=inactive]:text-accent-light"
              :disabled="!$store.data.selectedPack?.allow_comments"
              :value="TableTabs.COMMENTS">
              Comments ({{ ($store.data.selectedPack as PublicPack)?.comments?.length || 0 }})
            </tabs-trigger>
          </tabs-list>
          <typography
            v-if="!$store.data.selectedPack?.allow_comments"
            class="mt-2 text-muted-foreground text-sm">
            {{ commentsDisabledCopy }}
          </typography>
          <tabs-content :value="TableTabs.DETAILS">
            <closet-pack-categories />
          </tabs-content>
          <tabs-content :value="TableTabs.COMMENTS">
            <card
              v-if="$store.data.selectedPack?.allow_comments"
              id="comments"
              aria-labelledby="comments-tab"
              role="tabpanel">
              <div class="flex flex-col items-start mx-auto px-6 py-6 max-w-6xl">
                <!-- Compose: public packs, or the owner of a private pack -->
                <template v-if="canComposeComment">
                  <textarea-root
                    v-model="newCommentValue"
                    class="disabled:bg-gray-100 shadow-xs rounded-xl w-full disabled:pointer-events-none"
                    :disabled="submitting"
                    placeholder="Add a comment" />
                  <div class="flex items-center gap-6 my-2 ml-auto">
                    <typography class="text-muted-foreground dark:text-muted-foreground text-sm">
                      Commenting as <span class="font-bold">{{ commentingAsName }}</span>
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
                </template>
                <typography
                  v-else-if="!user"
                  class="mb-4 text-muted-foreground text-sm">
                  <nuxt-link
                    class="font-semibold text-primary hover:underline"
                    :to="{ name: 'login' }">
                    Sign in
                  </nuxt-link>
                  to leave a comment.
                </typography>

                <!-- Comment list: visible to guests and signed-in users -->
                <gc-empty-state
                  v-if="!($store.data.selectedPack as PublicPack)?.comments?.length"
                  class="mx-auto">
                  <typography>
                    Be the first to comment!
                  </typography>
                </gc-empty-state>
                <div
                  v-else
                  class="flex flex-col items-end w-full">
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
      <alert-dialog :open="showPackGate">
        <alert-dialog-content class="max-w-md">
          <alert-dialog-header class="text-center sm:text-center">
            <gc-logo-icon
              :fill="tailwind.theme.colors.primary.DEFAULT"
              wrapper-class="h-8 w-8 mx-auto mb-4" />
            <alert-dialog-title>
              {{ packGateCopy.title }}
            </alert-dialog-title>
            <alert-dialog-description>
              {{ packGateCopy.description }}
            </alert-dialog-description>
          </alert-dialog-header>
          <alert-dialog-footer class="flex-col sm:flex-col gap-2 sm:space-x-0">
            <nuxt-link
              class="w-full"
              :to="{ name: 'index' }">
              <button-root
                class="w-full"
                variant="default">
                Home
              </button-root>
            </nuxt-link>
            <nuxt-link
              v-if="!user"
              class="w-full"
              :to="{ name: 'login' }">
              <button-root
                class="w-full"
                variant="secondary">
                Sign in
              </button-root>
            </nuxt-link>
            <nuxt-link
              class="w-full"
              :to="{ name: user ? 'closet' : 'register' }">
              <button-root
                class="w-full"
                variant="outline">
                Browse
              </button-root>
            </nuxt-link>
          </alert-dialog-footer>
        </alert-dialog-content>
      </alert-dialog>
      <div class="blur-xs card card-main">
        <div
          class="mx-auto p-4 md:p-6 w-full max-w-xl"
          role="status">
          <div class="bg-gray-200 mb-2.5 rounded-full w-32 h-2.5" />
          <div class="bg-gray-200 mb-10 rounded-full w-48 h-2" />
          <div class="flex items-baseline mt-4">
            <div class="bg-gray-200 rounded-t-lg w-full h-72" />
            <div class="bg-gray-200 ms-6 rounded-t-lg w-full h-56" />
            <div class="bg-gray-200 ms-6 rounded-t-lg w-full h-72" />
            <div class="bg-gray-200 ms-6 rounded-t-lg w-full h-64" />
            <div class="bg-gray-200 ms-6 rounded-t-lg w-full h-80" />
            <div class="bg-gray-200 ms-6 rounded-t-lg w-full h-72" />
            <div class="bg-gray-200 ms-6 rounded-t-lg w-full h-80" />
          </div>
          <span class="sr-only">Loading...</span>
        </div>

        <div
          class="space-y-4 mx-auto mt-14 p-4 md:p-6 divide-y divide-gray-200 max-w-xl"
          role="status">
          <div class="flex justify-between items-center">
            <div>
              <div class="bg-gray-300 mb-2.5 rounded-full w-24 h-2.5" />
              <div class="bg-gray-200 rounded-full w-32 h-2" />
            </div>
            <div class="bg-gray-300 rounded-full w-12 h-2.5" />
          </div>
          <div class="flex justify-between items-center pt-4">
            <div>
              <div class="bg-gray-300 mb-2.5 rounded-full w-24 h-2.5" />
              <div class="bg-gray-200 rounded-full w-32 h-2" />
            </div>
            <div class="bg-gray-300 rounded-full w-12 h-2.5" />
          </div>
          <div class="flex justify-between items-center pt-4">
            <div>
              <div class="bg-gray-300 mb-2.5 rounded-full w-24 h-2.5" />
              <div class="bg-gray-200 rounded-full w-32 h-2" />
            </div>
            <div class="bg-gray-300 rounded-full w-12 h-2.5" />
          </div>
          <div class="flex justify-between items-center pt-4">
            <div>
              <div class="bg-gray-300 mb-2.5 rounded-full w-24 h-2.5" />
              <div class="bg-gray-200 rounded-full w-32 h-2" />
            </div>
            <div class="bg-gray-300 rounded-full w-12 h-2.5" />
          </div>
          <div class="flex justify-between items-center pt-4">
            <div>
              <div class="bg-gray-300 mb-2.5 rounded-full w-24 h-2.5" />
              <div class="bg-gray-200 rounded-full w-32 h-2" />
            </div>
            <div class="bg-gray-300 rounded-full w-12 h-2.5" />
          </div>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>
