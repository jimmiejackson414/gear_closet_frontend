<script lang='ts' setup>
  const $store = useClosetStore();
  const { data, pageLoading } = storeToRefs($store);

</script>

<template>
  <div v-if="data.selectedPack && !pageLoading">
    <pack-summary-empty-state v-if="!data.selectedPack.categories?.length" />
    <div v-else>
      <card
        class="px-8 py-4 rounded-3xl"
        data-testid="pack-summary-widget">
        <div class="grid lg:grid-cols-[1fr,auto,40%] grid-cols-1 gap-6 pt-4">
          <closet-pack-chart />
          <separator orientation="vertical" />
          <closet-pack-details />
        </div>
      </card>
      <closet-pack-categories />
    </div>
  </div>
</template>
