<script lang='ts' setup>
  import { IconLink } from '#components';

  const $store = useClosetStore();
  const shareLink = ref('');

  const $appStore = useAppStore();
  const { copy } = useClipboard();

  const isPrivatePack = computed(() => Boolean($store.data.selectedPack?.private));
  const packName = computed(() => $store.data.selectedPack?.name ?? 'this pack');

  const copyTooltip = {
    appendTo: () => document.body,
    content: 'Copy link to clipboard',
    placement: 'top' as const,
  };

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
      class="sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="$store.dialogStates.sharePackDialog = false"
      @interact-outside="$store.dialogStates.sharePackDialog = false">
      <dialog-header>
        <dialog-title>
          Share your pack
        </dialog-title>
        <dialog-description>
          Anyone with this link can view {{ packName }} — no account required. They will see a
          read-only pack list and can sign in to leave comments if you allow them.
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col gap-4">
        <div
          v-if="isPrivatePack"
          class="bg-muted/50 px-4 py-3 border rounded-lg text-sm">
          <p class="font-medium">
            {{ packName }} is private
          </p>
          <p class="mt-1 text-muted-foreground">
            This link will not work for most people. Turn off Private in pack settings to share
            the list publicly, or only send the link to trip members who already have access.
          </p>
        </div>
        <div class="flex items-end gap-4 w-full">
          <div class="items-center gap-1.5 grid w-full max-w-sm">
            <label-root for="url">
              Shareable link
            </label-root>
            <input-root
              id="url"
              :model-value="shareLink"
              :prepend-icon="IconLink"
              readonly />
          </div>
          <button-root
            v-tippy="copyTooltip"
            aria-label="Copy link to clipboard"
            class="flex justify-center justify-self-end items-center mb-2 rounded-full w-8 h-8 transition duration-150 ease-out cursor-pointer"
            @click="copyToClipboard">
            <icon-copy class="w-6 h-6 transition duration-150 ease-out cursor-pointer" />
          </button-root>
        </div>
      </div>
      <dialog-footer>
        <dialog-close @click="$store.dialogStates.sharePackDialog = false">
          Cancel
        </dialog-close>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
