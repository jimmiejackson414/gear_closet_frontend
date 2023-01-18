<template>
  <q-dialog
    :model-value="isOpen"
    persistent
    @keydown.escape="handleClose">
    <q-card :style="cardStyles">
      <q-card-section>
        <h6 class="text-h6 q-ma-none">
          {{ title }}
        </h6>
      </q-card-section>
      <q-card-section>
        <slot name="content" />
      </q-card-section>
      <q-card-actions :class="[hasCancelBtn ? 'justify-between' : 'justify-end']">
        <q-btn
          v-if="hasCancelBtn"
          unelevated
          :ripple="false"
          label="Cancel"
          @click="handleClose" />
        <q-btn
          unelevated
          :loading="isSubmitting"
          :ripple="false"
          :color="btnColor"
          :label="btnText"
          @click="handleClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { computed } from 'vue';
  import { colors } from 'quasar';

  interface Props {
    alertColor?: string;
    btnColor?: string;
    btnText?: string;
    hasCancelBtn?: boolean;
    isOpen: boolean;
    isSubmitting?: boolean;
    title: string;
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const {
    alertColor = 'primary',
    btnColor = 'primary',
    btnText = 'Continue',
    hasCancelBtn = false,
    isOpen = false,
    isSubmitting = false,
    title = '',
  } = defineProps<Props>();

  const emit = defineEmits(['handleContinue', 'handleClose']);

  const color = computed(() => colors.getPaletteColor(alertColor));
  const cardStyles = computed(() => `border-top: 5px solid ${color.value}`);

  const handleClose = (): void => {
    emit('handleClose');
  };

  const handleClick = (): void => {
    emit('handleContinue');
  };
</script>

<style lang='scss' scoped>
  .q-card {
    border-top: 5px solid $primary;
  }
</style>

<style lang="scss">
  /* stylelint-disable-next-line selector-class-pattern */
  .q-dialog__backdrop {
    backdrop-filter: blur(5px);
  }
</style>
