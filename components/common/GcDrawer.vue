<script lang='ts' setup>
  import { LogOutIcon } from 'lucide-vue-next';

  const $route = useRoute();

  const isActiveRoute = (link: LinkItem) => $route.name === link.to;

  const iconColor = (link: LinkItem) => {
    if (link.disabled) return tailwind.theme.colors.gray['100'];
    return isActiveRoute(link) ? tailwind.theme.colors.primary.DEFAULT : tailwind.theme.colors.gray['500'];
  };

  const $router = useRouter();
  const handleLogout = async () => {
    const supabase = useSupabaseClient();
    await supabase.auth.signOut();
    $router.push({ name: 'login' });
  };

  const $store = useUserStore();
  const { profile } = storeToRefs($store);
</script>

<template>
  <div
    class="bg-white fixed h-screen pb-4 pt-12 px-2 z-50"
    data-testid="gc-drawer">
    <ul class="flex items-center flex-col gap-4 h-full">
      <li class="border-b border-light-grey">
        <span class="block mb-4 px-4 py-2">
          <gc-logo-icon
            :fill="tailwind.theme.colors.primary.DEFAULT"
            wrapper-class="w-8 h-8" />
        </span>
      </li>
      <li
        v-for="link in drawerLinks()"
        :key="link.to"
        :class="link.disabled ? 'cursor-not-allowed' : 'cursor-pointer'">
        <template v-if="link.external">
          <a
            class="inline-flex justify-center items-center mb-4 px-4 py-2 rounded-lg hover:bg-gray-100"
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
            class="inline-flex justify-center items-center mb-4 px-4 py-2 rounded-lg hover:bg-gray-100"
            :class="[isActiveRoute(link) ? 'bg-gray-100' : '']"
            :disabled="link.disabled"
            :to="{ name: link.to }">
            <gc-avatar
              v-if="profile?.image && link.to === 'profile'"
              :initials="initials(profile)"
              size="xs"
              :url="buildImageSrc(profile.image)" />
            <component
              :is="link.icon"
              v-else
              v-tippy="{ content: link.title, placement: 'right', offset: [0, 30] }"
              :color="iconColor(link)"
              :size="24" />
          </nuxt-link>
        </template>
      </li>

      <div class="grow" />

      <li class="cursor-pointer">
        <span
          v-tippy="{ content: 'Logout', placement: 'right' }"
          class="inline-flex justify-center items-center mb-4 px-4 py-2 rounded-lg hover:bg-gray-100"
          data-testid="logout"
          @click="handleLogout">
          <component
            :is="LogOutIcon"
            :color="tailwind.theme.colors['grey']"
            :size="24" />
        </span>
      </li>
    </ul>
  </div>
</template>
