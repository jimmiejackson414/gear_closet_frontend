<script lang='ts' setup>
  import { IconLogOut } from '#components';

  const {
    $appStore,
    $store,
    handleLogout,
    iconColor,
    isActiveRoute,
    isLightMode,
    linkLabel,
    links,
    linkTo,
    onDrawerLinkClick,
  } = useDrawerNav();
  const NuxtLink = resolveComponent('NuxtLink');

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  watch([() => $appStore.drawer, isDesktop], ([open, desktop]) => {
    if (!import.meta.client) return;
    document.documentElement.classList.toggle('overflow-hidden', Boolean(open) && !desktop);
  }, { immediate: true });

  onUnmounted(() => {
    if (!import.meta.client) return;
    document.documentElement.classList.remove('overflow-hidden');
  });
</script>

<template>
  <div>
    <button
      v-if="$appStore.drawer"
      aria-label="Close navigation"
      class="z-40 fixed inset-0 bg-black/50"
      data-testid="gc-drawer-backdrop"
      type="button"
      @click="$appStore.closeDrawer" />
    <nav
      id="gc-drawer"
      class="z-50 top-0 left-0 fixed bg-background shadow-lg pt-6 pb-4 px-3 h-screen w-64 max-w-[min(16rem,80vw)] transition-transform duration-200 ease-out"
      :class="$appStore.drawer ? 'translate-x-0' : '-translate-x-full'"
      data-testid="gc-drawer-mobile">
      <ul class="flex flex-col gap-2 h-full">
        <li class="flex justify-between items-center border-light-grey border-b">
          <span class="block mb-4 px-2 py-2">
            <gc-logo-icon
              :fill="tailwind.theme.colors.primary.DEFAULT"
              wrapper-class="w-8 h-8" />
          </span>
          <button-root
            aria-label="Close navigation"
            class="mb-4"
            data-testid="gc-drawer-close"
            size="icon"
            type="button"
            variant="ghost"
            @click="$appStore.closeDrawer">
            <icon-x aria-hidden="true" />
          </button-root>
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
              class="inline-flex items-center mb-1 px-3 py-2 rounded-lg w-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition duration-200 ease-in-out"
              :class="[
                isActiveRoute(link) && !link.comingSoon ? 'bg-accent dark:bg-accent-light' : '',
                link.comingSoon ? 'opacity-70' : 'hover:bg-gray-100 dark:hover:bg-accent',
              ]"
              :to="linkTo(link)"
              @click="onDrawerLinkClick(link)">
              <gc-avatar
                v-if="$store.profile?.image && link.to === 'profile'"
                :initials="initials($store.profile)"
                size="xs"
                :url="$store.profile.image" />
              <component
                :is="link.icon"
                v-else
                class="shrink-0"
                :color="iconColor(link)"
                :size="24" />
              <span class="ml-3 min-w-0 font-medium text-sm truncate">
                {{ linkLabel(link) }}
              </span>
            </component>
          </li>
        </client-only>

        <div class="grow" />

        <client-only>
          <li class="cursor-pointer w-full">
            <button
              aria-label="Log out"
              class="inline-flex items-center hover:bg-gray-100 dark:hover:bg-accent mb-4 px-3 py-2 rounded-lg w-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-testid="logout"
              type="button"
              @click="handleLogout">
              <icon-log-out
                aria-hidden="true"
                class="shrink-0"
                :color="isLightMode ? tailwind.theme.colors.gray['500'] : tailwind.theme.colors.card.foreground"
                :size="24" />
              <span class="ml-3 font-medium text-sm">
                Log out
              </span>
            </button>
          </li>
        </client-only>
      </ul>
    </nav>
  </div>
</template>
