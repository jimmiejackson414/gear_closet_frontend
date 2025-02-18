<script lang='ts' setup>
  import { IconLink } from '#components';
  import type { Tables } from '@/types';

  const $store = useClosetStore();
  const newUrl = ref('');

  watch(() => $store.dialogStates.addUrlDialog, (newVal) => {
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
    await $store.updateItem($store.activeItem as Tables<'items'>, 'url', newUrl.value, $store.activeCategoryId as number);
    $store.dialogStates.addUrlDialog = false;
    submitting.value = false;
  };

  const handleClose = () => {
    $store.dialogStates.addUrlDialog = false;
    $store.activeItem = undefined;
    $store.activeCategoryId = undefined;
  };
</script>

<template>
  <dialog-root :open="$store.dialogStates.addUrlDialog">
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
      <div class="flex w-full flex-col">
        <div class="flex w-full items-center gap-4">
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
              class="size-6 transition duration-150 ease-in-out"
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
