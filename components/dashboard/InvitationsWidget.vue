<script lang='ts' setup>
  import type { Database, Tables } from '@/types';
  import { TripFriendStatus } from '@/types';

  interface Props {
    data: Tables<'trip_friends'>[];
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    loading: true,
  });

  const emits = defineEmits<{
    (event: 'update:data', value: Tables<'trip_friends'>[]): void;
  }>();

  const $appStore = useAppStore();
  const tripNames = ref<Record<number, string>>({});
  const inviterProfiles = ref<Record<string, Tables<'profiles'>>>({});
  const actingId = ref<number | null>(null);

  const pendingInvites = computed(() =>
    props.data.filter(invite => invite.status === TripFriendStatus.PENDING),
  );

  const enrichInvites = async (invites: Tables<'trip_friends'>[]) => {
    const tripIds = [...new Set(
      invites
        .map(i => i.trip_id)
        .filter((id): id is number => id != null && !tripNames.value[id]),
    )];
    const inviterIds = [...new Set(
      invites
        .map(i => i.invited_by_id)
        .filter(id => id && !inviterProfiles.value[id]),
    )];

    if (!tripIds.length && !inviterIds.length) return;

    try {
      const supabase = useSupabaseClient<Database>();

      if (tripIds.length) {
        const { data: trips, error } = await supabase
          .from('trips')
          .select('id, name')
          .in('id', tripIds);
        if (error) throw error;
        if (trips?.length) {
          const next = { ...tripNames.value };
          for (const trip of trips) {
            next[trip.id] = trip.name ?? `Trip #${trip.id}`;
          }
          tripNames.value = next;
        }
      }

      if (inviterIds.length) {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .in('id', inviterIds);
        if (error) throw error;
        if (profiles?.length) {
          const next = { ...inviterProfiles.value };
          for (const profile of profiles) {
            next[profile.id] = profile;
          }
          inviterProfiles.value = next;
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error loading invitation details.');
    }
  };

  watch(
    () => props.data,
    (invites) => {
      void enrichInvites(invites ?? []);
    },
    { immediate: true, deep: true },
  );

  const removeInvite = (id: number) => {
    emits('update:data', props.data.filter(invite => invite.id !== id));
  };

  const respondToInvite = async (invite: Tables<'trip_friends'>, status: TripFriendStatus) => {
    try {
      actingId.value = invite.id;
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase
        .from('trip_friends')
        .update({
          status,
          accepted_invite_on: status === TripFriendStatus.ACCEPTED
            ? new Date().toISOString()
            : null,
        })
        .eq('id', invite.id);

      if (error) {
        $appStore.notifyNegative('There was an error updating the invitation.');
        return;
      }

      removeInvite(invite.id);
      $appStore.notifyPositive(
        status === TripFriendStatus.ACCEPTED
          ? 'Invitation accepted!'
          : 'Invitation declined.',
      );
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the invitation.');
    } finally {
      actingId.value = null;
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
        <p class="font-bold! text-base">
          Invitations <span class="font-normal text-muted-foreground">({{ pendingInvites.length || 0 }})</span>
        </p>
      </div>
      <div>
        <ul
          v-if="pendingInvites.length"
          class="divide-y divide-border">
          <li
            v-for="invite in pendingInvites"
            :key="invite.id"
            class="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
            <div class="flex items-start gap-3">
              <gc-avatar
                class="shrink-0"
                size="sm"
                :url="buildImageSrc(inviterProfiles[invite.invited_by_id]?.image)"
                :initials="initials(inviterProfiles[invite.invited_by_id])" />
              <div class="min-w-0">
                <typography class="font-semibold truncate">
                  {{ tripNames[invite.trip_id ?? 0] || (invite.trip_id ? `Trip #${invite.trip_id}` : 'Trip invitation') }}
                </typography>
                <typography
                  class="text-muted-foreground"
                  variant="small">
                  Invited by {{ friendlyUsername(inviterProfiles[invite.invited_by_id]) || 'a friend' }}
                </typography>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button-root
                class="flex-1"
                :disabled="actingId === invite.id"
                :loading="actingId === invite.id"
                size="sm"
                @click="respondToInvite(invite, TripFriendStatus.ACCEPTED)">
                Accept
              </button-root>
              <button-root
                class="flex-1"
                :disabled="actingId === invite.id"
                size="sm"
                variant="outline"
                @click="respondToInvite(invite, TripFriendStatus.DECLINED)">
                Decline
              </button-root>
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
