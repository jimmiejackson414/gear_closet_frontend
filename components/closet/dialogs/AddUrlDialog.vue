<script lang='ts' setup>
  import { IconLink } from '#components';
  import type { RowItem } from '@/components/closet/PackItemsTable.vue';

  const $store = useClosetStore();
  const { activeCategoryId, activeItem, dialogStates } = storeToRefs($store);
  const newUrl = ref('');
  const isAddUrlModalOpen = ref(false);

  watch(isAddUrlModalOpen, (newVal) => {
    newVal ? nextTick(() => newUrl.value = $store.activeItem?.url || '') : newUrl.value = '';
  });

  const isValidUrl = ref(false);
  watch(newUrl, (newValue) => {
    if (!newValue) return false;
    const urlRegex = /^(https?:\/\/)?(www\.)?[^.\s]+\.[^\s]*$/gm;
    isValidUrl.value = urlRegex.test(newValue);
  }, { immediate: true });

  const submitting = ref(false);
  const handleSubmit = async () => {
    submitting.value = true;
    await $store.updateItem($store.activeItem as RowItem, 'url', newUrl.value, $store.activeCategoryId as number);
    dialogStates.value.addUrlDialog = false;
    submitting.value = false;
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.addUrlDialog"
    title="Add URL"
    @handle-cancel="[
      $store.dialogStates.addUrlDialog = false,
      activeItem = undefined,
      activeCategoryId = undefined
    ]">
    <template #content>
      <p class="mb-4 text-base">
        Add a website URL to link to more information about this item.
      </p>
      <div class="flex flex-col">
        <div class="flex items-end gap-4">
          <gc-input
            class="w-full"
            label="URL"
            :model-value="newUrl"
            name="url"
            placeholder="https://www.amazon.com"
            :prepend-icon="IconLink"
            @update:model-value="newUrl = $event" />
          <a
            v-tippy="{ content: 'Visit link' }"
            class="mb-3"
            :disabled="!isValidUrl"
            :href="newUrl"
            rel="noopener noreferrer"
            target="_blank">
            <icon-external-link
              class="duration-150 ease-expo h-6 transition w-6"
              :class="!isValidUrl ? 'cursor-not-allowed text-gray-300' : 'text-gray-500 hover:text-primary cursor-pointer'" />
          </a>
        </div>
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="[
          dialogStates.addUrlDialog = false,
          activeItem = undefined,
          activeCategoryId = undefined
        ]" />
      <gc-button
        v-tippy="{ content: !isValidUrl ? 'Not a valid URL' : undefined }"
        :disabled="submitting || !isValidUrl"
        label="Add Items"
        :loading="submitting"
        size="sm"
        @click="handleSubmit" />
    </template>
  </gc-modal>
</template>
