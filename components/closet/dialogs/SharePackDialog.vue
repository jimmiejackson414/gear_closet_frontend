<script lang='ts' setup>
  import { IconLink } from '#components';

  const $store = useClosetStore();
  const shareLink = ref('');
  const submitting = ref(false);

  const $appStore = useAppStore();
  const { copy } = useClipboard();
  const copyToClipboard = () => {
    copy(shareLink.value);
    $appStore.notifyInfo('Copied to clipboard!');
  };

  watch(() => $store.dialogStates.sharePackDialog, (newValue) => {
    if (newValue) {
      shareLink.value = `${window.location.origin}/p/packs/${$store.data.selectedPack?.slug}`;
    }
  }, { immediate: true });
</script>

<template>
  <dialog-root :open="$store.dialogStates.sharePackDialog">
    <dialog-content
      class="sm:max-w-[450px] lg:max-w-[650px] max-h-[90dvh]"
      @escape-key-down="$store.dialogStates.sharePackDialog = false"
      @interact-outside="$store.dialogStates.sharePackDialog = false">
      <dialog-header>
        <dialog-title>
          Share your pack
        </dialog-title>
        <dialog-description>
          Share your pack list with other users by sending them the link below.
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col gap-6">
        <div class="flex items-end gap-4 w-full">
          <div class="items-center gap-1.5 grid w-full max-w-sm">
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
            class="flex justify-center justify-self-end items-center mb-2 rounded-full w-8 h-8 transition duration-150 ease-snap cursor-pointer"
            @click="copyToClipboard">
            <icon-copy class="w-6 h-6 transition duration-150 ease-expo cursor-pointer" />
          </button-root>
        </div>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="$store.dialogStates.sharePackDialog = false">
          Cancel
        </dialog-close>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
