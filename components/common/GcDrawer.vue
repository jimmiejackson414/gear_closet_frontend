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
</script>

<template>
  <div
    class="bg-background fixed h-screen pb-4 pt-12 px-2 z-50"
    data-testid="gc-drawer">
    <ul class="flex items-center flex-col gap-4 h-full">
      <li class="border-b border-light-grey">
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
          <template v-if="link.external">
            <a
              class="inline-flex justify-center items-center mb-4 px-4 py-2 rounded-lg dark:hover:bg-accent hover:bg-gray-100"
              :href="link.disabled ? undefined : link.to"
              rel="noopener noreferrer"
              target="_blank"
              @click="link.disabled && $event.preventDefault()">
              <component
                :is="link.icon"
                v-tippy="{ content: (link.requiresSubscription && link.disabled ? link.requiresSubscriptionCopy : link.title), placement: 'right', offset: [0, 30] }"
                :color="iconColor(link)"
                :size="24" />
            </a>
          </template>
          <template v-else>
            <nuxt-link
              class="duration-200 ease-in-out inline-flex justify-center items-center mb-4 px-4 py-2 rounded-lg transition dark:hover:bg-accent hover:bg-gray-100"
              :class="[isActiveRoute(link) ? 'bg-accent dark:bg-accent-light' : '']"
              :disabled="link.disabled"
              :to="{ name: link.to }">
              <gc-avatar
                v-if="$store.profile?.image && link.to === 'profile'"
                v-tippy="{ content: link.title, placement: 'right', offset: [0, 30] }"
                :initials="initials($store.profile)"
                size="xs"
                :url="buildImageSrc($store.profile.image)" />
              <component
                :is="link.icon"
                v-else
                v-tippy="{ content: link.title, placement: 'right', offset: [0, 30] }"
                :color="iconColor(link)"
                :size="24" />
            </nuxt-link>
          </template>
        </li>
      </client-only>

      <div class="grow" />

      <client-only>
        <li class="cursor-pointer">
          <span
            v-tippy="{ content: 'Logout', placement: 'right' }"
            class="inline-flex justify-center items-center mb-4 px-4 py-2 rounded-lg dark:hover:bg-accent hover:bg-gray-100"
            data-testid="logout"
            @click="handleLogout">
            <icon-log-out
              :color="isLightMode ? tailwind.theme.colors.gray['500'] : tailwind.theme.colors.card.foreground"
              :size="24" />
          </span>
        </li>
      </client-only>
    </ul>
  </div>
</template>
