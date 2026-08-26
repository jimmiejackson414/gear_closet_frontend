<script lang='ts' setup>
  import type { Tables } from '@/types';

  interface Props {
    profile: Tables<'profiles'>;
    requestPending: boolean;
  }

  const props = defineProps<Props>();

  const $appStore = useAppStore();
  const submitting = ref(false);
  const submittedRequest = ref(props.requestPending);

  watch(
    () => props.requestPending,
    (pending) => {
      submittedRequest.value = pending;
    },
  );

  const handleAddFriend = async () => {
    const email = props.profile.email?.trim()
      .toLowerCase();
    if (!email || submitting.value) return;

    try {
      submitting.value = true;
      await $fetch('/api/friends/invites', {
        body: { email },
        method: 'POST',
      });
      submittedRequest.value = true;
    } catch {
      $appStore.notifyNegative('An error occurred while adding the friend.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <friend-row
    :image="profile.image"
    :initials="initials(profile)"
    :title="friendlyUsername(profile)">
    <button-root
      v-if="!submittedRequest"
      :disabled="submitting || !profile.email"
      :loading="submitting"
      size="sm"
      @click="handleAddFriend">
      Add Friend
    </button-root>
    <typography
      v-else
      class="text-muted-foreground text-xs italic">
      Invite requested
    </typography>
  </friend-row>
</template>
