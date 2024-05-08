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

    <create-pack-dialog :is-open="$store.dialogStates.createPackDialog" />

    <csv-upload-dialog :is-open="$store.dialogStates.uploadCsvDialog" />

    <share-pack-dialog :is-open="$store.dialogStates.sharePackDialog" />

    <delete-category-dialog :is-open="$store.dialogStates.deleteCategoryDialog" />

    <delete-pack-dialog :is-open="$store.dialogStates.deletePackDialog" />

    <remove-item-dialog :is-open="$store.dialogStates.removeItemDialog" />

    <add-url-dialog :is-open="$store.dialogStates.addUrlDialog" />
  </div>
</template>
