<template>
  <div class="editor">
    <q-editor
      :model-value="localValue"
      :disable="isSubmitting"
      min-height="5rem"
      @update:model-value="newVal => localValue = newVal" />
    <div class="actions row justify-between q-mt-md">
      <q-btn
        flat
        dense
        label="Cancel"
        :ripple="false"
        :disable="isSubmitting"
        @click="close" />
      <q-btn
        flat
        dense
        label="Submit"
        color="primary"
        :ripple="false"
        :loading="isSubmitting"
        :disable="isSubmitting"
        @click="submit">
        <template #loading>
          <q-spinner-tail color="white" />
        </template>
      </q-btn>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref } from 'vue';

  interface Props {
    isSubmitting: boolean;
    value?: string | null;
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { isSubmitting, value } = defineProps<Props>();

  const emit = defineEmits(['handleSubmit', 'handleClose']);

  const localValue = ref(value || '');

  const submit = (): void => {
    emit('handleSubmit', localValue.value);
  };

  const close = (): void => {
    emit('handleClose');
  };
</script>

<style lang='scss' scoped>
  .editor {
    // nothing
  }
</style>
