<template>
  <q-card class="q-pa-xs widget box-shadow-light">
    <FriendSkeleton v-if="loading" />
    <div v-else>
      <q-card-section class="header q-mb-xs q-py-sm">
        <q-icon
          class="q-mr-md"
          name="bi-people-fill"
          color="primary"
          size="sm" />
        <p class="text-body1 title q-mb-none">
          Friends
        </p>
        <router-link
          to="/friends"
          class="text-caption self-center q-ml-auto">
          View All
        </router-link>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="row items-center">
        <div
          v-if="friends.length"
          class="friends-row">
          <q-item
            v-for="(friend, i) in friends.slice(0, 4)"
            :key="i">
            <q-item-section side>
              <AvatarDefault
                :user="(friend.user as User)"
                size="40px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ friendlyUsername(friend.user) }}</q-item-label>
              <q-item-label
                v-if="friend.user?.trail_name"
                caption>
                "{{ friend.user.trail_name }}"
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <p
          v-else
          class="text-body1">
          You haven't added any friends yet!
        </p>
        <p
          v-if="friends.length > 5"
          class="text-body2 text-grey5 q-ml-lg q-mb-none text-weight-bold">
          + {{ calculateAdditionalFriends }}
        </p>
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang='ts' setup>
  import { computed } from 'vue';
  import { friendlyUsername } from '@/helpers/functions';
  import { User } from '@/generated/types';
  import type { DashboardData, Friend } from '@/generated/types';
  import FriendSkeleton from '@/components/planning/loading/FriendSkeleton.vue';
  import AvatarDefault from '@/components/common/AvatarDefault.vue';

  const props = defineProps<{
    data: DashboardData;
    loading: boolean;
  }>();

  const friends = computed(() => props.data.friends as Friend[]);

  const calculateAdditionalFriends = computed(() => {
    const isPlural = friends.value.length > 1;
    return `${friends.value.length - 5} ${isPlural ? 'others' : 'other'}`;
  });
</script>

<style lang='scss' scoped>
  @import "@/css/planning/main";

  .header {
    align-items: center;
    justify-content: flex-start !important;
  }

  .friends-row {
    align-items: center;
    display: grid;
    grid-template-columns: repeat(auto-fit, 40px) 1fr;
  }
</style>
