<script lang='ts' setup>
  import { IconLogOut } from '#components';

  const {
    $store,
    handleLogout,
    iconColor,
    isActiveRoute,
    isLightMode,
    linkLabel,
    linkTo,
    links,
    onDrawerLinkClick,
  } = useDrawerNav();
  const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <nav
    class="z-50 top-0 left-0 fixed bg-background pt-12 pb-4 px-2 h-screen w-16"
    data-testid="gc-drawer">
    <ul class="flex flex-col items-center gap-4 h-full">
      <li class="flex justify-center items-center border-light-grey border-b">
        <span class="block mb-4 px-4 py-2">
          <gc-logo-icon
            :fill="tailwind.theme.colors.primary.DEFAULT"
            wrapper-class="w-8 h-8" />
        </span>
      </li>
      <client-only>
        <li
          v-for="link in links"
          :key="link.to"
          :class="link.disabled || link.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'">
          <component
            :is="link.comingSoon ? 'span' : NuxtLink"
            :aria-current="!link.comingSoon && isActiveRoute(link) ? 'page' : undefined"
            :aria-disabled="link.comingSoon ? 'true' : undefined"
            :aria-label="linkLabel(link)"
            class="inline-flex justify-center items-center mb-4 px-4 py-2 rounded-lg w-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition duration-200 ease-in-out"
            :class="[
              isActiveRoute(link) && !link.comingSoon ? 'bg-accent dark:bg-accent-light' : '',
              link.comingSoon ? 'opacity-70' : 'hover:bg-gray-100 dark:hover:bg-accent',
            ]"
            :to="linkTo(link)"
            @click="onDrawerLinkClick(link)">
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
              class="shrink-0"
              :color="iconColor(link)"
              :size="24" />
          </component>
        </li>
      </client-only>

      <div class="grow" />

      <client-only>
        <li class="cursor-pointer w-full">
          <button
            v-tippy="{ content: 'Log out', placement: 'right', offset: [0, 30] }"
            aria-label="Log out"
            class="inline-flex justify-center items-center hover:bg-gray-100 dark:hover:bg-accent mb-4 px-4 py-2 rounded-lg w-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-testid="logout"
            type="button"
            @click="handleLogout">
            <icon-log-out
              aria-hidden="true"
              class="shrink-0"
              :color="isLightMode ? tailwind.theme.colors.gray['500'] : tailwind.theme.colors.card.foreground"
              :size="24" />
          </button>
        </li>
      </client-only>
    </ul>
  </nav>
</template>
