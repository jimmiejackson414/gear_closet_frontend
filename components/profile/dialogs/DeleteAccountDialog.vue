<script lang="ts" setup="">
  import { Checkbox, Button as DialogButton, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, Dialog as DialogRoot, DialogTitle } from '@/components/ui';

  interface Props {
    isOpen: boolean;
  }

  defineProps<Props>();
  const emits = defineEmits(['onClose']);

  const confirmDeleteAccount = defineModel({ default: false, type: Boolean });

  // TODO: Finish the implementation of the DeleteAccountDialog component
  const isSubmitting = ref(false);
  const handleConfirm = async () => {
    isSubmitting.value = true;
    console.log('handleConfirm');
    isSubmitting.value = false;
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="emits('onClose')"
      @interact-outside="emits('onClose')">
      <dialog-header>
        <dialog-title>Delete Account</dialog-title>
        <dialog-description>
          Are you sure you want to delete your account? This action is irreversible and will delete all your data.
        </dialog-description>
      </dialog-header>
      <div class="w-full">
        <div class="flex items-top gap-x-2 mt-6">
          <checkbox
            id="accept-checkbox"
            v-model:checked="confirmDeleteAccount" />
          <div class="grid gap-1.5 leading-none">
            <label
              class="font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive text-sm"
              for="accept-checkbox">
              I accept
            </label>
            <p class="text-destructive text-sm">
              I understand that this action is irreversible and will delete all my data.
            </p>
          </div>
        </div>
      </div>
      <dialog-footer>
        <dialog-close @click="emits('onClose')">
          Cancel
        </dialog-close>
        <dialog-button
          :disabled="!confirmDeleteAccount || isSubmitting"
          :loading="isSubmitting"
          variant="destructive"
          @click="handleConfirm">
          Delete Account
        </dialog-button>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>