<template>
  <q-dialog
    :model-value="props.isOpen"
    class="share-pack-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-card-section class="header">
        <div class="row justify-between align-center">
          <h6 class="text-h6 q-ma-none">
            Share
          </h6>
        </div>
        <p class="text-body1 q-mb-none">
          Share this link with others to show what you've got!
        </p>
        <p class="text-body2">
          NOTE: Pack must be public for others to view it. Edit your pack to change this setting.
        </p>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12 q-col-gutter-sm">
            <!-- Link -->
            <q-input
              v-model="link"
              outlined
              dense
              label="Link">
              <template #prepend>
                <q-icon name="bi-link-45deg" />
              </template>
              <template #append>
                <q-btn
                  flat
                  unelevated
                  :ripple="false"
                  text-color="text"
                  @click="copyToClipboard">
                  <span class="material-icons">
                    content_copy
                  </span>
                  <q-tooltip>Copy to clipboard</q-tooltip>
                </q-btn>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="justify-between">
        <q-btn
          unelevated
          :ripple="false"
          flat
          text-color="text"
          label="Close"
          :disable="isSubmitting"
          @click="emit('handleClose')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { ref, watch } from 'vue';
  import { useAppStore } from '@/stores/app';
  import { useClosetStore } from '@/stores/closet';

  // instantiate store
  const appStore = useAppStore();
  const closetStore = useClosetStore();

  // define props
  const props = defineProps<{
    isOpen: boolean;
  }>();

  // define emits
  const emit = defineEmits(['handleClose']);

  // local data
  const isSubmitting = ref(false);
  const link = ref('');

  // handle copy to clipboard
  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(link.value)
      .then(() => {
        appStore.notifyPositive('Link copied to clipboard!');
      });
  };

  watch(() => props.isOpen, (val) => {
    if (val) {
      link.value = `${window.location.origin}/p/packs/${closetStore?.selectedPack?.slug}`;
    }
  });
</script>

<style lang="scss" scoped>
  .share-pack-dialog {
    .q-card {
      border-top: 5px solid $primary;
      min-width: 350px;
    }
  }
</style>
