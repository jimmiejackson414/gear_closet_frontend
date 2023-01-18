<template>
  <q-card class="q-pa-xs widget box-shadow-light">
    <UpcomingLoading v-if="loading" />
    <div v-else>
      <q-card-section class="header q-mb-xs q-py-sm">
        <q-icon
          class="q-mr-md"
          name="bi-calendar2-event-fill"
          color="primary"
          size="sm" />
        <p class="text-body1 title q-mb-none">
          Invitations <span class="text-grey-6 text-weight-regular">({{ data.invitations.length }})</span>
        </p>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="row invitations-wrapper">
        <q-list
          v-if="invitations?.length"
          class="full-width">
          <q-item
            v-for="invite in invitations"
            :key="invite.id">
            <q-item-section class="q-mr-md text-weight-bold">
              <q-item-label class="text-body1 q-mb-none">
                {{ invite.trip!.name }} - <span class="text-grey-6 text-subtitle1">Invited by {{ formatInviterName(invite.trip!.user) }}</span>
              </q-item-label>
            </q-item-section>
            <SlideUpTransition>
              <q-item-section
                v-if="currentStatus('PENDING', invite)"
                side
                class="flex actions self-center">
                <q-btn
                  size="sm"
                  color="negative"
                  label="Decline"
                  :loading="loadingAction"
                  @click="handleDecline(invite)" />
                <q-btn
                  size="sm"
                  color="secondary"
                  label="Accept"
                  :loading="loadingAction"
                  @click="handleAccept(invite)" />
              </q-item-section>
              <q-item-section v-else-if="currentStatus('DECLINED', invite) || currentStatus('ACCEPTED', invite)">
                <q-item-label class="text-body1 q-mb-none text-right secondary-actions">
                  <span class="text-grey-6 text-subtitle1">
                    {{ currentStatus('DECLINED', invite) ? 'Declined' : 'Accepted' }}
                  </span>
                  <q-btn
                    class="text-primary text-subtitle1 q-ml-sm"
                    flat
                    size="sm"
                    @click="handleUndo(invite)">
                    Undo
                  </q-btn>
                </q-item-label>
              </q-item-section>
            </SlideUpTransition>
          </q-item>
        </q-list>
        <p
          v-else
          class="text-body1">
          You don't currently have any pending invitations.
        </p>
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang='ts' setup>
  import { computed, ref } from 'vue';
  import type { DashboardData, TripFriend } from '@/generated/types';
  import { friendlyUsername } from '@/helpers/functions';
  import { useUserStore } from '@/stores/user';
  import SlideUpTransition from '@/components/transitions/SlideUpTransition.vue';
  import UpcomingLoading from './loading/UpcomingLoading.vue';

  const props = defineProps<{
    data: DashboardData;
    loading: boolean;
  }>();

  const emit = defineEmits(['handle-update-invite']);

  const $store = useUserStore();

  const loadingAction = ref(false);

  const invitations = computed(() => props.data.invitations as TripFriend[]);

  const formatInviterName = (user: TripFriend['user']): string => friendlyUsername(user);

  const currentStatus = (status: 'PENDING' | 'ACCEPTED' | 'DECLINED', invite: TripFriend): boolean => invite.status === status;

  const handleDecline = async (invite: TripFriend): Promise<void> => {
    loadingAction.value = true;
    const { tripFriend } = await $store.handleDeclineInvite(invite.id);
    emit('handle-update-invite', tripFriend);
    loadingAction.value = false;
  };

  const handleAccept = async (invite: TripFriend): Promise<void> => {
    loadingAction.value = true;
    const { tripFriend } = await $store.handleAcceptInvite(invite.id);
    emit('handle-update-invite', tripFriend);
    loadingAction.value = false;
  };

  const handleUndo = async (invite: TripFriend): Promise<void> => {
    loadingAction.value = true;
    const { tripFriend } = await $store.handleUndoInvite(invite);
    emit('handle-update-invite', tripFriend);
    loadingAction.value = false;
  };
</script>

<style lang='scss' scoped>
  @import "@/css/planning/main";

  .header {
    align-items: center;
    justify-content: flex-start !important;
  }

  .invitations-wrapper {
    .q-item {
      border-radius: 1rem;

      .actions {
        align-items: center;
        flex-direction: row;

        button:first-of-type {
          margin-right: 1rem;
        }
      }
    }

    .secondary-actions {
      align-items: center;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
