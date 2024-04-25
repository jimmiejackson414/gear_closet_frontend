<script lang='ts' setup>
  import { FriendRequestStatus, type Database, type Profile } from '@/types';
  import type { ExtendedFriend, ExtendedFriendInvite } from '@/types/helpers';
  import { SearchIcon } from 'lucide-vue-next';

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
        .eq('recipient_id', user.value!.id)
        .eq('status', FriendRequestStatus.PENDING)
        .returns<ExtendedFriendInvite[]>();

      if (requestsData?.length && !requestsError) {
        requests.value = requestsData;
      }

      // Fetch current friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('*, friend:profiles!friends_friend_id_fkey(*)')
        .eq('profile_id', user.value!.id)
        .returns<ExtendedFriend[]>();

      if (friendsData?.length && !friendsError) {
        currentFriends.value = friendsData;
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
    requests.value.filter(r => r.id !== id);
  };

  const showAllFriends = ref(false);
  const filteredFriends = computed(() => showAllFriends.value ? currentFriends.value : currentFriends.value.slice(0, 20));

  /**
   * Search for friends
   */
  const searching = ref(false);
  const searchQuery = ref<string | undefined>(undefined);
  const showAllResults = ref(false);
  const results = ref<Profile[]>([]);
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
          .neq('id', user.value?.id)
          .select();

        if (!error) {
          results.value = data;

          // Fetch friend invitations
          const { data: invitationsData, error: invitationsError } = await supabase
            .from('friend_invitations')
            .select('recipient_id')
            .eq('sender_id', user.value!.id)
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
    title: 'Friends | Gear Closet',
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
        <p class="!font-bold text-base">
          Friend Requests ({{ requests.length }})
        </p>
        <gc-button
          class="ml-4"
          :disabled="!requests.length || showAllRequests || requests.length < 5"
          ghost
          label="See All"
          @click="showAllRequests = true" />
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
      <p
        v-else
        class="mb-8 text-gray-400">
        You don't have any pending requests at this time.
      </p>
    </div>

    <hr class="bg-gray-200 border-0 h-px my-8">

    <div class="flex justify-center flex-col">
      <div>
        <div class="flex justify-start items-center gap-8">
          <p class="!font-bold text-base">
            Find New Friends
          </p>
          <gc-input
            v-model="searchQuery"
            class="!w-96"
            :disabled="searching"
            :loading="searching"
            name="friend-search"
            placeholder="Search by name or email"
            :prepend-icon="SearchIcon" />
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
            <p class="font-bold text-sm uppercase">
              Results ({{ results.length }})
            </p>
            <gc-button
              class="ml-4"
              :disabled="!results.length || showAllResults || results.length < 5"
              ghost
              label="See All"
              @click="showAllResults = true" />
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
          <p class="mt-8 text-gray-400">
            No results found for "{{ searchQuery }}".
          </p>
        </div>
      </div>
    </div>

    <hr class="bg-gray-200 border-0 h-px my-8">

    <div>
      <div class="flex justify-start items-center">
        <p class="!font-bold text-base">
          All Friends ({{ currentFriends.length }})
        </p>
        <gc-button
          class="ml-4"
          :disabled="!currentFriends.length || showAllFriends || currentFriends.length < 21"
          ghost
          label="See All"
          @click="showAllFriends = true" />
      </div>
      <div
        v-if="filteredFriends.length"
        class="flex gap-4">
        <friend-item
          v-for="friend in filteredFriends"
          :key="friend.id"
          :friend="friend" />
      </div>
      <p
        v-else
        class="mb-8 text-gray-400">
        You haven't connected with any friends quite yet.
      </p>
    </div>
  </div>
</template>
