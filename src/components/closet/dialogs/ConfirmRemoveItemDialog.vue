<template>
  <q-dialog
    :model-value="props.isOpen"
    class="confirm-remove-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-card-section>
        <div class="row justify-between align-center">
          <h6 class="text-h6 q-ma-none">
            Confirm Remove
          </h6>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12 q-col-gutter-sm">
            <p class="text-body1 text-weight-bold q-mb-none">
              Are you sure you want to remove this item?
            </p>
            <p class="text-body2 q-mb-none">
              This item will <b>not</b> be permanently removed. You can always add it back to this category from the sidebar!
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-12 q-col-gutter-sm">
            <q-checkbox
              v-model="remember"
              label="Don't show this again?" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="justify-between">
        <q-btn
          flat
          color="text"
          @click="closeDialog">
          Cancel
        </q-btn>
        <q-btn
          flat
          color="primary"
          @click="handleRemove">
          Remove
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { ref, watchEffect } from 'vue';
  import { useClosetStore } from '@/stores/closet';

  const props = defineProps<{
    isOpen: boolean;
  }>();

  const store = useClosetStore();

  const emit = defineEmits(['handleClose', 'handleRemove']);

  const remember = ref(false);

  const handleRemove = (): void => {
    if (remember.value) {
      localStorage.setItem('gc.confirmRemove', 'true');
      store.confirmRemoveDialog.remember = true;
    }
    emit('handleRemove');
  };

  const closeDialog = (): void => {
    store.confirmRemoveDialog.selectedCategory = null;
    store.confirmRemoveDialog.selectedItem = null;
    emit('handleClose');
  };

  watchEffect(() => {
    if (!props.isOpen) {
      remember.value = false;
    }
  });
</script>

<style lang='scss' scoped>
  .confirm-remove-dialog {
    .q-card {
      border-top: 5px solid $negative;
      min-width: 250px;
    }
  }
</style>
