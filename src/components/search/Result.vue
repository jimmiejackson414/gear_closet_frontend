<template>
  <q-item>
    <q-item-section avatar>
      <AvatarDefault
        :user="props.result"
        size="60px" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        {{ friendlyUsername(props.result, { includeTrailName: true } ) }}
      </q-item-label>
      <q-item-label
        caption
        lines="1">
        {{ formattedLocation }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-subtitle2 q-mb-none">
        {{ formattedCounts }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn-dropdown
        v-if="friendStatus.status !== 'not_friend'"
        :flat="friendStatus.status === 'pending'"
        :unelevated="friendStatus.status === 'friend'"
        :ripple="false"
        :loading="props.loading"
        :color="friendStatus.btnColor"
        :label="friendStatus.btnText"
        dropdown-icon="bi-caret-down"
        size="sm">
        <q-list>
          <q-item
            v-close-popup
            clickable
            @click="handleRemoveInvitation">
            <q-item-section>
              <q-item-label>Remove {{ friendStatus.status === 'pending' ? 'Invitation' : 'Connection' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn
        v-else
        unelevated
        size="sm"
        color="secondary"
        :ripple="false"
        :loading="props.loading"
        label="Connect"
        @click="handleInvitation" />
    </q-item-section>
  </q-item>
</template>

<script lang='ts' setup>
  import {
    computed, reactive, watchEffect,
  } from 'vue';
  import { User } from '@/generated/types';
  import AvatarDefault from '@/components/common/AvatarDefault.vue';
  import { friendlyUsername } from '@/helpers/functions';

  interface Props {
    result: User;
    loading: boolean;
  }

  type FriendStatus = 'friend' | 'pending' | 'not_friend';

  const props = defineProps<Props>();

  const emit = defineEmits(['addConnection', 'removeInvitation']);

  const friendStatus = reactive({
    status: 'not_friend' as FriendStatus,
    btnColor: 'primary',
    btnText: 'Not Friend',
  });

  const formattedCounts = computed(() => {
    const trips = props.result.tripsCount || 0;
    const packs = props.result.packsCount || 0;
    return `${trips} trips // ${packs} packs`;
  });

  const formattedLocation = computed(() => {
    if (props.result.location) {
      const loc = JSON.parse(props.result.location);
      return loc.label;
    }
    return '';
  });

  const handleInvitation = (): void => {
    emit('addConnection', props.result);
  };

  const handleRemoveInvitation = (): void => {
    emit('removeInvitation', props.result);
  };

  watchEffect(() => {
    if (props.result.friend) {
      if (props.result.friend.invite_accepted_on) {
        friendStatus.status = 'friend';
        friendStatus.btnColor = 'primary';
        friendStatus.btnText = 'Connected';
      } else {
        friendStatus.status = 'pending';
        friendStatus.btnColor = 'grey-7';
        friendStatus.btnText = 'Pending';
      }
    } else {
      friendStatus.status = 'not_friend';
      friendStatus.btnColor = 'primary';
      friendStatus.btnText = 'Add Friend';
    }
  });
</script>
