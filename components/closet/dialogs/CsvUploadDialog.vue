<script lang='ts' setup>
  const $store = useClosetStore();
  const { dialogStates } = storeToRefs($store);
  const submitting = ref(false);
  const file = ref<File | undefined>(undefined);

  const handleSubmit = () => {
    submitting.value = true;
    // Do something with the file
    submitting.value = false;
    dialogStates.value.uploadCsvDialog = false;
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.uploadCsvDialog"
    title="Import from CSV"
    @handle-cancel="dialogStates.uploadCsvDialog = false">
    <template #content>
      <div class="flex items-center flex-col gap-4">
        <p class="mb-0 text-base text-gray">
          Upload a CSV file to automatically add items to your pack. Any items that already exist will not be affected.
        </p>
        <gc-file-input
          class="my-4 w-full"
          @update:model-value="file = $event">
          <template #label>
            <div class="flex items-center gap-2">
              Import pack items (optional)
              <info-icon
                v-tippy="{ content: 'Uploading a CSV will automatically add them to your pack.' }"
                class="h-4 w-4" />
            </div>
          </template>
          <template #help-text>
            <a
              class="hyperlink inline-block"
              href="gear_closet_template.csv">Download CSV template</a>
          </template>
        </gc-file-input>
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="dialogStates.uploadCsvDialog = false" />
      <gc-button
        :disabled="submitting"
        label="Add Items"
        :loading="submitting"
        size="sm"
        @click="handleSubmit" />
    </template>
  </gc-modal>
</template>
