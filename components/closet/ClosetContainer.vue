<script lang="ts" setup>
  import { isResourceLocked, lockedDeepLinkMessage, resolveLockedFallback } from '@/utils/planLimits';

  const $store = useClosetStore();
  const $userStore = useUserStore();
  const $appStore = useAppStore();
  const $route = useRoute();
  const $router = useRouter();
  const $cookie = useCookie('selectedPackId');
  const showLockedDeepLinkBanner = ref(false);

  /**
   * Resolve pack id once: query > cookie > 0 (RPC / store pick first pack).
   * Cookie watcher previously double-fetched with { immediate: true }.
   */
  const resolvePackId = (): number => {
    const fromQuery = $route.query?.pack;
    if (fromQuery != null && fromQuery !== '') {
      return Number(decrypt(fromQuery)) || 0;
    }
    if ($cookie.value) {
      return Number(decrypt($cookie.value)) || 0;
    }
    return 0;
  };

  const hasPackQuery = () => $route.query.pack != null && $route.query.pack !== '';

  const stripPackQuery = async () => {
    if (!hasPackQuery()) return;
    const nextQuery = { ...$route.query };
    delete nextQuery.pack;
    await $router.replace({ query: nextQuery });
  };

  const fallbackFromLockedPack = async (fromQuery: boolean) => {
    if ($userStore.isPaidMember) return;

    const fallback = resolveLockedFallback(
      $store.data.selectedPack,
      $store.data.allPacks,
      isResourceLocked,
    );
    if (!fallback.needed) return;

    await $store.fetchClosetPage(fallback.unlocked?.id ?? 0);
    if (fallback.unlocked) {
      $cookie.value = encrypt(String(fallback.unlocked.id));
    }

    $appStore.notifyInfo(lockedDeepLinkMessage('pack'));
    if (fromQuery) {
      showLockedDeepLinkBanner.value = true;
      await stripPackQuery();
    }
  };

  await $store.fetchClosetPage(resolvePackId());
  await fallbackFromLockedPack(hasPackQuery());

  // Deep-link / browser navigation with ?pack= should refetch that pack.
  watch(
    () => $route.query.pack,
    async (packQuery, previous) => {
      if (packQuery === previous) return;
      if (packQuery == null || packQuery === '') return;
      const id = Number(decrypt(packQuery)) || 0;
      await $store.fetchClosetPage(id);
      await fallbackFromLockedPack(true);
    },
  );

  const packSettingsMode = ref<'create' | 'update'>('create');
  provide('dialogMode', packSettingsMode);
</script>

<template>
  <div>
    <locked-deep-link-banner
      v-if="showLockedDeepLinkBanner"
      kind="pack"
      @dismiss="showLockedDeepLinkBanner = false" />

    <closet-settings />

    <closet-empty-state />

    <pack-summary />

    <lazy-manage-pack-settings-dialog />

    <lazy-csv-upload-dialog />

    <lazy-share-pack-dialog />

    <lazy-delete-category-dialog />

    <lazy-delete-pack-dialog />

    <lazy-remove-item-dialog />

    <lazy-add-url-dialog />
  </div>
</template>
