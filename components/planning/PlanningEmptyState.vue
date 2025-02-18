<script lang='ts' setup>
  const $store = usePlanningStore();
  const $userStore = useUserStore();

  const emits = defineEmits<{
    (event: 'openDialog'): void;
  }>();
</script>

<template>
  <div>
    <gc-empty-state>
      <typography
        class="mb-3 font-bold"
        variant="h5">
        You haven't created any trips yet!
      </typography>
      <typography class="mb-4">
        Click the button below to get started.
      </typography>
      <button-root
        :disabled="!$userStore.isPaidMember && $store.data.trips.length > 0"
        size="sm"
        variant="outline"
        @click="emits('openDialog')">
        Create your first trip
      </button-root>
    </gc-empty-state>
  </div>
</template>
