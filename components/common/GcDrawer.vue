<script lang='ts' setup>
  import { LogOutIcon } from 'lucide-vue-next';
  import { drawerLinks } from '@/helpers/drawerLinks';
  import { tailwind } from '@/helpers';
  import type { LinkItem } from '@/helpers/drawerLinks';

  const $route = useRoute();

  const isActiveRoute = (link: LinkItem) => $route.name === link.to;

  const iconColor = (link: LinkItem) => {
    if (link.disabled) return tailwind.theme.colors['light-grey'];
    return isActiveRoute(link) ? tailwind.theme.colors.primary : tailwind.theme.colors['grey'];
  };

  const $router = useRouter();
  const handleLogout = async () => {
    const supabase = useSupabaseClient();
    await supabase.auth.signOut();
    $router.push({ name: 'login' });
  };
</script>

<template>
  <div class="bg-white fixed h-screen pb-4 pt-12 px-2 z-50">
    <ul class="flex items-center flex-col gap-4 h-full">
      <li class="border-b border-light-grey">
        <span class="block mb-4 px-4 py-2">
          <gc-logo-icon
            :fill="tailwind.theme.colors.primary"
            wrapper-class="w-8 h-8" />
        </span>
      </li>
      <li
        v-for="link in drawerLinks"
        :key="link.to"
        class="cursor-pointer">
        <nuxt-link
          class="inline-flex justify-center items-center mb-4 px-4 py-2 rounded-lg hover:bg-gray-100"
          :class="isActiveRoute(link) ? 'bg-gray-100' : ''"
          data-tooltip-placement="right"
          :data-tooltip-target="`tooltip-${link.title.toLowerCase()}`"
          :disabled="link.disabled"
          :to="link.to">
          <component
            :is="link.icon"
            :color="iconColor(link)"
            :size="24" />
        </nuxt-link>
        <div
          :id="`tooltip-${link.title.toLowerCase()}`"
          class="absolute bg-dark-grey duration-300 font-medium inline-block invisible opacity-0 px-3 py-2 rounded-lg shadow-sm text-sm text-white tooltip transition-opacity z-10"
          role="tooltip">
          {{ link.title }}
        </div>
      </li>

      <li class="grow" />

      <li class="cursor-pointer">
        <span
          class="inline-flex justify-center items-center mb-4 px-4 py-2 rounded-lg hover:bg-gray-100"
          data-tooltip-placement="right"
          data-tooltip-target="tooltip-logout"
          @click="handleLogout">
          <component
            :is="LogOutIcon"
            :color="tailwind.theme.colors['grey']"
            :size="24" />
        </span>
        <div
          id="tooltip-logout"
          class="absolute bg-dark-grey duration-300 font-medium inline-block invisible opacity-0 px-3 py-2 rounded-lg shadow-sm text-sm text-white tooltip transition-opacity z-10"
          role="tooltip">
          Logout
        </div>
      </li>
    </ul>
  </div>
</template>
