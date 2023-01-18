<template>
  <q-dialog
    :model-value="props.isOpen"
    class="confirm-delete-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-card-section>
        <div class="row justify-between align-center">
          <h6 class="text-h6 q-ma-none">
            Confirm Delete
          </h6>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12 q-col-gutter-sm">
            <p class="text-body1 text-weight-bold q-mb-none">
              Are you sure you want to delete this category?
            </p>
            <p class="text-body2 q-mb-none">
              This category will be <b>permanently</b> deleted, however the items will be kept for you in the sidebar!
            </p>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="justify-between">
        <q-btn
          flat
          color="text"
          @click="emit('handleClose')">
          Cancel
        </q-btn>
        <q-btn
          flat
          color="primary"
          @click="handleDelete">
          Delete
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  const props = defineProps<{
    isOpen: boolean;
  }>();

  const emit = defineEmits(['handleClose', 'handleDelete']);

  const handleDelete = (): void => {
    emit('handleDelete');
  };
</script>

<style lang='scss' scoped>
  .confirm-delete-dialog {
    .q-card {
      border-top: 5px solid $negative;
      min-width: 250px;
    }
  }
</style>
