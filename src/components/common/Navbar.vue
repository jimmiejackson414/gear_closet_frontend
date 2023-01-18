<template>
  <nav class="header items-start container container-xl">
    <div class="page-title">
      <h6 class="text-h6 q-ma-none">
        <span class="emoji">&#128075;</span>
        {{ welcomeMessage }}
      </h6>
      <h1 class="text-h3 q-mt-sm q-mb-none">
        {{ pageTitle }}
      </h1>
    </div>
    <q-space />
    <q-btn
      round
      :ripple="false"
      class="box-shadow"
      icon="bi-bell">
      <q-badge
        v-if="shouldShowBadge"
        color="red"
        rounded
        floating>
        {{ $userStore.totalUnread }}
      </q-badge>
      <q-menu
        :offset="[0, 20]"
        max-width="500px">
        <q-list padding>
          <q-item class="items-center justify-between">
            <q-item-label class="text-uppercase text-grey-7 title">
              Notifications
            </q-item-label>
            <q-btn
              flat
              :ripple="false"
              class="mark-as-read text-primary text-no-wrap pointer"
              @click="markAllAsRead">
              Mark all as read
            </q-btn>
          </q-item>
          <q-separator inset />
          <span
            v-if="notifications?.length"
            class="notifications-wrapper">
            <NotificationItem
              v-for="notification in notifications.slice(0, 5)"
              :key="notification.id"
              :notification="notification"
              placement="navbar"
              @mark-as-read="markAsRead"
              @mark-as-unread="markAsUnread" />
          </span>
          <q-item v-else>
            No notifications
          </q-item>
          <div class="view-all-wrapper q-py-sm">
            <q-btn
              to="/notifications"
              flat
              :ripple="false"
              class="text-primary">
              View all notifications
            </q-btn>
          </div>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn
      flat
      round
      dense
      :ripple="false"
      icon="bi-list"
      class="q-ml-md lt-sm"
      @click="$appStore.toggleDrawer()" />
  </nav>
</template>

<script lang='ts' setup>
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/stores/app';
  import { useUserStore } from '@/stores/user';
  import type { Notification } from '@/generated/types';
  import NotificationItem from '@/components/common/NotificationItem.vue';

  defineProps({
    pageTitle: { type: String, required: true, default: '' },
  });

  // instantiate store and libs
  const $appStore = useAppStore();
  const $userStore = useUserStore();

  const { notifications, currentUser } = storeToRefs($userStore);

  const shouldShowBadge = computed(() => $userStore.totalUnread > 0 && notifications.value.some(n => !n.read_on_date));

  const welcomeMessage = computed(() => {
    if (currentUser.value?.first_name) {
      const arr = ['Hello', 'Welcome', 'Hey'];
      const rand = Math.floor(Math.random() * arr.length);
      return `${arr[rand]}, ${currentUser.value.first_name}!`;
    }
    return 'Welcome!';
  });

  const markAllAsRead = (): void => { $userStore.markAllAsRead(); };

  const markAsRead = (notification: Notification): void => {
    const payload = {
      id: notification.id,
      read_on_date: new Date()
        .toISOString(),
    };
    $userStore.updateNotification(payload);
  };

  const markAsUnread = (notification: Notification): void => {
    const payload = { id: notification.id, read_on_date: null };
    $userStore.updateNotification(payload);
  };
</script>

<style lang="scss" scoped>
  .header {
    z-index: 2000;
    padding: 0;
    display: flex;

    .page-title {
      .emoji {
        margin-right: 0.5rem;
      }
    }
  }

  .q-list {
    .title {
      margin-right: 4rem;
    }

    .notifications-wrapper {
      background: red;

      .q-item {
        margin: 0;

        .q-btn {
          padding: 4px;
        }
      }
    }
  }
</style>
