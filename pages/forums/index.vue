<script lang='ts' setup>
  import {
    FORUMS_UPGRADE_PATH,
    isForumsConfigured,
    resolveForumsRedirect,
  } from '@/utils/forums';

  definePageMeta({ layout: 'page-layout' });

  useHead({
    title: 'Forums',
    meta: [
      {
        name: 'description',
        content: 'Open the Gear Closet community forums.',
      },
    ],
  });

  const $store = useUserStore();
  const $config = useRuntimeConfig();
  const $route = useRoute();
  const user = useSupabaseUser();

  const destination = computed(() =>
    resolveForumsRedirect($config.public.forumsUrl, $route.query));

  if (!user.value) {
    await navigateTo('/login');
  }
  else if (!$store.isPaidMember) {
    await navigateTo(FORUMS_UPGRADE_PATH);
  }
  else if (isForumsConfigured(destination.value)) {
    await navigateTo(destination.value, { external: true });
  }
</script>

<template>
  <div class="flex flex-col items-center gap-3 py-12 text-center">
    <typography>
      The community is warming up — check back soon.
    </typography>
  </div>
</template>
