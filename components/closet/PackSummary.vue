<script lang='ts' setup>
  const $store = useClosetStore();
  const { data, pageLoading } = storeToRefs($store);

</script>

<template>
  <div v-if="data.selectedPack && !pageLoading">
    <pack-summary-empty-state v-if="!data.selectedPack.categories?.length" />
    <div v-else>
      <div
        class="card card-main"
        data-testid="pack-summary-widget">
        <div class="grid lg:grid-cols-[60%,40%] grid-cols-1 gap-6 pt-4">
          <closet-pack-chart />
          <closet-pack-details />
        </div>
      </div>
      <closet-pack-categories />
    </div>
  </div>
</template>
