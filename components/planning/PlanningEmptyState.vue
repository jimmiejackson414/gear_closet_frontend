<script lang='ts' setup>
  const $store = usePlanningStore();
  const { data } = storeToRefs($store);
  const { isPaidMember } = storeToRefs(useUserStore());

  const emits = defineEmits<{
    (event: 'openDialog'): void;
  }>();
</script>

<template>
  <div>
    <gc-empty-state>
      <h5 class="font-bold mb-3 text-base-lg">
        You haven't created any trips yet!
      </h5>
      <p class="mb-4 text-base">
        Click the button below to get started.
      </p>
      <gc-button
        :disabled="!isPaidMember && data.trips.length > 0"
        label="Create your first trip"
        outlined
        size="sm"
        @click="emits('openDialog')" />
    </gc-empty-state>
  </div>
</template>
