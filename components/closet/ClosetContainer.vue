<script lang="ts" setup>

  const $store = useClosetStore();
  const $route = useRoute();

  let identifier = 0;
  identifier = $route.query?.pack ? Number(decrypt($route.query.pack)) || 0 : identifier;
  await $store.fetchClosetPage(identifier);

  const $cookie = useCookie('selectedPackId');
  watch(() => $cookie.value, (newValue) => {
    if (newValue && !$route.query?.pack) {
      identifier = Number(decrypt(newValue)) || 0;
      $store.fetchClosetPage(identifier);
    }
  }, { immediate: true });

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
