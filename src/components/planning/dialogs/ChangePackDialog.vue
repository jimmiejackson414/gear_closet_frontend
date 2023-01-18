<template>
  <q-dialog
    :model-value="props.isOpen"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-card-section>
        <h6 class="text-h6 q-ma-none">
          Change your pack
        </h6>
        <p class="text-body1">
          This changes the pack you plan bringing for this trip!
        </p>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="newPack"
          :loading="loadingPacks"
          label="Available packs"
          :options="options"
          option-label="name"
          option-value="id"
          dense
          dropdown-icon="bi-chevron-down"
          outlined />
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
          @click="handleChange" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { ref, watch } from 'vue';
  import { Pack } from '@/generated/types';
  import { usePlanningStore } from '@/stores/planning';

  const props = defineProps<{
    isOpen: boolean;
  }>();

  const store = usePlanningStore();

  const newPack = ref<Pack | null>(null);
  const loadingPacks = ref(true);

  const options = ref<Pack[]>([]);

  const fetchOptions = async (): Promise<void> => {
    const res = await store.fetchPacks();
    if (res.packs) options.value = res.packs as Pack[];
    loadingPacks.value = false;
  };

  const emit = defineEmits(['handleClose', 'handleChangePack']);

  const handleChange = (): void => {
    emit('handleChangePack', newPack.value);
  };

  watch(() => props.isOpen, () => {
    if (props.isOpen) {
      fetchOptions();
      newPack.value = store.pack;
    } else {
      newPack.value = null;
      loadingPacks.value = false;
    }
  });
</script>

<style lang="scss" scoped>
  .q-card {
    border-top: 5px solid $primary;
  }
</style>
