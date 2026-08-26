<script lang='ts' setup>
  import dayjs, { type Dayjs } from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { FriendRequestStatus, type Database } from '@/types';
  import type { ExtendedFriend, ExtendedFriendInvite } from '@/types/planning';

  dayjs.extend(relativeTime);

  interface Props {
    friend: ExtendedFriendInvite;
  }

  const props = defineProps<Props>();
  const emits = defineEmits<{
    (event: 'accept', friend: ExtendedFriend, requestId: number): void;
    (event: 'decline', requestId: number): void;
  }>();
  const $appStore = useAppStore();

  /**
   * Accepts a friend request
   */
  const submittingAccept = ref(false);
  const acceptFriendRequest = async () => {
    const supabase = useSupabaseClient<Database>();
    const user = useSupabaseUser();
    try {
      submittingAccept.value = true;
      const acceptedAt = new Date()
        .toISOString();
      // update friend request status
      const { data, error } = await supabase.from('friend_invitations')
        .update({
          request_responded_at: acceptedAt,
          status: FriendRequestStatus.ACCEPTED,
        })
        .eq('id', props.friend.id)
        .select();

      if (!data?.length || error) throw new Error();

      const friendRequest = data[0];
      if (!friendRequest) throw new Error();

      // Insert friendship rows and return the current user's row with friend profile
      const { data: insertedFriends, error: insertError } = await supabase
        .from('friends')
        .insert([
          { friend_id: friendRequest.sender_id, profile_id: friendRequest.recipient_id },
          { friend_id: friendRequest.recipient_id, profile_id: friendRequest.sender_id },
        ])
        .select('*, friend:profiles!friend_id(*)');

      if (insertError || !insertedFriends?.length) throw new Error();

      const currentUserId = user.value?.sub;
      const newFriend = insertedFriends.find(row => row.profile_id === currentUserId)
        ?? insertedFriends.find(row => row.friend_id === props.friend.sender.id);

      if (!newFriend) throw new Error();

      $appStore.notifyPositive('Friend request accepted.');
      emits('accept', newFriend as ExtendedFriend, props.friend.id);
      madeSelection.value = 'accepted';
      selectionTimestamp.value = dayjs();
    } catch {
      $appStore.notifyNegative('An error occurred while accepting the friend request.');
    } finally {
      submittingAccept.value = false;
    }
  };

  /**
   * Declines a friend request
   */
  const submittingDecline = ref(false);
  const declineFriendRequest = async () => {
    const supabase = useSupabaseClient<Database>();
    try {
      submittingDecline.value = true;
      const { error } = await supabase.from('friend_invitations')
        .update({
          request_responded_at: new Date()
            .toISOString(),
          status: FriendRequestStatus.DECLINED,
        })
        .eq('id', props.friend.id)
        .select();

      if (error) throw new Error();

      $appStore.notifyPositive('Friend request declined.');
      emits('decline', props.friend.id);
      madeSelection.value = 'declined';
      selectionTimestamp.value = dayjs();
    } catch {
      $appStore.notifyNegative('An error occurred while declining the friend request.');
    } finally {
      submittingDecline.value = false;
    }
  };

  const madeSelection = ref<'accepted' | 'declined' | null>(null);
  const selectionTimestamp = ref<Dayjs | null>(null);
</script>

<template>
  <friend-row
    :image="friend.sender.image"
    :initials="initials(friend.sender)"
    :subtitle="madeSelection
      ? `${capitalize(madeSelection)} ${dayjs().to(selectionTimestamp)}`
      : 'Wants to connect'"
    :title="friendlyUsername(friend.sender, { includeTrailName: true })">
    <template v-if="!madeSelection">
      <button-root
        :disabled="submittingDecline || submittingAccept"
        :loading="submittingDecline"
        size="sm"
        variant="secondary"
        @click="declineFriendRequest">
        Decline
      </button-root>
      <button-root
        :disabled="submittingAccept || submittingDecline"
        :loading="submittingAccept"
        size="sm"
        variant="accent"
        @click="acceptFriendRequest">
        Accept
      </button-root>
    </template>
  </friend-row>
</template>
