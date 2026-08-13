<script lang="ts" setup="">
  import type { Database } from '@/types';

  interface Props {
    isOpen: boolean;
  }

  defineProps<Props>();
  const emits = defineEmits(['onClose']);

  const confirmDeleteAccount = defineModel({ default: false, type: Boolean });

  const $store = useUserStore();
  const $appStore = useAppStore();
  const $router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const isSubmitting = ref(false);
  const handleConfirm = async () => {
    isSubmitting.value = true;
    if ($store.profile) {
      const { error } = await supabase.from('profiles')
        .update({ deactivated_at: new Date()
          .toISOString() })
        .eq('id', $store.profile?.id);
      if (error) {
        $appStore.notifyNegative('There was an error deactivating your account. Please contact customer support.');
      } else {
        $appStore.notifyPositive('Your account has been deactivated.');
        await supabase.auth.signOut();
        $router.push({ name: 'login' });
      }
    }
    isSubmitting.value = false;
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-112.5 lg:max-w-162.5"
      @escape-key-down="emits('onClose')"
      @interact-outside="emits('onClose')">
      <dialog-header>
        <dialog-title>Deactivate Account</dialog-title>
        <dialog-description>
          Are you sure you want to deactivate your account? This action is irreversible.
        </dialog-description>
      </dialog-header>
      <div class="w-full">
        <div class="flex items-top gap-x-2">
          <checkbox
            id="accept-checkbox"
            v-model="confirmDeleteAccount"
            variant="destructive" />
          <div class="grid gap-1.5 leading-none">
            <label
              class="font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive text-sm"
              for="accept-checkbox">
              I accept
            </label>
            <p class="text-destructive text-sm">
              I understand that this action is irreversible.
            </p>
          </div>
        </div>
      </div>
      <dialog-footer>
        <dialog-close @click="emits('onClose')">
          Cancel
        </dialog-close>
        <button-root
          :disabled="!confirmDeleteAccount || isSubmitting"
          :loading="isSubmitting"
          variant="destructive"
          @click="handleConfirm">
          Deactivate Account
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>