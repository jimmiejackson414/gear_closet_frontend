<script lang='ts' setup>
  import { LogOutIcon } from 'lucide-vue-next';
  import GcLogoIcon from '@/components/icons/GcLogoIcon.vue';
  import { drawerLinks } from '@/helpers/drawerLinks';
  import { tailwind } from '@/helpers';
  import { useAuthStore } from '@/stores/auth';
  import type { LinkItem } from '@/helpers/drawerLinks';

  const $route = useRoute();

  const isActiveRoute = (link: LinkItem) => $route.name === link.to;

  const iconColor = (link: LinkItem) => {
    if (link.disabled) return tailwind.theme.colors['light-grey'];
    return isActiveRoute(link) ? tailwind.theme.colors.primary : tailwind.theme.colors['grey'];
  };

  const $store = useAuthStore();
  const $router = useRouter();
  const handleLogout = async () => {
    await $store.clearUser();
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
            wrapper-class="w-6 h-6" />
        </span>
      </li>
      <li
        v-for="link in drawerLinks"
        :key="link.to"
        class="hs-tooltip inline-block [--placement:right]">
        <nuxt-link
          class="block hs-tooltip-toggle inflex-flex items-center justify-center mb-4 px-4 py-2 rounded-lg hover:bg-gray-100"
          :class="isActiveRoute(link) ? 'bg-gray-100' : ''"
          :disabled="link.disabled"
          :to="link.to">
          <component
            :is="link.icon"
            :color="iconColor(link)"
            :size="24" />
          <span
            class="absolute bg-gray-900 font-medium hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible inline-block invisible opacity-0 px-2 py-1 rounded shadow-sm text-sm text-white transition-opacity z-10"
            role="tooltip">
            {{ link.title }}
          </span>
        </nuxt-link>
      </li>
      <li class="grow" />
      <li class="hs-tooltip inline-block [--placement:right]">
        <span
          class="block cursor-pointer hs-tooltip-toggle px-4 py-2 rounded-lg hover:bg-gray-100"
          @click="handleLogout">
          <component
            :is="LogOutIcon"
            :color="tailwind.theme.colors['grey']"
            :size="24" />
          <span
            class="absolute bg-gray-900 font-medium hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible inline-block invisible opacity-0 px-2 py-1 rounded shadow-sm text-sm text-white transition-opacity z-10"
            role="tooltip">
            Logout
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
