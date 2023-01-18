<template>
  <q-dialog
    :model-value="props.isOpen"
    class="create-pack-dialog"
    @handle.escape="emit('handleClose')">
    <q-card>
      <q-form @submit.prevent.stop="handleCreate">
        <q-card-section class="header">
          <div class="row justify-between align-center">
            <h6 class="text-h6 q-ma-none">
              Create A New Pack
            </h6>
          </div>
          <p class="text-body1 q-mb-none">
            Create a new pack for your closet.
          </p>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 q-col-gutter-sm">
              <!-- Name -->
              <q-input
                v-model="data.name"
                outlined
                dense
                aria-required="true"
                :disable="isSubmitting"
                label="Name">
                <template #prepend>
                  <q-icon name="bi-fonts" />
                </template>
              </q-input>
              <!-- Pack Theme -->
              <q-select
                v-model="data.theme"
                label="Pack Theme Colors"
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
                    v-if="data.theme"
                    dense
                    class="q-pa-none">
                    <q-item-section>
                      <q-item-label v-html="data.theme.text" />
                    </q-item-section>
                    <q-item-section side>
                      <ColorSwatch :colors="data.theme.colors" />
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
              <div class="options">
                <div class="private">
                  <q-toggle
                    v-model="data.private"
                    color="primary"
                    :disable="isSubmitting"
                    label="Make private" />
                  <q-icon name="bi-info-circle q-ml-sm">
                    <q-tooltip>Private packs cannot be viewed by other users.<br>This setting can be changed later.</q-tooltip>
                  </q-icon>
                </div>
                <div class="comments">
                  <q-toggle
                    v-model="data.allowComments"
                    color="primary"
                    :disable="isSubmitting"
                    label="Allow comments" />
                  <q-icon name="bi-info-circle q-ml-sm">
                    <q-tooltip>Allow users you share this pack with list to make comments?<br>This setting can be changed later.</q-tooltip>
                  </q-icon>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-between">
          <q-btn
            unelevated
            :ripple="false"
            flat
            text-color="text"
            label="Cancel"
            :disable="isSubmitting"
            @click="emit('handleClose')" />
          <q-btn
            unelevated
            :ripple="false"
            color="primary"
            label="Create"
            :disable="isSubmitting"
            type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { reactive, ref, watchEffect } from 'vue';
  import { useAppStore } from '@/stores/app';
  import { useClosetStore } from '@/stores/closet';
  import generateThemeOptions, { Option } from '@/helpers/chartTheme';
  import ColorSwatch from '@/components/common/ColorSwatch.vue';

  // instantiate store
  const appStore = useAppStore();
  const store = useClosetStore();

  // define props
  const props = defineProps<{
    isOpen: boolean;
    description?: string;
  }>();

  // define emits
  const emit = defineEmits(['handleClose']);

  // local data
  const isSubmitting = ref(false);
  const data = reactive({
    name: '',
    theme: {
      text: 'BLUEGREEN6',
      value: 'BLUEGREEN6',
      colors: ['#3494ba', '#58b6c0', '#75bda7', '#7a8c8e', '#84acb6', '#2683c6'],
    } as Option,
    private: false,
    allowComments: false,
  });
  const options = generateThemeOptions();

  // handle update function
  const handleCreate = async (): Promise<void> => {
    isSubmitting.value = true;
    const input = {
      name: data.name,
      theme: data.theme?.value,
      private: data.private,
      allow_comments: data.allowComments,
    };

    const success = await store.createPack(input);

    if (success) {
      appStore.notifyPositive('Pack created successfully');
    } else {
      appStore.notifyNegative('Failed to create pack');
    }
    emit('handleClose');

    isSubmitting.value = false;
  };

  watchEffect(() => {
    if (!props.isOpen) {
      data.name = '';
      data.theme = {
        text: 'BLUEGREEN6',
        value: 'BLUEGREEN6',
        colors: ['#3494ba', '#58b6c0', '#75bda7', '#7a8c8e', '#84acb6', '#2683c6'],
      } as Option;
      data.private = false;
      data.allowComments = false;
    }
  });
</script>

<style lang="scss" scoped>
  .create-pack-dialog {
    .q-card {
      border-top: 5px solid $primary;
      min-width: 350px;
    }
  }
</style>
