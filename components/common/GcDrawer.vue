<script lang='ts' setup>
  import { IconLogOut } from '#components';

  const $route = useRoute();

  const isActiveRoute = (link: LinkItem) => $route.name === link.to;

  const colorMode = useColorMode();
  const isLightMode = computed(() => colorMode.preference === 'light');
  const iconColor = (link: LinkItem) => {
    if (link.disabled) return tailwind.theme.colors.destructive.foreground;
    if (!isLightMode.value) return tailwind.theme.colors.primary.light;
    return isActiveRoute(link)
      ? tailwind.theme.colors.primary.DEFAULT
      : tailwind.theme.colors.muted.foreground;
  };

  const $router = useRouter();
  const handleLogout = async () => {
    const supabase = useSupabaseClient();
    await supabase.auth.signOut();
    await $router.push({ name: 'login' });
  };

  const $store = useUserStore();

  const linkTo = (link: LinkItem) => {
    if (link.disabled && link.requiresSubscription) {
      return { path: '/profile', query: { tab: 'subscription' } };
    }
    return { name: link.to };
  };

  const linkLabel = (link: LinkItem) =>
    (link.requiresSubscription && link.disabled
      ? (link.requiresSubscriptionCopy ?? link.title)
      : link.title);
</script>

<template>
  <div
    class="z-50 fixed bg-background px-2 pt-12 pb-4 h-screen"
    data-testid="gc-drawer">
    <ul class="flex flex-col items-center gap-4 h-full">
      <li class="border-light-grey border-b">
        <span class="block mb-4 px-4 py-2">
          <gc-logo-icon
            :fill="tailwind.theme.colors.primary.DEFAULT"
            wrapper-class="w-8 h-8" />
        </span>
      </li>
      <client-only>
        <li
          v-for="link in drawerLinks()"
          :key="link.to"
          :class="link.disabled ? 'cursor-not-allowed' : 'cursor-pointer'">
          <nuxt-link
            :aria-current="isActiveRoute(link) ? 'page' : undefined"
            :aria-label="linkLabel(link)"
            class="inline-flex justify-center items-center hover:bg-gray-100 dark:hover:bg-accent mb-4 px-4 py-2 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition duration-200 ease-in-out"
            :class="[isActiveRoute(link) ? 'bg-accent dark:bg-accent-light' : '']"
            :to="linkTo(link)">
            <gc-avatar
              v-if="$store.profile?.image && link.to === 'profile'"
              v-tippy="{ content: linkLabel(link), placement: 'right', offset: [0, 30] }"
              :initials="initials($store.profile)"
              size="xs"
              :url="$store.profile.image" />
            <component
              :is="link.icon"
              v-else
              v-tippy="{ content: linkLabel(link), placement: 'right', offset: [0, 30] }"
              :color="iconColor(link)"
              :size="24" />
          </nuxt-link>
        </li>
      </client-only>

      <div class="grow" />

      <client-only>
        <li class="cursor-pointer">
          <button
            v-tippy="{ content: 'Log out', placement: 'right', offset: [0, 30] }"
            aria-label="Log out"
            class="inline-flex justify-center items-center hover:bg-gray-100 dark:hover:bg-accent mb-4 px-4 py-2 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-testid="logout"
            type="button"
            @click="handleLogout">
            <icon-log-out
              aria-hidden="true"
              :color="isLightMode ? tailwind.theme.colors.gray['500'] : tailwind.theme.colors.card.foreground"
              :size="24" />
          </button>
        </li>
      </client-only>
    </ul>
  </div>
</template>
