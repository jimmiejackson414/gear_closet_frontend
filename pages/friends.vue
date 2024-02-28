<script lang='ts' setup>
  import type { Database } from '@/types';
  import type { ExtendedFriend } from '@/types/helpers';

  definePageMeta({ layout: 'page-layout' });

  const $appStore = useAppStore();
  const requests = ref<ExtendedFriend[]>([]);
  const currentFriends = ref<ExtendedFriend[]>([]);
  const fetchFriendPage = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: requestsData, error } = await supabase
        .from('friends')
        .select('*, profile:profiles!profile_id(*)')
        .or(`profile_id.eq.${user.value!.id},invite_accepted_on.is.null,and(friend_id.eq.${user.value!.id},invite_accepted_on.not.is.null)`)
        .returns<ExtendedFriend[]>();

      if (requestsData?.length && !error) {
        // Filter for friend requests where the logged in user is the recipient and the invite has not been accepted
        requests.value = requestsData.filter(r => r.friend_id === user.value!.id && r.invite_accepted_on === null);

        // Filter for current friends where the logged in user is the sender and the invite has been accepted
        currentFriends.value = requestsData.filter(r => 
          (r.profile_id === user.value!.id || r.friend_id === user.value!.id) && r.invite_accepted_on !== null,
        );
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
    // requests.value = requests.value.filter(r => r.id !== friend.id) as typeof requests.value;
  };

  const handleDeclineRequest = (id: number) => {
    requests.value.filter(r => r.id !== id);
  };

  const showAllFriends = ref(false);
  const filteredFriends = computed(() => showAllFriends.value ? currentFriends.value : currentFriends.value.slice(0, 20));

  // const searching = ref(false);

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
    <div class="flex items-center mb-8">
      <p class="!font-bold text-base">
        Find New Friends
      </p>
      <!-- <gc-autocomplete :disabled="searching" :loading="searching" :model-value="" /> -->
    </div>

    <hr class="bg-gray-200 border-0 h-px my-8">

    <div class="mb-8">
      <div class="flex justify-between items-center">
        <p class="!font-bold text-base">
          Friend Requests ({{ requests.length }})
        </p>
        <gc-button
          :disabled="!requests.length || showAllRequests || requests.length < 5"
          ghost
          label="See All"
          @click="showAllRequests = true" />       
      </div>
      <div
        v-if="filteredRequests.length"
        class="flex gap-4">
        <slide-up-transition>
          <friend-request-item
            v-for="request in filteredRequests"
            :key="request.id"
            :friend="request"
            @accept="handleAcceptRequest"
            @decline="handleDeclineRequest" />
        </slide-up-transition>
      </div>
      <p
        v-else
        class="mb-8 text-center text-gray-400">
        You don't have any pending requests at this time.
      </p>
    </div>

    <hr class="bg-gray-200 border-0 h-px my-8">

    <div>
      <div class="flex justify-between items-center">
        <p class="!font-bold text-base">
          All Friends ({{ currentFriends.length }})
        </p>
        <gc-button
          :disabled="!currentFriends.length || showAllFriends || currentFriends.length < 21"
          ghost
          label="See All"
          @click="showAllFriends = true" />
      </div>
      <div
        v-if="filteredFriends.length"
        class="flex gap-4">
        <slide-up-transition>
          <friend-item
            v-for="friend in filteredFriends"
            :key="friend.id"
            :friend="friend" />
        </slide-up-transition>
      </div>
      <p
        v-else
        class="mb-8 text-center text-gray-400">
        You haven't connected with any friends quite yet.
      </p>
    </div>
  </div>
</template>
