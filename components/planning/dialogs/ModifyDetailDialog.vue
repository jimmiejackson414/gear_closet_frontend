<script lang='ts' setup>
  import type { Database, TablesUpdate } from '@/types';

  const $store = usePlanningStore();
  const $appStore = useAppStore();
  const { activeDetail, data, dialogStates } = storeToRefs($store);
  const submitting = ref(false);
  const detailHasUrl = ref(false);

  const updateDetailHasUrl = (value: boolean) => {
    if (value) {
      $store.activeDetail!.url = $store.activeDetail?.url ? prependProtocol($store.activeDetail?.url) : '';
    } else {
      $store.activeDetail!.url = null;
    }
    detailHasUrl.value = value;
  };

  watch(() => $store.activeDetail, (newVal) => {
    detailHasUrl.value = Boolean(newVal?.url);
  });

  /**
   * Updates a detail.
   */
  const updateDetail = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const payload: TablesUpdate<'trip_details'> = { ...$store.activeDetail, url: detailHasUrl.value ? prependProtocol($store.activeDetail?.url as string) : null };

      const { data: updatedDetail, error } = await supabase.from('trip_details')
        .update(payload)
        .eq('id', $store.activeDetail?.id as number)
        .select();

      if (updatedDetail?.length && !error) {
        const index = data.value.trip_details.findIndex((t) => t.id === $store.activeDetail?.id);
        data.value.trip_details[index] = updatedDetail[0];
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the detail.');
    } finally {
      submitting.value = false;
      dialogStates.value.modifyDetailDialog = false;
    }
  };

  /**
   * Deletes a detail.
   */
  const deleteDetail = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.from('trip_details')
        .delete()
        .eq('id', $store.activeDetail?.id as number);

      if (!error) {
        const index = data.value.trip_details.findIndex((t) => t.id === $store.activeDetail?.id);
        data.value.trip_details.splice(index, 1);
        dialogStates.value.modifyDetailDialog = false;
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error deleting the detail.');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.modifyDetailDialog"
    title="Edit Hike Detail"
    @handle-cancel="dialogStates.modifyDetailDialog = false">
    <template #content>
      <div class="flex flex-col gap-6">
        <gc-input
          class="w-full"
          label="Title"
          :model-value="activeDetail?.title"
          name="title"
          @update:model-value="e => activeDetail!.title = e" />
        <gc-input
          class="w-full"
          label="Value"
          :model-value="activeDetail?.value"
          name="value"
          @update:model-value="e => activeDetail!.value = e" />
        <gc-checkbox
          id="has-url"
          v-model="detailHasUrl"
          data-testid="has-url-checkbox"
          label="Link to URL?"
          @update="updateDetailHasUrl" />
        <gc-input
          v-show="detailHasUrl"
          id="url"
          class="w-full"
          label="URL"
          :model-value="activeDetail?.url"
          name="url"
          @update:model-value="e => activeDetail!.url = e" />
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Delete"
        outlined
        size="sm"
        variant="danger"
        @click="deleteDetail" />
      <div class="flex items-center gap-4">
        <gc-button
          :disabled="submitting"
          label="Cancel"
          size="sm"
          variant="secondary"
          @click="dialogStates.modifyDetailDialog = false" />
        <gc-button
          data-testid="submit-new-detail-btn"
          :disabled="submitting"
          label="Update"
          size="sm"
          @click="updateDetail" />
      </div>
    </template>
  </gc-modal>
</template>
