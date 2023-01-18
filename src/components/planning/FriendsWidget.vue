<template>
  <q-card
    id="friends-widget"
    class="widget box-shadow-light aside">
    <div v-if="loading">
      <FriendSkeleton
        v-for="i in [0, 1, 2]"
        :key="`friends-${i}`" />
    </div>
    <div v-else>
      <q-card-section class="header">
        <q-icon
          name="bi-people-fill"
          color="primary"
          size="sm" />
        <p class="text-body1 title">
          Friends <span class="text-grey-6 text-weight-regular">({{ friends.length }})</span>
        </p>
        <q-btn
          round
          color="primary"
          size="sm"
          unelevated
          :ripple="false"
          icon="bi-plus-lg"
          @click="isInviteFriendsDialogOpen = true" />
      </q-card-section>
      <q-list
        v-if="friends?.length"
        class="q-py-md">
        <q-item
          v-for="tripFriend in friends"
          :key="tripFriend.id">
          <q-item-section avatar>
            <AvatarDefault
              :user="(tripFriend?.user as User)"
              size="40px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ friendlyUsername(tripFriend.user) }}</q-item-label>
            <q-item-label caption>
              {{ tripFriend?.user?.email }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            class="status">
            <q-item-label v-if="tripFriend.pack">
              <q-btn
                size="sm"
                unelevated
                color="primary"
                label="View Pack"
                :to="`/p/packs/${tripFriend.pack.slug}`"
                :ripple="false" />
            </q-item-label>
            <q-item-label v-else>
              <p class="text-subtitle2 text-grey text-capitalize">
                {{ tripFriend.status?.toLowerCase() }}
              </p>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list v-else>
        <q-item>
          <q-item-section class="text-center">
            <q-item-label>You haven't invited any friends to this trip yet!</q-item-label>
            <q-item-label>Click the <b>Add</b> button to get started.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <InviteFriendToTripDialog
      :is-open="isInviteFriendsDialogOpen"
      @handle-submit="handleAddFriends"
      @handle-close="isInviteFriendsDialogOpen = false" />
  </q-card>
</template>

<script lang='ts' setup>
  import { ref, defineAsyncComponent } from 'vue';
  import { storeToRefs } from 'pinia';
  import { usePlanningStore } from '@/stores/planning';
  import { friendlyUsername } from '@/helpers/functions';
  import { User } from '@/generated/types';
  import AvatarDefault from '@/components/common/AvatarDefault.vue';
  import FriendSkeleton from './loading/FriendSkeleton.vue';

  const InviteFriendToTripDialog = defineAsyncComponent(() => import('@/components/planning/dialogs/InviteFriendToTripDialog.vue'));

  const $store = usePlanningStore();
  const { loading, friends } = storeToRefs($store);
  const isInviteFriendsDialogOpen = ref(false);

  const handleAddFriends = async (f: string[]): Promise<void> => {
    const input = { tripId: $store.selectedTrip?.id as number, friends: f };
    await $store.addFriends(input);
    isInviteFriendsDialogOpen.value = false;
  };
</script>

<style lang='scss' scoped>
  @import "@/css/planning/aside";
</style>
