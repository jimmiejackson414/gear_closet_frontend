<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { type Database, FriendRequestStatus, type Tables } from '@/types';
  import { NotificationKind } from '@/utils/notifications';

  dayjs.extend(relativeTime);

  interface Props {
    profile: Tables<'profiles'>;
    requestPending: boolean;
  }

  const props = defineProps<Props>();

  /**
   * Add friend request
   */
  const $appStore = useAppStore();
  const $store = useUserStore();
  const submitting = ref(false);
  const submittedRequest = ref(props.requestPending);

  watch(
    () => props.requestPending,
    (pending) => {
      submittedRequest.value = pending;
    },
  );
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
            sender_id: user.value!.sub,
            status: FriendRequestStatus.PENDING,
          },
        ])
        .select();

      if (!data || error) throw new Error();

      const { error: notificationError } = await supabase.from('notifications')
        .insert([
          {
            title: NotificationKind.FRIEND_REQUEST,
            content: `You have a new friend request from ${$store.profile?.first_name} ${$store.profile?.last_name}.`,
            profile_id: props.profile.id,
            sender_id: user.value!.sub,
          },
        ]);

      if (notificationError) throw new Error();

      submittedRequest.value = true;
    } catch {
      $appStore.notifyNegative('An error occurred while adding the friend.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <div class="bg-gray-50 shadow-xs hover:shadow-xl my-4 px-8 py-4 rounded-2xl w-fit transition duration-200 ease-out">
    <div class="flex items-center gap-4">
      <gc-avatar
        :initials="initials(profile)"
        size="lg"
        :url="buildImageSrc(profile.image)" />
      <div class="flex flex-col">
        <typography class="font-bold!">
          {{ friendlyUsername(profile) }}
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
        class="flex mt-2">
        <typography class="text-muted-foreground text-xs italic">
          Invite requested
        </typography>
      </div>
    </div>
  </div>
</template>
