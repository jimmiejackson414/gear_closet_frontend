<script lang='ts' setup>
  import dayjs, { type Dayjs } from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { Database } from '@/types';
  import type { ExtendedFriend } from '@/types/helpers';

  dayjs.extend(relativeTime);

  interface Props {
    friend: ExtendedFriend;
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
      const { data, error } = await supabase.from('friends')
        .update({ invite_accepted_on: acceptedAt })
        .eq('id', props.friend.id)
        .select();

      if (!data || error) throw new Error();

      $appStore.notifyPositive('Friend request accepted.');
      emits('accept', { ...props.friend, invite_accepted_on: acceptedAt });
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
      const { error } = await supabase.from('friends')
        .delete()
        .eq('id', props.friend.id);

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
        :profile="friend.profile"
        size="xl" />
      <div class="flex flex-col">
        <p class="font-bold text-dark-grey">
          {{ friendlyUsername(friend.profile) }}
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
