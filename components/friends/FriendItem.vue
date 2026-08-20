<script lang='ts' setup>
  import type { ExtendedFriend } from '@/types/planning';

  interface Props {
    friend: ExtendedFriend;
  }

  defineProps<Props>();
  const emits = defineEmits<{
    removed: [friendshipId: number];
  }>();

  const showRemoveDialog = ref(false);

  const handleRemoved = (friendshipId: number) => {
    emits('removed', friendshipId);
  };
</script>

<template>
  <card class="duration-200 ease-out flex justify-center items-center flex-col max-w-50 my-4 px-8 py-4 rounded-3xl shadow-xs hover:shadow-md transition w-full min-w-0">
    <gc-avatar
      :initials="initials(friend.friend)"
      size="xl"
      :url="friend.friend.image" />
    <div class="flex items-center flex-col mt-4 gap-2">
      <typography class="font-bold text-center">
        {{ friendlyUsername(friend.friend, { includeTrailName: true }) }}
      </typography>
      <button-root
        aria-label="Remove friend"
        size="sm"
        variant="ghost"
        @click="showRemoveDialog = true">
        Remove
      </button-root>
    </div>
    <remove-friend-dialog
      :friend="friend"
      :is-open="showRemoveDialog"
      @close="showRemoveDialog = false"
      @removed="handleRemoved" />
  </card>
</template>
