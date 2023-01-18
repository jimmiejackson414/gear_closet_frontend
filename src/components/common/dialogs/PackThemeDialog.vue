<template>
  <q-dialog
    :model-value="isOpen"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-card-section>
        <h6 class="text-h6 q-ma-none">
          Update the pack theme color
        </h6>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="newTheme"
          label="Pack theme"
          :options="options"
          dense
          dropdown-icon="bi-chevron-down"
          outlined>
          <template #prepend>
            <span class="material-icons">
              opacity
            </span>
          </template>
          <template #selected>
            <q-item
              v-if="newTheme"
              dense
              class="q-pa-none">
              <q-item-section>
                <q-item-label v-html="newTheme.text" />
              </q-item-section>
              <q-item-section side>
                <ColorSwatch :colors="newTheme.colors" />
              </q-item-section>
            </q-item>
          </template>
          <template #option="{ itemProps, opt }">
            <q-item v-bind="itemProps">
              <q-item-section>
                <q-item-label v-html="opt.text" />
              </q-item-section>
              <q-item-section side>
                <ColorSwatch :colors="opt.colors" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions class="justify-between">
        <q-btn
          unelevated
          :ripple="false"
          flat
          text-color="text"
          label="Cancel"
          @click="emit('handleClose')" />
        <q-btn
          unelevated
          :ripple="false"
          color="primary"
          label="Update"
          @click="handleUpdate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { ref, watchEffect } from 'vue';
  import { Maybe, Theme } from '@/generated/types';
  import generateThemeOptions, { Option } from '@/helpers/chartTheme';
  import ColorSwatch from '@/components/common/ColorSwatch.vue';

  const props = defineProps<{
    isOpen: boolean,
    theme: Maybe<Theme> | undefined,
  }>();

  const newTheme = ref<Option | null>(null);
  const options = generateThemeOptions();

  if (props.theme) {
    newTheme.value = options.find(opt => opt.value === props.theme) as Option;
  } else {
    newTheme.value = options[0] as Option;
  }

  const emit = defineEmits(['handleUpdateTheme', 'handleClose']);

  const handleUpdate = (): void => {
    emit('handleUpdateTheme', newTheme.value?.value);
  };

  watchEffect(() => {
    if (!props.isOpen) {
      newTheme.value = null;
    }
  });
</script>

<style lang="scss" scoped>
  .q-card {
    border-top: 5px solid $primary;
  }
</style>
