<script lang='ts' setup>
  import { useClipboard } from '@vueuse/core';
  import { IconLink } from '#components';

  const $store = useClosetStore();
  const { data, dialogStates } = storeToRefs($store);
  const shareLink = ref('');
  const submitting = ref(false);

  const $appStore = useAppStore();
  const { copy } = useClipboard();
  const copyToClipboard = () => {
    copy(shareLink.value);
    $appStore.notifyInfo('Copied to clipboard!');
  };

  watch(() => dialogStates.value.sharePackDialog, (newValue) => {
    if (newValue) {
      shareLink.value = `${window.location.origin}/p/packs/${data.value.selectedPack?.slug}`;
    }
  });
</script>

<template>
  <dialog-root :open="dialogStates.sharePackDialog">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="dialogStates.sharePackDialog = false"
      @interact-outside="dialogStates.sharePackDialog = false">
      <dialog-header>
        <dialog-title>
          Create a new pack
        </dialog-title>
        <dialog-description>
          Share your pack list with other users by sending them the link below.
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col gap-6">
        <div class="flex items-end gap-4 w-full">
          <div class="grid gap-1.5 items-center max-w-sm w-full">
            <label-root for="url">
              Shareabe Link
            </label-root>
            <input-root
              id="url"
              :model-value="shareLink"
              :prepend-icon="IconLink"
              readonly />
          </div>
          <button-root
            v-tippy="{ content: 'Copy link to clipboard' }"
            class="cursor-pointer duration-150 ease-snap flex justify-center justify-self-end items-center h-8 mb-2 rounded-full transition w-8"
            @click="copyToClipboard">
            <icon-copy class="cursor-pointer duration-150 ease-expo h-6 transition w-6" />
          </button-root>
        </div>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="dialogStates.sharePackDialog = false">
          Cancel
        </dialog-close>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
