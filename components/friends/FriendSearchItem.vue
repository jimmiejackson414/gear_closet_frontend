<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { type Database, FriendRequestStatus, type Tables } from '@/types';

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
  const $store = useUserStore();
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
            content: `You have a new friend request from ${$store.profile?.first_name} ${$store.profile?.last_name}.`,
            profile_id: props.profile.id,
            title: 'New Friend Request',
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
  <card class="my-4 w-fit rounded-2xl px-8 py-4 duration-200">
    <div class="flex items-center gap-4">
      <gc-avatar
        :initials="initials(profile)"
        size="lg"
        :url="buildImageSrc(profile.image)" />
      <div class="flex flex-col">
        <typography class="!font-bold">
          {{ friendlyUsername(profile) }}
        </typography>
        <typography size="sm">
          {{ mutualFriends }}
        </typography>
      </div>
      <button-root
        v-if="!submittedRequest"
        :disabled="submitting"
        :loading="submitting"
        size="sm"
        @click="handleAddFriend">
        Add Friend
      </button-root>
      <div
        v-else
        class="mt-2 flex">
        <typography class="text-xs italic text-muted-foreground">
          Invite requested
        </typography>
      </div>
    </div>
  </card>
</template>
