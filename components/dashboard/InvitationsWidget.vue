<script lang='ts' setup>
  import { TripFriendStatus } from '@/types';
  import type { Database } from '@/types';
  import type { DashboardTripInvite } from '@/types/planning';

  interface Props {
    data?: DashboardTripInvite[];
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    loading: true,
  });

  const emits = defineEmits<{
    (event: 'update:data', value: DashboardTripInvite[]): void;
  }>();

  const $appStore = useAppStore();
  const actingId = ref<number | null>(null);

  const pendingInvites = computed(() =>
    props.data.filter(invite => invite.status === TripFriendStatus.PENDING),
  );

  const tripLabel = (invite: DashboardTripInvite) =>
    invite.trip_name
    || (invite.trip_id ? `Trip #${invite.trip_id}` : 'Trip invitation');

  const removeInvite = (id: number) => {
    emits('update:data', props.data.filter(invite => invite.id !== id));
  };

  const respondToInvite = async (invite: DashboardTripInvite, status: TripFriendStatus) => {
    try {
      actingId.value = invite.id;
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase
        .from('trip_friends')
        .update({
          status,
          accepted_invite_on: status === TripFriendStatus.ACCEPTED
            ? new Date()
              .toISOString()
            : null,
        })
        .eq('id', invite.id);

      if (error) {
        $appStore.notifyNegative('There was an error updating the invitation.');
        return;
      }

      removeInvite(invite.id);
      if (status === TripFriendStatus.ACCEPTED && invite.trip_id) {
        $appStore.notifyPositive('Invitation accepted! Opening trip…');
        await navigateTo({
          name: 'planning',
          query: { trip: encrypt(invite.trip_id) },
        });
        return;
      }
      $appStore.notifyPositive('Invitation declined.');
    } catch {
      $appStore.notifyNegative('There was an error updating the invitation.');
    } finally {
      actingId.value = null;
    }
  };
</script>

<template>
  <card
    class="p-4 rounded-3xl h-full"
    data-testid="invitations-widget">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="flex justify-start items-center mb-4 py-4">
        <icon-calendar-check class="mr-6 w-6 h-6 text-primary dark:text-primary-foreground" />
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
                :initials="initials(invite.inviter_profile)"
                size="sm"
                :url="buildImageSrc(invite.inviter_profile?.image)" />
              <div class="min-w-0">
                <typography class="font-semibold truncate">
                  {{ tripLabel(invite) }}
                </typography>
                <typography
                  class="text-muted-foreground"
                  variant="small">
                  Invited by {{ invite.inviter_profile ? friendlyUsername(invite.inviter_profile) : 'a friend' }}
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
