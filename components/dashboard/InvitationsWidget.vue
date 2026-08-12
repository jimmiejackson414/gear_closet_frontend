<script lang='ts' setup>
  import GcSkeleton from '@/components/common/GcSkeleton.vue';
  import type { Tables } from '@/types';

  interface Props {
    data: Tables<'trip_friends'>[];
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: () => [],
    loading: true,
  });
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
          Invitations <span class="font-normal text-muted-foreground">({{ data.length || 0 }})</span>
        </p>
      </div>
      <div>
        <ul
          v-if="data.length"
          class="divide-grey divide-y">
          <li
            v-for="invite in data"
            :key="invite.id">
            <!-- TODO -->
            Invite: {{ invite.id }}
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
