<template>
  <MainLayout>
    <div class="row q-mt-lg">
      <div class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
        <div class="row align-center justify-between">
          <h5 class="text-h5 q-my-sm">
            Notifications
          </h5>
          <q-btn
            class="mark-as-read text-primary text-no-wrap pointer"
            flat
            :ripple="false"
            @click="markAllAsRead">
            Mark all as read
          </q-btn>
        </div>
        <q-separator />
        <div class="content-wrapper">
          <div
            class="notifications">
            <q-list padding>
              <div v-if="notifications.length">
                <NotificationItem
                  v-for="notification in notifications"
                  :key="notification.id"
                  :notification="notification"
                  placement="page"
                  @mark-as-read="markAsRead"
                  @mark-as-unread="markAsUnread" />
              </div>
              <q-item v-else>
                No notifications!
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="row justify-center">
          <q-btn
            v-if="!totalCount || totalCount > notifications.length"
            flat
            :ripple="false"
            :loading="loadingMore"
            color="primary"
            @click="fetchNotifications">
            Fetch Older
          </q-btn>
        </div>
        <q-separator spaced="lg" />
        <div class="row">
          <p class="text-body1 text-grey-8">
            Displaying <span class="text-weight-bold">{{ displayingNum }}</span> out of <span class="text-weight-bold">{{ totalCount }}</span>
          </p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script lang='ts' setup>
  import { ref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import MainLayout from '@/layouts/MainLayout.vue';
  import NotificationItem from '@/components/common/NotificationItem.vue';
  import { Notification } from '@/generated/types';
  import { useUserStore } from '@/stores/user';
  import { getPagination } from '@/helpers/functions';

  // instantiate libs and store
  const user = useUserStore();

  // local state
  const { currentUser, notifications, totalCount } = storeToRefs(user);
  const loadingMore = ref(false);
  const page = ref(1);
  const pageSize = ref(5);

  const displayingNum = computed(() => {
    const num = page.value * pageSize.value;
    return num < totalCount?.value ? num : totalCount;
  });

  // call for user notifications on page load
  const fetchNotifications = async (): Promise<void> => {
    loadingMore.value = true;
    const { to, from } = getPagination(page.value, pageSize.value);
    await user.fetchNotifications({ user_id: currentUser.value?.id as string, from, to });
    page.value += 1;
    loadingMore.value = false;
  };

  // mark all notifications as read
  const markAllAsRead = (): void => user.markAllAsRead();

  // mark a notification as read
  const markAsRead = async (notification: Notification): Promise<void> => {
    const payload = {
      id: notification.id,
      read_on_date: new Date()
        .toISOString(),
    };
    user.updateNotification(payload);
  };

  // mark a notification as unread
  const markAsUnread = async (notification: Notification): Promise<void> => {
    const payload = { id: notification.id, read_on_date: null };
    user.updateNotification(payload);
  };
</script>

<style lang='scss' scoped>
  .content-wrapper {
    .loading {
      display: flex;
      margin-top: 2rem;
      justify-content: center;
    }
  }
</style>
