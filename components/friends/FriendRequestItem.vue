<script lang='ts' setup>
  import dayjs, { type Dayjs } from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { type Database, FriendRequestStatus } from '@/types';
  import type { ExtendedFriendInvite } from '@/types/helpers';

  dayjs.extend(relativeTime);

  interface Props {
    friend: ExtendedFriendInvite;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['accept', 'decline']);
  const $appStore = useAppStore();
  const $store = useUserStore();

  /**
   * Accepts a friend request
   */
  const submittingAccept = ref(false);
  const acceptFriendRequest = async () => {
    const supabase = useSupabaseClient<Database>();
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

      // Insert new records into the 'friends' table
      const { error: insertError } = await supabase
        .from('friends')
        .insert([
          { friend_id: data[0].sender_id, profile_id: data[0].recipient_id },
          { friend_id: data[0].recipient_id, profile_id: data[0].sender_id },
        ]);

      if (insertError) throw new Error();

      // fetch new friend (ExtendedFriend)
      const { data: newFriend, error: newFriendError } = await supabase.from('friends')
        .select('*, friend:profiles!friend_id(*)')
        .match({ friend_id: props.friend.sender.id, profile_id: props.friend.recipient.id })
        .single();

      if (newFriendError || !newFriend) throw new Error();

      // insert notification record
      const content = newFriend.friend ? `${newFriend.friend.first_name} ${newFriend.friend.last_name} accepted your friend request.` : 'Your friend request has been accepted!';
      await supabase.from('notifications')
        .insert([
          {
            content,
            profile_id: newFriend.profile_id,
            title: 'Friend Request Accepted',
          },
        ]);

      $appStore.notifyPositive('Friend request accepted.');
      $store.profile!.friend_invitations -= 1;
      emits('accept', newFriend);
      madeSelection.value = 'accepted';
      selectionTimestamp.value = dayjs();
    } catch (err) {
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
    } catch (err) {
      $appStore.notifyNegative('An error occurred while declining the friend request.');
    } finally {
      submittingDecline.value = false;
    }
  };

  const madeSelection = ref<'accepted' | 'declined' | null>(null);
  const selectionTimestamp = ref<Dayjs | null>(null);
  const mutualFriends = computed(() => '2 mutual friends'); // TODO: Implement mutual friends
</script>

<template>
  <card class="my-4 px-8 py-4 rounded-2xl w-fit">
    <div class="grid grid-cols-[auto,1fr] gap-4 items-center">
      <gc-avatar
        :initials="initials(friend.sender)"
        size="xl"
        :url="buildImageSrc(friend.sender.image)" />
      <div class="flex flex-col">
        <typography class="font-bold">
          {{ friendlyUsername(friend.sender, { includeTrailName: true }) }}
        </typography>
        <!-- <typography
          class="text-muted-foreground"
          size="sm">
          {{ mutualFriends }}
        </typography> -->
        <div
          v-if="!madeSelection"
          class="flex gap-4 mt-2">
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
        </div>
        <div
          v-else
          class="flex mt-2">
          <typography class="italic text-muted-foreground text-xs">
            {{ capitalize(madeSelection) }} {{ dayjs().to(selectionTimestamp) }}
          </typography>
        </div>
      </div>
    </div>
  </card>
</template>
