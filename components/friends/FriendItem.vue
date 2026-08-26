<script lang='ts' setup>
  import { sharedTripSubtitle } from '@/utils/friendsPage';
  import type { ExtendedFriend } from '@/types/planning';

  interface Props {
    friend: ExtendedFriend;
    sharedTripCount?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    sharedTripCount: undefined,
  });
  const emits = defineEmits<{
    removed: [friendshipId: number];
  }>();

  const showRemoveDialog = ref(false);

  const subtitle = computed(() =>
    props.sharedTripCount == null ? undefined : sharedTripSubtitle(props.sharedTripCount));

  const handleRemoved = (friendshipId: number) => {
    emits('removed', friendshipId);
  };
</script>

<template>
  <div>
    <friend-row
      :image="friend.friend.image"
      :initials="initials(friend.friend)"
      :subtitle="subtitle"
      :title="friendlyUsername(friend.friend, { includeTrailName: true })">
      <button-root
        aria-label="Remove friend"
        size="sm"
        variant="ghost"
        @click="showRemoveDialog = true">
        Remove
      </button-root>
    </friend-row>
    <remove-friend-dialog
      :friend="friend"
      :is-open="showRemoveDialog"
      @close="showRemoveDialog = false"
      @removed="handleRemoved" />
  </div>
</template>
