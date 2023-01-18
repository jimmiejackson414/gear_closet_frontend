<template>
  <q-dialog
    :model-value="props.isOpen"
    class="invite-friend-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-form @submit.prevent.stop="handleInvite">
        <q-card-section class="header">
          <div class="row justify-between align-center">
            <h6 class="text-h6 q-ma-none">
              Invite a Friend
            </h6>
            <q-icon name="bi-info-circle-fill">
              <q-tooltip class="text-center">
                Invite existing friends to join your Trip.
              </q-tooltip>
            </q-icon>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 q-col-gutter-sm">
              <q-select
                v-model="selectedFriends"
                :options="friends"
                :loading="loadingFriends"
                use-input
                use-chips
                input-debounce="300"
                multiple
                label="Search Friends"
                dense
                clear-icon="bi-x"
                dropdown-icon="bi-chevron-down"
                clearable
                outlined
                @filter="fetchOptions">
                <template #prepend>
                  <q-icon name="bi-geo-alt" />
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results. Please visit the Friends page to add new friends!
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-between">
          <q-btn
            unelevated
            :ripple="false"
            flat
            text-color="text"
            label="Cancel"
            :disable="isSubmitting"
            @click="emit('handleClose')" />
          <q-btn
            :ripple="false"
            color="primary"
            label="Invite"
            :disable="isSubmitting"
            type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { ref, watchEffect } from 'vue';
  import { usePlanningStore } from '@/stores/planning';
  import { friendlyUsername } from '@/helpers/functions';

  interface FriendOption {
    label: string;
    value: string;
  }

  interface Props {
    isOpen: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
  });

  const emit = defineEmits(['handleClose', 'handleSubmit']);

  const $store = usePlanningStore();

  const isSubmitting = ref(false);
  const loadingFriends = ref(false);
  const selectedFriends = ref<FriendOption[]>([]);
  const friends = ref<FriendOption[]>([]);

  const handleInvite = (): void => {
    isSubmitting.value = true;
    emit('handleSubmit', selectedFriends.value.map(friend => friend.value));
    isSubmitting.value = false;
  };

  const fetchOptions = async (val: string, update: any): Promise<void> => {
    loadingFriends.value = true;
    const response = await $store.fetchFriends();
    loadingFriends.value = false;

    if (response.friends) {
      if (val === '') {
        friends.value = response.friends.map(f => ({
          label: friendlyUsername(f?.user),
          value: f?.user?.id || '',
        }));

        update();
        return;
      }

      const needle = val.toLowerCase();
      friends.value = response.friends.filter(f => friendlyUsername(f?.user)
        ?.toLowerCase()
        .includes(needle))
        .map(f => ({
          label: friendlyUsername(f?.user),
          value: f?.user?.id || '',
        }));

      update();
    }
    loadingFriends.value = false;
  };

  watchEffect(() => {
    if (!props.isOpen) {
      selectedFriends.value = [];
    }
  });
</script>

<style lang='scss' scoped>
  .invite-friend-dialog {
    .q-card {
      border-top: 5px solid $primary;
      min-width: 300px;
    }
  }
</style>
