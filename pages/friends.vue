<script lang='ts' setup>
  import { IconSearch } from '#components';
  import { type Database, FriendRequestStatus, type Tables } from '@/types';
  import type { ExtendedFriend, ExtendedFriendInvite } from '@/types/helpers';

  definePageMeta({ layout: 'page-layout' });

  const $appStore = useAppStore();

  /**
   * Fetch friend requests and current friends
   */
  const requests = ref<ExtendedFriendInvite[]>([]);
  const currentFriends = ref<ExtendedFriend[]>([]);
  const fetchFriendPage = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();

      // Fetch friend requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('friend_invitations')
        .select('*, sender:profiles!sender_id(*), recipient:profiles!recipient_id(*)')
        .eq('recipient_id', user.value!.sub)
        .eq('status', FriendRequestStatus.PENDING);

      if (requestsError) {
        $appStore.notifyNegative('An error occurred while fetching friend requests.');
      } else {
        requests.value = (requestsData as ExtendedFriendInvite[]) ?? [];
      }

      // Fetch current friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('*, friend:profiles!friends_friend_id_fkey(*)')
        .eq('profile_id', user.value!.sub);

      if (friendsError) {
        $appStore.notifyNegative('An error occurred while fetching friends.');
      } else {
        currentFriends.value = (friendsData as ExtendedFriend[]) ?? [];
      }
    } catch {
      $appStore.notifyNegative('An error occurred while fetching the page.');
    }
  };
  await fetchFriendPage();

  const showAllRequests = ref(false);
  const filteredRequests = computed(() => showAllRequests.value ? requests.value : requests.value.slice(0, 5));

  const removeRequest = (requestId: number) => {
    requests.value = requests.value.filter((r: ExtendedFriendInvite) => r.id !== requestId);
  };

  const handleAcceptRequest = (friend: ExtendedFriend, requestId: number) => {
    currentFriends.value.unshift(friend);
    removeRequest(requestId);
  };

  const handleDeclineRequest = (id: number) => {
    removeRequest(id);
  };

  const showAllFriends = ref(false);
  const filteredFriends = computed(() => showAllFriends.value ? currentFriends.value : currentFriends.value.slice(0, 20));

  /**
   * Search for friends
   */
  const searching = ref(false);
  const searchQuery = ref<string | undefined>(undefined);
  const showAllResults = ref(false);
  const results = ref<Tables<'profiles'>[]>([]);
  const performedSearch = ref(false);
  const filteredResults = computed(() => showAllResults.value ? results.value : results.value.slice(0, 5));
  const pendingRequestIds = ref<(string | null)[]>([]);
  let searchGeneration = 0;

  const fetchSearchResults = async () => {
    const query = searchQuery.value?.trim();
    if (!query) {
      results.value = [];
      pendingRequestIds.value = [];
      performedSearch.value = false;
      return;
    }

    const generation = ++searchGeneration;
    performedSearch.value = false;
    searching.value = true;

    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();

      const tsquery = query.replace(/ /g, '&');
      const { data, error } = await supabase
        .rpc('search_profiles', { search_query: tsquery })
        .neq('id', user.value?.sub ?? '')
        .select();

      // Ignore stale responses from older keystrokes
      if (generation !== searchGeneration) return;

      if (error) {
        $appStore.notifyNegative('An error occurred while searching for friends.');
        results.value = [];
        pendingRequestIds.value = [];
        return;
      }

      results.value = data ?? [];
      pendingRequestIds.value = [];

      if (!data?.length) return;

      // Fetch pending invitations for these results
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('friend_invitations')
        .select('recipient_id')
        .eq('sender_id', user.value!.sub)
        .eq('status', FriendRequestStatus.PENDING)
        .in('recipient_id', data.map(profile => profile.id));

      if (generation !== searchGeneration) return;

      if (invitationsError) {
        pendingRequestIds.value = [];
        return;
      }

      pendingRequestIds.value = invitationsData?.length
        ? invitationsData.map(invitation => invitation.recipient_id)
        : [];
    } catch {
      if (generation !== searchGeneration) return;
      $appStore.notifyNegative('An error occurred while searching for friends.');
      results.value = [];
      pendingRequestIds.value = [];
    } finally {
      if (generation === searchGeneration) {
        searching.value = false;
        performedSearch.value = true;
      }
    }
  };

  watch(searchQuery, debounce(async () => {
    if (searchQuery.value) {
      await fetchSearchResults();
    } else {
      searchGeneration += 1;
      results.value = [];
      pendingRequestIds.value = [];
      performedSearch.value = false;
      searching.value = false;
    }
  }, 500));

  useHead({
    title: 'Friends',
    meta: [
      {
        name: 'description',
        content: 'Find new friends and manage your current friends.',
      },
    ],
  });
</script>

<template>
  <div class="pb-8">
    <div>
      <div class="flex justify-start items-center">
        <typography class="font-bold!">
          Friend Requests ({{ requests.length }})
        </typography>
        <button-root
          class="ml-4"
          :disabled="!requests.length || showAllRequests || requests.length < 5"
          variant="ghost"
          @click="showAllRequests = true">
          See All
        </button-root>
      </div>
      <div
        v-if="filteredRequests.length"
        class="flex gap-4">
        <friend-request-item
          v-for="request in filteredRequests"
          :key="request.id"
          :friend="request"
          @accept="handleAcceptRequest"
          @decline="handleDeclineRequest" />
      </div>
      <typography
        v-else
        class="mb-8 text-muted-foreground">
        You don't have any pending requests at this time.
      </typography>
    </div>

    <separator class="my-8" />

    <div class="flex justify-center flex-col">
      <div>
        <div class="grid grid-cols-[auto_1fr] gap-8 justify-start items-center">
          <typography class="font-bold!">
            Find New Friends
          </typography>
          <input-root
            v-model="searchQuery"
            class="w-96"
            :disabled="searching"
            :loading="searching"
            name="friend-search"
            placeholder="Search by name or email"
            :prepend-icon="IconSearch" />
        </div>
        <div
          v-if="searching"
          class="flex justify-center mt-8">
          <gc-spinner />
        </div>
        <div
          v-else-if="results.length && !searching"
          class="mt-8">
          <div class="flex justify-start items-center">
            <typography
              class="font-bold uppercase"
              size="sm">
              Results ({{ results.length }})
            </typography>
            <button-root
              class="ml-4"
              :disabled="!results.length || showAllResults || results.length < 5"
              variant="ghost"
              @click="showAllResults = true">
              See All
            </button-root>
          </div>
          <div class="flex gap-4">
            <friend-search-item
              v-for="result in filteredResults"
              :key="result.id"
              :profile="result"
              :request-pending="pendingRequestIds.includes(result.id)" />
          </div>
        </div>
        <div v-else-if="!searching && !results.length && performedSearch">
          <typography class="mt-8 text-muted-foreground">
            No results found for "{{ searchQuery }}".
          </typography>
        </div>
      </div>
    </div>

    <separator class="my-8" />

    <div>
      <div class="flex justify-start items-center">
        <typography class="font-bold!">
          All Friends ({{ currentFriends.length }})
        </typography>
        <button-root
          class="ml-4"
          :disabled="!currentFriends.length || showAllFriends || currentFriends.length < 21"
          variant="ghost"
          @click="showAllFriends = true">
          See All
        </button-root>
      </div>
      <div
        v-if="filteredFriends.length"
        class="flex gap-4">
        <friend-item
          v-for="friend in filteredFriends"
          :key="friend.id"
          :friend="friend" />
      </div>
      <typography
        v-else
        class="mb-8 text-muted-foreground">
        You haven't connected with any friends quite yet.
      </typography>
    </div>
  </div>
</template>
