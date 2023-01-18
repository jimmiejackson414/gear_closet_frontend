<template>
  <MainLayout>
    <div class="row">
      <div class="col-12 col-md-10 offset-md-1">
        <q-card class="box-shadow-light">
          <div class="row content-wrapper">
            <div class="col-12 q-px-lg q-py-xl">
              <div class="top">
                <div class="avatar">
                  <AvatarUpload
                    :file="currentUser?.image"
                    @handle-add-file="handleAddAvatar"
                    @handle-error="handleAvatarError"
                    @handle-remove-file="handleRemoveAvatar" />
                  <p
                    v-if="uploadError"
                    class="text-body1 text-negative text-center">
                    An error occurred uploading your new avatar
                  </p>
                </div>
                <div class="details-wrapper">
                  <h4 class="text-h4 text-primary">
                    {{ currentUser?.trail_name }}
                  </h4>
                  <p class="text-body1">
                    {{ currentUser?.first_name }} {{ currentUser?.last_name }}
                  </p>
                  <SubscriptionPill :plan="currentUser?.subscription_level" />
                </div>
              </div>
              <q-splitter
                v-model="splitterModel"
                :horizontal="!isDesktop">
                <template #before>
                  <q-tabs
                    v-model="tab"
                    :vertical="isDesktop">
                    <q-tab
                      :ripple="false"
                      name="info"
                      icon="bi-info"
                      label="Info" />
                    <q-tab
                      :ripple="false"
                      name="subscription"
                      icon="bi-person-badge"
                      label="Subscription" />
                    <q-tab
                      :ripple="false"
                      name="settings"
                      icon="bi-gear"
                      label="Settings" />
                  </q-tabs>
                </template>
                <template #after>
                  <q-tab-panels
                    v-model="tab"
                    keep-alive
                    animated
                    swipeable
                    transition-prev="jump-up"
                    tranasition-next="jump-up">
                    <q-tab-panel name="info">
                      <InfoTab :current-user="currentUser" />
                    </q-tab-panel>
                    <q-tab-panel name="subscription">
                      <SubscriptionTab :current-user="currentUser" />
                    </q-tab-panel>
                    <q-tab-panel name="settings">
                      <SettingsTab :current-user="currentUser" />
                    </q-tab-panel>
                  </q-tab-panels>
                </template>
              </q-splitter>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </MainLayout>
</template>

<script lang='ts' setup>
  import { computed, ref } from 'vue';
  import { useMeta, useQuasar } from 'quasar';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';
  import MainLayout from '@/layouts/MainLayout.vue';
  import InfoTab from '@/components/profile/InfoTab.vue';
  import SubscriptionTab from '@/components/profile/SubscriptionTab.vue';
  import SettingsTab from '@/components/profile/SettingsTab.vue';
  import AvatarUpload from '@/components/common/AvatarUpload.vue';
  import SubscriptionPill from '@/components/common/SubscriptionPill.vue';

  // metadata
  const metaData = {
    title: 'Profile | Gear Closet',
  };
  useMeta(metaData);

  // instantiate store and composable
  const user = useUserStore();
  const $q = useQuasar();

  const { currentUser } = storeToRefs(user);

  // local state
  const splitterModel = ref(15);
  const tab = ref('info');
  const uploadError = ref<boolean>(false);

  const isDesktop = computed(() => $q.platform.is.desktop);

  const handleAddAvatar = async (file: any): Promise<void> => {
    uploadError.value = false;
    const dataURL = file.getFileEncodeDataURL();
    const payload = { id: currentUser.value?.id as string, file: dataURL };
    await user.updateAvatar(payload);
  };

  const handleRemoveAvatar = async (): Promise<void> => {
    uploadError.value = false;
    const payload = { id: currentUser.value?.id as string, file: null };
    await user.updateAvatar(payload);
  };

  const handleAvatarError = (): void => {
    uploadError.value = true;
  };
</script>

<style lang="scss" scoped>
  .content-wrapper {
    .top {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 5%;
      justify-content: center;
      padding: 0;
      margin-bottom: 2rem;

      @media (min-width: $breakpoint-md-min) {
        grid-template-columns: 40% 1fr;
        grid-gap: 4rem;
        padding: 0 4rem;
      }

      .details-wrapper {
        text-align: center;

        h4 {
          margin-bottom: 1rem;
        }
      }
    }

    .q-tab {
      &:hover {
        border-radius: 1rem 0 0 1rem;
      }
    }

    .q-tab-panels {
      border-radius: 0 1rem 1rem 0;
    }
  }
</style>
