<template>
  <q-card
    id="friends-list"
    class="q-pa-xs widget box-shadow-light">
    <div v-if="props.loading">
      <FriendSkeleton />
    </div>
    <div v-else>
      <q-card-section class="header">
        <q-icon
          name="bi-people-fill"
          color="primary"
          size="sm" />
        <p class="text-body1 title q-ml-lg q-mb-none">
          Current Friends
        </p>
        <p
          v-if="friends?.length"
          class="text-subtitle2 count text-grey-6">
          <span class="text-weight-bolder">
            {{ friends?.length }}
          </span> Total Friend{{ friends?.length === 1 ? '' : 's' }}
        </p>
      </q-card-section>
      <q-card-section
        v-if="friends?.length && !loading"
        class="column friends-wrapper q-pt-none">
        <q-list>
          <FriendItem
            v-for="( friend, i ) in friends"
            :key="i"
            :friend="friend"
            @handle-remove="handleRemoveFriendDialog" />
        </q-list>
        <div class="row justify-end q-mt-md">
          <p class="text-subtitle2 count text-grey-6 q-mb-none">
            Displaying <span class="text-weight-bolder">{{ friends?.length }}</span> of <span class="text-weight-bolder">{{ friendCount }}</span>
          </p>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <q-item>
          <q-item-section class="text-center">
            <q-item-label>You haven't connected with any friends yet!</q-item-label>
            <q-item-label>Use the search bar above to get started finding friends.</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </div>
  </q-card>
  <AlertDialog
    :is-open="isAlertDialogOpen"
    title="Remove Friend"
    btn-text="Confirm"
    alert-color="negative"
    btn-color="red-9"
    has-cancel-btn
    :is-submitting="isSubmitting"
    @handle-close="isAlertDialogOpen = false"
    @handle-continue="handleRemoveFriend">
    <template #content>
      <p class="text-body1">
        Are you sure you want to remove this connection?
      </p>
      <p class="text-body1">
        This will <strong>permanently</strong> remove this connection. If you change your mind, you can add this user back by searching.
      </p>
    </template>
  </AlertDialog>
</template>

<script lang='ts' setup>
  import { defineAsyncComponent, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useFriendsStore } from '@/stores/friends';
  import FriendSkeleton from '@/components/planning/loading/FriendSkeleton.vue';
  import type { Friend } from '@/generated/types';
  import FriendItem from './Friend.vue';

  const AlertDialog = defineAsyncComponent(() => import('@/components/common/dialogs/AlertDialog.vue'));

  const $store = useFriendsStore();

  const { friends, friendCount } = storeToRefs($store);
  const isAlertDialogOpen = ref(false);
  const isSubmitting = ref(false);
  const selectedFriend = ref<Friend | null>(null);

  interface Props {
    loading: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
  });

  const handleRemoveFriendDialog = (friend: Friend): void => {
    console.log({ friend });
    selectedFriend.value = friend;
    isAlertDialogOpen.value = true;
  };

  const handleRemoveFriend = async (): Promise<void> => {
    if (selectedFriend?.value) {
      isSubmitting.value = true;
      await $store.removeFriend(selectedFriend.value.id as number);
      isSubmitting.value = false;
    }
    isAlertDialogOpen.value = false;
  };
</script>

<style lang='scss' scoped>
  @import "@/css/planning/aside";

  .header {
    align-items: center;
    display: grid;
    grid-template-columns: auto 1fr auto;

    .title {
      font-weight: 600;
    }
  }
</style>
