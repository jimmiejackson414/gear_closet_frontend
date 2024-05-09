<script lang='ts' setup>
  import { useClipboard } from '@vueuse/core';
  import { CopyIcon, LinkIcon } from 'lucide-vue-next';

  const $store = useClosetStore();
  const { dialogStates } = storeToRefs($store);
  const shareLink = ref('');
  const submitting = ref(false);

  const $appStore = useAppStore();
  const { copy } = useClipboard();
  const copyToClipboard = () => {
    copy(shareLink.value);
    $appStore.notifyInfo('Copied to clipboard!');
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.sharePackDialog"
    title="Share Pack List"
    @handle-cancel="dialogStates.sharePackDialog = false">
    <template #content>
      <div class="flex flex-col">
        <p class="mb-4 text-base">
          Share your pack list with other users by sending them the link below.
        </p>
        <div class="flex items-center gap-4">
          <div class="flex items-end gap-4 w-full">
            <gc-input
              class="w-full"
              label="Shareable Link"
              :model-value="shareLink"
              name="url"
              :prepend-icon="LinkIcon"
              readonly />
            <button
              v-tippy="{ content: 'Copy link' }"
              class="cursor-pointer duration-150 ease-snap flex justify-center justify-self-end items-center h-8 mb-2 rounded-full transition w-8"
              @click="copyToClipboard">
              <copy-icon class="cursor-pointer duration-150 ease-expo h-6 text-gray-500 hover:text-primary transition w-6" />
            </button>
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Close"
        size="sm"
        variant="secondary"
        @click="dialogStates.sharePackDialog = false" />
    </template>
  </gc-modal>
</template>
