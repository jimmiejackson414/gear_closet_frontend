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

  const handleClose = () => {
    dialogStates.value.addUrlDialog = false;
    activeItem!.value = undefined;
    activeCategoryId!.value = undefined;
  };
</script>

<template>
  <dialog-root :open="dialogStates.addUrlDialog">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>
          Add URL
        </dialog-title>
        <dialog-description>
          Add a website URL to link to more information about this item.
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col w-full">
        <div class="flex items-center gap-4 w-full">
          <input-root
            v-model="newUrl"
            class="w-full"
            label="URL"
            name="url"
            placeholder="https://www.amazon.com"
            :prepend-icon="IconLink"
            type="url" />
          <a
            v-tippy="{ content: 'Visit link' }"
            :disabled="!isValidUrl"
            :href="newUrl"
            rel="noopener noreferrer"
            target="_blank">
            <icon-external-link
              class="duration-150 ease-expo h-6 transition w-6"
              :class="!isValidUrl ? 'cursor-not-allowed text-gray-300' : 'text-accent-alt cursor-pointer'" />
          </a>
        </div>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="handleClose">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          @click="handleSubmit">
          Update
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
