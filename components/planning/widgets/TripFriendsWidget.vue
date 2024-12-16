<script lang='ts' setup>
  const $store = usePlanningStore();
  const { data, pageLoading } = storeToRefs($store);

  const isInviteModalOpen = ref(false);
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="flex justify-start items-center py-4">
      <icon-users-round class="h-6 mr-6 text-primary w-6" />
      <p class="!font-bold text-base">
        Friends
      </p>
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !data.friends.length">
      <p class="mb-4 text-base">
        You haven't added any friends to this trip yet!
      </p>
      <button-root
        size="sm"
        variant="outline"
        @click="isInviteModalOpen = true">
        Invite Friends
      </button-root>
    </gc-empty-state>
    <div v-else>
      Display friends
    </div>
  </card>

  <!-- Invite Friends Modal -->
  <invite-friends-dialog
    :is-open="isInviteModalOpen"
    @on-close="isInviteModalOpen = false" />
</template>
