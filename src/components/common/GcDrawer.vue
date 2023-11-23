<script lang='ts' setup>
  import GcLogoIcon from '@/components/icons/GcLogoIcon.vue';
  import { drawerLinks, tailwind } from '@/helpers';
  import type { LinkItem } from '@/helpers/drawerLinks';

  const $route = useRoute();

  const isActiveRoute = (link: LinkItem) => $route.name === link.to;

  const iconColor = (link: LinkItem) => {
    if (link.disabled) return tailwind.theme.colors['light-grey'];
    console.log(`route path: ${$route.path}`);
    return isActiveRoute(link) ? tailwind.theme.colors.primary : tailwind.theme.colors['grey'];
  };
</script>

<template>
  <div class="bg-white fixed h-screen px-2 py-12">
    <ul class="flex items-center flex-col gap-4">
      <li class="border-b border-light-grey">
        <span class="block mb-4 px-4 py-2">
          <gc-logo-icon
            wrapper-class="w-6 h-6"
            :fill="tailwind.theme.colors.primary" />
        </span>
      </li>
      <li
        v-for="link in drawerLinks"
        :key="link.to">
        <router-link
          :to="link.to"
          :disabled="link.disabled"
          :class="isActiveRoute(link) ? 'bg-gray-100' : ''"
          class="block mb-4 px-4 py-2 rounded-lg hover:bg-gray-100">
          <component
            :is="link.icon"
            :color="iconColor(link)"
            :size="24" />
        </router-link>
      </li>
    </ul>
  </div>
</template>
