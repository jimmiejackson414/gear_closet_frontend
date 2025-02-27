<script lang='ts' setup>
  import dayjs, { type Dayjs } from 'dayjs';
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
  const madeSelection = ref<'accepted' | 'declined' | null>(null);
  const selectionTimestamp = ref<Dayjs | null>(null);

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
      const { error: updateError } = await supabase
        .from('trip_friends')
        .update({ status: TripFriendStatus.DECLINED })
        .eq('id', invite.id);

      if (updateError) throw new Error();
      const { data, error } = await supabase
        .from('trip_friends')
        .select(`
          *,
          profile:profiles!invited_by_id(*),
          trip:trips(*)
        `)
        .eq('id', invite.id)
        .single();

      if (data && !error) {
        $appStore.notifyPositive('You have successfully declined the invite.');
        madeSelection.value = 'declined';
        selectionTimestamp.value = dayjs();
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
      const { error: updateError } = await supabase
        .from('trip_friends')
        .update({ accepted_invite_on: new Date()
          .toISOString(), status: TripFriendStatus.ACCEPTED })
        .eq('id', invite.id);

      if (updateError) throw new Error();

      const { data, error } = await supabase
        .from('trip_friends')
        .select(`
          *,
          profile:profiles!invited_by_id(*),
          trip:trips(*)
        `)
        .eq('id', invite.id)
        .single();

      if (data && !error) {
        $appStore.notifyPositive('You have successfully accepted the invite!');
        madeSelection.value = 'accepted';
        selectionTimestamp.value = dayjs();
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
    class="h-full rounded-3xl p-4"
    data-testid="invitations-widget">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="mb-4 flex items-center justify-start py-4">
        <icon-calendar-check class="mr-6 size-6 text-primary dark:text-primary-foreground" />
        <p class="text-base !font-bold">
          Invitations <span class="font-normal text-muted-foreground">({{ data.length || 0 }})</span>
        </p>
      </div>
      <div>
        <ul
          v-if="data.length"
          class="divide-y divide-muted-foreground">
          <li
            v-for="invite in data"
            :key="invite.id"
            class="flex items-center">
            <div class="flex flex-col">
              <typography class="font-semibold">
                {{ invite.trip?.name }}
              </typography>
              <typography
                class="my-1 italic"
                variant="muted">
                Invited by {{ friendlyUsername(invite.profile) }}
              </typography>
              <typography variant="small">
                {{ formattedTripDate(invite) }}
              </typography>
              <div
                v-if="madeSelection"
                class="mt-3">
                <typography class="text-xs italic text-muted-foreground">
                  {{ capitalize(madeSelection) }} {{ dayjs().to(selectionTimestamp) }}
                </typography>
              </div>
              <div
                v-else
                class="mt-3 flex items-center">
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
