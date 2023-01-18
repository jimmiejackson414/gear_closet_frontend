<template>
  <q-item>
    <q-item-section avatar>
      <AvatarDefault
        :user="(props.friend.user as User)"
        size="40px" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ friendlyUsername(friend.user) }}</q-item-label>
      <q-item-label
        caption
        class="text-italic"
        lines="1">
        {{ friendStatus }}
      </q-item-label>
    </q-item-section>
    <q-item-section
      side
      class="actions">
      <q-btn-dropdown
        unelevated
        color="primary"
        size="sm"
        :ripple="false"
        dropdown-icon="bi-caret-down"
        label="Actions">
        <q-list>
          <q-item
            v-close-popup
            clickable
            @click="handleRemoveFriend">
            <q-item-section>
              <q-item-label>Remove Connection</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-item-section>
  </q-item>
</template>

<script lang='ts' setup>
  import { computed } from 'vue';
  import { Friend, User } from '@/generated/types';
  import { friendlyUsername } from '@/helpers/functions';
  import AvatarDefault from '@/components/common/AvatarDefault.vue';

  interface Props {
    friend: Friend;
  }

  const props = defineProps<Props>();

  const emit = defineEmits(['handleRemove']);

  const friendStatus = computed(() => {
    if (props.friend.invite_accepted_on) {
      const d = new Date(props.friend.invite_accepted_on);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      return `Connected since ${d.toLocaleDateString('en-US', options)}`;
    }
    return 'Pending';
  });

  const handleRemoveFriend = (): void => {
    emit('handleRemove', props.friend);
  };
</script>
