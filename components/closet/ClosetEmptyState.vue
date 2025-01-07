<script lang='ts' setup>
  const $store = useClosetStore();
  const { data, dialogStates, pageLoading } = storeToRefs($store);
</script>

<template>
  <div v-if="!data.allPacks.length && !pageLoading">
    <gc-empty-state data-testid="closet-empty-state">
      <typography
        class="font-bold mb-3"
        variant="h5">
        You haven't created any packs yet!
      </typography>
      <typography class="mb-4">
        Click the button below to get started.
      </typography>
      <button-root
        size="sm"
        variant="outline"
        @click="dialogStates.managePackSettingsDialog = true">
        Create your first pack
      </button-root>
    </gc-empty-state>
  </div>
</template>
