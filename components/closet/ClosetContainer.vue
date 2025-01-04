<script lang='ts' setup>
  const $store = useClosetStore();

  const $route = useRoute();
  let identifier = 0;
  identifier = $route.query?.pack ? Number(decrypt($route.query.pack)) || 0 : identifier;
  await $store.fetchClosetPage(identifier);

  const $cookie = useCookie('selectedPackId');
  watch($cookie, (newValue) => {
    if (newValue && !$route.query?.pack) {
      identifier = Number(decrypt(newValue)) || 0;
      $store.fetchClosetPage(identifier);
    }
  }, { immediate: true });
</script>

<template>
  <div>
    <closet-settings />

    <closet-empty-state />

    <pack-summary />

    <create-pack-dialog />

    <csv-upload-dialog />

    <share-pack-dialog />

    <delete-category-dialog />

    <delete-pack-dialog />

    <remove-item-dialog />

    <add-url-dialog />

    <pack-settings-dialog />
  </div>
</template>
