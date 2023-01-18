<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :mini="isMini && !isMobile"
    :overlay="isMobile"
    mini-to-overlay
    :width="300"
    :breakpoint="500"
    class="bg-white"
    @mouseover="isMini = false"
    @mouseout="isMini = true"
    @focusin="isMini = false"
    @focusout="isMini = true">
    <q-list padding>
      <q-item class="drawer-logo q-pb-none">
        <router-link
          to="/"
          class="row">
          <q-item-section avatar>
            <LogoIcon
              fill="#2368a2"
              :width="24" />
          </q-item-section>
          <q-item-section class="text-darkgrey">
            Gear Closet
          </q-item-section>
        </router-link>
      </q-item>
      <q-separator
        spaced="lg"
        inset />
      <q-item
        v-for="item in drawerItems"
        :id="`${item.title.toLowerCase()}-link`"
        :key="item.title"
        :disable="item.disabled || (item.requiresSubscription && !hasSubscription)"
        :href="item.title === 'Forums' ? item.href : undefined"
        :to="item.href"
        exact
        class="q-mb-md"
        :active="isActiveRoute(item.href)"
        clickable>
        <q-tooltip v-if="item.requiresSubscription && !hasSubscription">
          Must be subscribed to Annual or Monthly membership!
        </q-tooltip>
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>

        <q-item-section>
          {{ item.title }}
        </q-item-section>
      </q-item>

      <q-item
        id="profile-link"
        to="/profile"
        exact
        :active="isActiveRoute('/profile')"
        clickable>
        <q-item-section avatar>
          <AvatarDefault
            v-if="currentUser"
            size="25px"
            :user="(currentUser as User)" />
          <q-icon
            v-else
            name="bi-person-circle" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ friendlyUsername(currentUser) }}
          </q-item-label>
          <q-item-label caption>
            {{ capitalize(currentUser?.subscription_level as string) }} Account
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-space />

      <q-separator inset />

      <q-item
        clickable
        @click="handleLogout">
        <q-item-section avatar>
          <q-icon name="bi-box-arrow-left" />
        </q-item-section>

        <q-item-section>
          Logout
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script lang='ts' setup>
  import { computed, ref, watchEffect } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/stores/app';
  import { useUserStore } from '@/stores/user';
  import { drawerItems } from '@/helpers';
  import { capitalize, friendlyUsername } from '@/helpers/functions';
  import { SubscriptionLevel, User } from '@/generated/types';
  import LogoIcon from './icons/LogoIcon.vue';
  import AvatarDefault from './AvatarDefault.vue';

  // instantite store and libs
  const appStore = useAppStore();
  const user = useUserStore();
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();

  const { drawer } = storeToRefs(appStore);
  const { currentUser } = storeToRefs(user);

  // local state
  const isMini = ref(true);
  const isMobile = ref(true);

  const hasSubscription = computed(() => currentUser.value?.subscription_level !== SubscriptionLevel.Free);

  const isActiveRoute = (itemRoute: string): boolean => route.path === itemRoute;

  const handleLogout = async (): Promise<void> => {
    router.push({ name: 'login', query: { reason: 'logout' } });
  };

  watchEffect(() => {
    isMobile.value = $q.screen.xs;
  });
</script>

<style lang="scss" scoped>
  .q-drawer {
    top: 0 !important;

    .q-list {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 28px 8px 8px;

      .drawer-logo {
        font-family: Lato, Helvetica, sans-serif;
        text-transform: uppercase;
        font-size: 1.5rem;
        padding-bottom: 0;

        a {
          color: #4a4a4a;
          text-decoration: none;
        }
      }

      .q-item {
        padding: 8px;

        .q-focus-helper {
          border-radius: 10px;
        }

        &:hover {
          .q-focus-helper {
            border-radius: 10px;
          }
        }
      }

      /* stylelint-disable-next-line selector-class-pattern */
      .q-router-link--active {
        border-radius: 10px;
        background-color: $grey-3;
      }
    }
  }

</style>
