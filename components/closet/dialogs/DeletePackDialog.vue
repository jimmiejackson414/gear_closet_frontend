<script lang='ts' setup>
  const $store = useClosetStore();
  const { dialogStates } = storeToRefs($store);
  const removeItemCheckbox = ref(false);
  const submitting = ref(false);

  const handleSubmit = () => {
    submitting.value = true;
    // await $store.deletePack();
    submitting.value = false;
    dialogStates.value.deletePackDialog = false;
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.deletePackDialog"
    title="Delete Pack"
    @handle-cancel="dialogStates.deletePackDialog = false">
    <template #content>
      <div>
        <p class="font-bold mb-0 text-base">
          Are you sure you want to delete this pack?
        </p>
        <p class="!font-bold mb-4 text-base text-danger">
          This action cannot be undone!
        </p>
      </div>
      <div class="flex items-center gap-4">
        <gc-checkbox
          id="remove-item-checkbox"
          v-model="removeItemCheckbox"
          label="Remove from closet?" />
        <info-icon
          v-tippy="{ content: 'Checking this will remove all items from your closet as well.' }"
          class="h-4 w-4" />
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="dialogStates.deletePackDialog = false" />
      <gc-button
        :disabled="submitting"
        label="Delete Pack"
        :loading="submitting"
        size="sm"
        variant="danger"
        @click="handleSubmit" />
    </template>
  </gc-modal>
</template>
