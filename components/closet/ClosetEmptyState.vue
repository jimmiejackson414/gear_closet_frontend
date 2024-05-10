<script lang='ts' setup>
  const $store = useClosetStore();
  const { data, dialogStates, pageLoading } = storeToRefs($store);
</script>

<template>
  <div v-if="!data.allPacks.length && !pageLoading">
    <gc-empty-state data-testid="closet-empty-state">
      <h5 class="font-bold mb-3 text-base-lg">
        You haven't created any packs yet!
      </h5>
      <p class="mb-4 text-base">
        Click the button below to get started.
      </p>
      <gc-button
        label="Create your first pack"
        outlined
        size="sm"
        @click="dialogStates.createPackDialog = true" />
    </gc-empty-state>
  </div>
</template>
