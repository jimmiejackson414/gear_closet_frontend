<script lang='ts' setup>
  const $store = useClosetStore();
</script>

<template>
  <div v-if="!$store.data.allPacks.length && !$store.pageLoading">
    <gc-empty-state data-testid="closet-empty-state">
      <typography
        class="mb-3 font-bold"
        variant="h5">
        You haven't created any packs yet!
      </typography>
      <typography class="mb-4">
        Click the button below to get started.
      </typography>
      <button-root
        size="sm"
        variant="outline"
        @click="$store.dialogStates.managePackSettingsDialog = true">
        Create your first pack
      </button-root>
    </gc-empty-state>
  </div>
</template>
