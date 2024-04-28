<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { FriendRequestStatus, type Database, type Tables } from '@/types';

  dayjs.extend(relativeTime);

  interface Props {
    profile: Tables<'profiles'>;
    requestPending: boolean;
  }

  const props = defineProps<Props>();

  const mutualFriends = computed(() => {
    return '2 mutual friends';
  });

  /**
   * Add friend request
   */
  const $appStore = useAppStore();
  const { profile: userProfile } = storeToRefs(useUserStore());
  const submitting = ref(false);
  const submittedRequest = ref(props.requestPending);
  const handleAddFriend = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      // Insert friend record
      const { data, error } = await supabase.from('friend_invitations')
        .insert([
          {
            recipient_id: props.profile.id,
            sender_id: user.value!.id,
            status: FriendRequestStatus.PENDING,
          },
        ])
        .select();

      if (!data || error) throw new Error();

      // Insert notification record
      await supabase.from('notifications')
        .insert([
          {
            title: 'New Friend Request',
            content: `You have a new friend request from ${userProfile.value?.first_name} ${userProfile.value?.last_name}.`,
            profile_id: props.profile.id,
          },
        ]);

      submittedRequest.value = true;
    } catch (err) {
      $appStore.notifyNegative('An error occurred while adding the friend.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <div class="bg-gray-50 duration-200 ease-snap my-4 px-8 py-4 rounded-2xl shadow-light hover:shadow-xl transition w-fit">
    <div class="flex items-center gap-4">
      <gc-avatar
        :profile="profile"
        size="lg" />
      <div class="flex flex-col">
        <p class="!font-bold text-dark-grey">
          {{ friendlyUsername(profile) }}
        </p>
        <p class="text-sm">
          {{ mutualFriends }}
        </p>
      </div>
      <gc-button
        v-if="!submittedRequest"
        :disabled="submitting"
        label="Add Friend"
        :loading="submitting"
        size="sm"
        @click="handleAddFriend" />
      <div
        v-else
        class="flex mt-2">
        <p class="italic text-gray-500 text-xs">
          Invite requested
        </p>
      </div>
    </div>
  </div>
</template>
