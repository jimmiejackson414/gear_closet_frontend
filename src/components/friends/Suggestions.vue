<template>
  <q-card
    id="friend-suggestions"
    class="q-pa-xs widget box-shadow-light aside">
    <div v-if="loading">
      <FriendSkeleton
        v-for="i in [0, 1, 2]"
        :key="`friend-${i}`" />
    </div>
    <div v-else>
      <q-card-section class="header q-pb-none">
        <q-icon
          name="bi-person-plus-fill"
          color="primary"
          size="sm" />
        <p class="text-body1 title">
          Connect
        </p>
      </q-card-section>
      <q-card-section>
        <q-item class="q-px-none justify-center">
          <q-item-section class="full-width">
            <v-facebook-login
              class="fb-login-btn"
              :app-id="fbAppId"
              :login-options="{ scope: 'email,user_friends' }"
              @login="isConnected = true"
              @sdk-init="handleFacebookSdkInit">
              <template #login>
                <p class="text-subtitle2 q-mb-none">
                  Connect
                </p>
              </template>
              <template #logout>
                <p class="text-subtitle2 q-mb-none">
                  Disconnect
                </p>
              </template>
            </v-facebook-login>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section v-if="isConnected">
        <p class="text-subtitle2 text-weight-bold q-mb-none">
          Suggested
        </p>
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang='ts' setup>
  import { ref } from 'vue';
  import VFacebookLogin from 'vue-facebook-login-component-next';
  import 'vue-facebook-login-component-next/dist/style.css';
  import FriendSkeleton from '@/components/planning/loading/FriendSkeleton.vue';

  const loading = ref(false);
  const isConnected = ref(false);

  const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

  const handleFacebookSdkInit = (res: any): void => {
    const accessToken = res.FB.getAccessToken();
    res.FB.api('/me/friends', 'GET', { fields: 'id,name,email' }, { access_token: accessToken }, (response: any) => {
      console.log({ response });
    });
  };
</script>

<style lang='scss' scoped>
  @import "@/css/planning/aside";

</style>

<style lang="scss">
  .fb-login-btn {
    min-width: 100% !important;
    width: 100% !important;
  }
</style>
