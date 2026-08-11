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

      if (requestsData?.length && !requestsError) {
        requests.value = requestsData as ExtendedFriendInvite[];
      }

      // Fetch current friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('*, friend:profiles!friends_friend_id_fkey(*)')
        .eq('profile_id', user.value!.sub);

      if (friendsData?.length && !friendsError) {
        currentFriends.value = friendsData as ExtendedFriend[];
      }
    } catch (err) {
      $appStore.notifyPositive('An error occurred while fetching the page.');
    }
  };
  await fetchFriendPage();

  const showAllRequests = ref(false);
  const filteredRequests = computed(() => showAllRequests.value ? requests.value : requests.value.slice(0, 5));
  const handleAcceptRequest = (friend: ExtendedFriend) => {
    currentFriends.value.unshift(friend);
  };

  const handleDeclineRequest = (id: number) => {
    requests.value.filter((r: ExtendedFriendInvite) => r.id !== id);
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
  let pendingRequestIds: (string | null)[] = [];
  const fetchSearchResults = async () => {
    if (searchQuery.value) {
      performedSearch.value = false;
      searching.value = true;
      try {
        const supabase = useSupabaseClient<Database>();
        const user = useSupabaseUser();

        const tsquery = searchQuery.value.replace(/ /g, '&');
        const { data, error } = await supabase
          .rpc('search_profiles', { search_query: tsquery })
          .neq('id', user.value?.sub ?? '')
          .select();

        if (!error) {
          results.value = data;

          // Fetch friend invitations
          const { data: invitationsData, error: invitationsError } = await supabase
            .from('friend_invitations')
            .select('recipient_id')
            .eq('sender_id', user.value!.sub)
            .in('recipient_id', data.map(profile => profile.id));

          if (invitationsData?.length && !invitationsError) {
            // Store recipient IDs of pending friend requests
            pendingRequestIds = invitationsData.map(invitation => invitation.recipient_id);
          }
        }
      } catch (err) {
        $appStore.notifyPositive('An error occurred while fetching the page.');
      } finally {
        searching.value = false;
        performedSearch.value = true;
      }
    }
  };

  watch(searchQuery, debounce(async () => {
    if (searchQuery.value) {
      await fetchSearchResults();
    } else {
      performedSearch.value = false;
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
        <typography class="!font-bold">
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
        <div class="grid grid-cols-[auto,1fr] gap-8 justify-start items-center">
          <typography class="!font-bold">
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
        <typography class="!font-bold">
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
