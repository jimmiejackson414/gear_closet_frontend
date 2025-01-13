<script lang='ts' setup>
  import type { Database } from '@/types';

  interface Props {
    isOpen: boolean;
  }

  defineProps<Props>();
  const emits = defineEmits(['onClose']);
  const isSubmitting = ref(false);
  const $appStore = useAppStore();
  const $store = usePlanningStore();

  /**
   * Delete poll from the selected trip.
   */
  const deletePoll = async () => {
    isSubmitting.value = true;
    try {
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.from('polls')
        .delete()
        .eq('id', $store.data.poll?.id as number);

      if (error) { $appStore.notifyNegative('There was an error deleting the poll.'); }
      else {
        $store.data.poll = undefined;
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error deleting the poll.');
    } finally {
      isSubmitting.value = false;
      emits('onClose');
    }
  };
</script>

<template>
  <alert-dialog :open="isOpen">
    <alert-dialog-content>
      <alert-dialog-header>
        <alert-dialog-title>Are you sure you want to delete this poll?</alert-dialog-title>
        <alert-dialog-description>
          This action cannot be undone, and will permanently delete all questions and answers associated with this poll.
        </alert-dialog-description>
      </alert-dialog-header>
      <alert-dialog-footer class="justify-between">
        <alert-dialog-cancel @click="emits('onClose')">
          Cancel
        </alert-dialog-cancel>
        <button-root
          :disabled="isSubmitting"
          :loading="isSubmitting"
          variant="destructive"
          @click="deletePoll">
          Delete Poll
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>
