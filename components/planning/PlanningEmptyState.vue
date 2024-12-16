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
      <typography
        class="font-bold mb-3"
        variant="h5">
        You haven't created any trips yet!
      </typography>
      <typography class="mb-4">
        Click the button below to get started.
      </typography>
      <button-root
        :disabled="!isPaidMember && data.trips.length > 0"
        size="sm"
        variant="outline"
        @click="emits('openDialog')">
        Create your first trip
      </button-root>
    </gc-empty-state>
  </div>
</template>
