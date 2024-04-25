<script lang='ts' setup>
  import dayjs, { type Dayjs } from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { FriendRequestStatus, type Database } from '@/types';
  import type { ExtendedFriendInvite } from '@/types/helpers';

  dayjs.extend(relativeTime);

  interface Props {
    friend: ExtendedFriendInvite;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['accept', 'decline']);
  const $appStore = useAppStore();

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
          status: FriendRequestStatus.ACCEPTED,
          request_responded_at: acceptedAt,
        })
        .eq('id', props.friend.id)
        .select();

      if (!data?.length || error) throw new Error();

      // Insert new records into the 'friends' table
      const { error: insertError } = await supabase
        .from('friends')
        .insert([
          { profile_id: data[0].recipient_id, friend_id: data[0].sender_id },
          { profile_id: data[0].sender_id, friend_id: data[0].recipient_id },
        ]);

      if (insertError) throw new Error();

      // fetch new friend (ExtendedFriend)
      const { data: newFriend, error: newFriendError } = await supabase.from('friends')
        .select('*, friend:profiles!friend_id(*)')
        .eq('friend_id', props.friend.sender.id)
        .single();

      if (newFriendError || !newFriend) throw new Error();

      $appStore.notifyPositive('Friend request accepted.');
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
          status: FriendRequestStatus.DECLINED,
          request_responded_at: new Date()
            .toISOString(),
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

  const mutualFriends = computed(() => {
    return '2 mutual friends'; // TODO: Implement mutual friends
  });

  const madeSelection = ref<'accepted' | 'declined' | null>(null);
  const selectionTimestamp = ref<Dayjs | null>(null);
</script>

<template>
  <div class="bg-gray-50 duration-200 ease-snap my-4 px-8 py-4 rounded-2xl shadow-light hover:shadow-xl transition w-fit">
    <div class="grid grid-cols-[auto,1fr] gap-4 items-center">
      <gc-avatar
        :profile="friend.sender"
        size="xl" />
      <div class="flex flex-col">
        <p class="font-bold text-dark-grey">
          {{ friendlyUsername(friend.sender, { includeTrailName: true }) }}
        </p>
        <p class="text-gray-500 text-sm">
          {{ mutualFriends }}
        </p>
        <div
          v-if="!madeSelection"
          class="flex gap-4 mt-2">
          <gc-button
            :disabled="submittingDecline || submittingAccept"
            label="Decline"
            :loading="submittingDecline"
            size="sm"
            variant="secondary"
            @click="declineFriendRequest" />
          <gc-button
            :disabled="submittingAccept || submittingDecline"
            label="Accept"
            :loading="submittingAccept"
            size="sm"
            variant="positive"
            @click="acceptFriendRequest" />
        </div>
        <div
          v-else
          class="flex mt-2">
          <p class="italic text-gray-500 text-xs">
            {{ capitalize(madeSelection) }} {{ dayjs().to(selectionTimestamp) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
