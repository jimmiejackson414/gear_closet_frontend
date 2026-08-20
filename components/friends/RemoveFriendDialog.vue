<script lang='ts' setup>
  import type { Database } from '@/types';
  import type { ExtendedFriend } from '@/types/planning';

  interface Props {
    friend: ExtendedFriend | null;
    isOpen: boolean;
  }

  const props = defineProps<Props>();
  const emits = defineEmits<{
    close: [];
    removed: [friendshipId: number];
  }>();

  const $appStore = useAppStore();
  const submitting = ref(false);

  const handleRemove = async () => {
    if (!props.friend) return;

    submitting.value = true;
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const myId = user.value?.sub;
      const friendId = props.friend.friend_id;

      if (!myId) throw new Error();

      const { error: ownRowError } = await supabase
        .from('friends')
        .delete()
        .eq('profile_id', myId)
        .eq('friend_id', friendId);

      if (ownRowError) throw ownRowError;

      const { error: reciprocalRowError } = await supabase
        .from('friends')
        .delete()
        .eq('profile_id', friendId)
        .eq('friend_id', myId);

      if (reciprocalRowError) throw reciprocalRowError;

      $appStore.notifyPositive('Friend removed.');
      emits('removed', props.friend.id);
      emits('close');
    } catch {
      $appStore.notifyNegative('An error occurred while removing the friend.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <alert-dialog :open="isOpen">
    <alert-dialog-content>
      <alert-dialog-header>
        <alert-dialog-title>
          Remove {{ friendlyUsername(friend?.friend, { includeTrailName: true }) }}?
        </alert-dialog-title>
        <alert-dialog-description>
          They will be removed from your friends list. You can send a new friend request later if you change your mind.
        </alert-dialog-description>
      </alert-dialog-header>
      <alert-dialog-footer class="justify-between">
        <alert-dialog-cancel
          :disabled="submitting"
          @click="emits('close')">
          Cancel
        </alert-dialog-cancel>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          variant="destructive"
          @click="handleRemove">
          Remove Friend
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>
