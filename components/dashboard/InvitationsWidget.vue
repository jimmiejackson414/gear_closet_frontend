<script lang='ts' setup>
  import dayjs from 'dayjs';
  import GcSkeleton from '@/components/common/GcSkeleton.vue';
  import { type Database, TripFriendStatus } from '@/types';
  import type { ExtendedTripFriend } from '@/types/helpers';

  interface Props {
    data: ExtendedTripFriend[];
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: () => [],
    loading: true,
  });

  const $appStore = useAppStore();
  const submitting = ref(false);

  const formattedTripDate = (invite: ExtendedTripFriend) => {
    const date1 = dayjs(invite.trip?.starting_date)
      .format('MMM D, YYYY');
    const date2 = dayjs(invite.trip?.ending_date)
      .format('MMM D, YYYY');
    return `${date1} - ${date2}`;
  };

  /**
   * Decline a trip invite
   * @param invite ExtendedTripFriend
   */
  const decliningId = ref<number | undefined>(undefined);
  const declineInvite = async (invite: ExtendedTripFriend) => {
    decliningId.value = invite.id;
    submitting.value = true;
    try {
      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase
        .from('trip_friends')
        .update({ status: TripFriendStatus.DECLINED })
        .eq('id', invite.id);

      // TODO: fetch new data and set to store data, or remove from store data
      // Temporarily show an "declined" message like we do on friends page

      if (data && !error) {
        $appStore.notifyPositive('You have successfully declined the invite.');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error declining the invite.');
    } finally {
      decliningId.value = undefined;
      submitting.value = false;
    }
  };

  /**
   * Accept a trip invite
   * @param invite ExtendedTripFriend
   */
  const acceptingId = ref<number | undefined>(undefined);
  const acceptInvite = async (invite: ExtendedTripFriend) => {
    acceptingId.value = invite.id;
    submitting.value = true;
    try {
      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase
        .from('trip_friends')
        .update({ status: TripFriendStatus.ACCEPTED, accepted_invite_on: new Date()
          .toISOString() })
        .eq('id', invite.id);

      // TODO: fetch new trip_friend and set to store data.
      // Temporarily show an "accepted" message like we do on friends page

      if (data && !error) {
        $appStore.notifyPositive('You have successfully accepted the invite!');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error accepting the invite.');
    } finally {
      acceptingId.value = undefined;
      submitting.value = false;
    }
  };
</script>

<template>
  <card
    class="h-full p-4 rounded-3xl"
    data-testid="invitations-widget">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="flex justify-start items-center mb-4 py-4">
        <icon-calendar-check class="h-6 mr-6 text-primary dark:text-primary-foreground w-6" />
        <p class="!font-bold text-base">
          Invitations <span class="font-normal text-grey">({{ data.length || 0 }})</span>
        </p>
      </div>
      <div>
        <ul
          v-if="data.length"
          class="divide-grey divide-y">
          <li
            v-for="invite in data"
            :key="invite.id"
            class="flex items-center">
            <div class="flex flex-col">
              <typography class="font-semibold">
                {{ invite.trip?.name }}
              </typography>
              <typography
                class="italic my-1"
                variant="muted">
                Invited by {{ friendlyUsername(invite.profile) }}
              </typography>
              <typography variant="small">
                {{ formattedTripDate(invite) }}
              </typography>
              <div class="flex items-center mt-3">
                <button-root
                  class="mr-2"
                  :disabled="submitting"
                  :loading="decliningId === invite.id"
                  size="sm"
                  variant="outline"
                  @click="declineInvite(invite)">
                  Decline
                </button-root>
                <button-root
                  :disabled="submitting"
                  :loading="acceptingId === invite.id"
                  size="sm"
                  @click="acceptInvite(invite)">
                  Accept
                </button-root>
              </div>
            </div>
          </li>
        </ul>
        <typography
          v-else
          class="mb-4 text-center">
          You don't currently have any pending invitations.
        </typography>
      </div>
    </div>
  </card>
</template>
