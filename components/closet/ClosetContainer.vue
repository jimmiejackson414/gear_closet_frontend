<script lang="ts" setup>

  const $store = useClosetStore();
  const $route = useRoute();
  const $cookie = useCookie('selectedPackId');

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

  await $store.fetchClosetPage(resolvePackId());

  // Deep-link / browser navigation with ?pack= should refetch that pack.
  watch(
    () => $route.query.pack,
    async (packQuery, previous) => {
      if (packQuery === previous) return;
      if (packQuery == null || packQuery === '') return;
      const id = Number(decrypt(packQuery)) || 0;
      await $store.fetchClosetPage(id);
    },
  );

  const packSettingsMode = ref<'create' | 'update'>('create');
  provide('dialogMode', packSettingsMode);
</script>

<template>
  <div>
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
