<template>
  <q-dialog
    :model-value="props.isOpen"
    class="item-link-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-card-section>
        <div class="row justify-between align-center">
          <h6 class="text-h6 q-ma-none">
            Add URL
          </h6>
          <p class="text-body1 q-mb-none">
            Add a website URL to link to more information about this item.
          </p>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-input
              v-model="url"
              type="url"
              outlined
              dense
              label="URL"
              placeholder="www.google.com">
              <template #prepend>
                <q-icon name="bi-link" />
              </template>
              <template #append>
                <q-btn
                  size="md"
                  flat
                  rounded
                  :ripple="false"
                  color="primary"
                  icon-right="bi-arrow-up-right-circle"
                  @click="handleOpenUrl">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle">
                    Visit link
                  </q-tooltip>
                </q-btn>
              </template>
            </q-input>
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
          @click="handleUpdate">
          Update
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { ref, watch } from 'vue';
  import { openURL } from 'quasar';
  import { storeToRefs } from 'pinia';
  import { useClosetStore } from '@/stores/closet';
  import { prependProtocol } from '@/helpers/functions';

  const props = defineProps<{
    isOpen: boolean;
  }>();

  const store = useClosetStore();
  const { itemLinkDialog } = storeToRefs(store);

  const url = ref('');

  const emit = defineEmits(['handleClose', 'handleUpdate']);

  // update item
  const handleUpdate = async (): Promise<void> => {
    const payload = { id: itemLinkDialog.value.selectedItem?.id as number, input: { url: prependProtocol(url.value) } };
    await store.updateItem(payload);
    itemLinkDialog.value.visible = false;
  };

  const handleOpenUrl = (): void => {
    openURL(url.value, undefined, {
      noopener: true,
      noreferrer: true,
      target: '_blank',
    });
  };

  watch(() => props.isOpen, async (isOpen) => {
    if (isOpen) {
      url.value = itemLinkDialog.value.selectedItem?.url || '';
    } else {
      url.value = '';
    }
  });
</script>

<style lang='scss' scoped>
  .item-link-dialog {
    .q-card {
      border-top: 5px solid $primary;
      min-width: 250px;
    }
  }
</style>
