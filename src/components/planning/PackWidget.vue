<template>
  <q-card
    id="pack-widget"
    class="q-pa-xs widget box-shadow-light">
    <div
      v-if="loading"
      class="q-pa-xl flex">
      <PackSkeleton />
    </div>
    <div v-else>
      <q-card-section class="header">
        <div class="left">
          <p class="text-body2 title q-mb-xs">
            Selected Pack
          </p>
          <div class="pack-name">
            <span class="text-h5 text-weight-bolder">{{ pack?.name || packName }}</span>
          </div>
        </div>
        <div
          v-if="!hideSettings"
          class="action-btns-wrapper">
          <q-btn
            class="pack-settings"
            round
            color="grey-4"
            size="sm"
            text-color="text"
            unelevated
            :ripple="false"
            icon="bi-gear-fill">
            <q-menu>
              <q-list style="min-width: 100px;">
                <q-item
                  v-close-popup
                  clickable
                  @click="isChangePackDialogOpen = true">
                  <q-item-section>Change pack</q-item-section>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  @click="isThemeDialogOpen = true">
                  <q-item-section>Update theme</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <DonutChart
          :data="data"
          :theme="pack?.theme" />
      </q-card-section>
    </div>
  </q-card>
  <PackThemeDialog
    v-if="!hideSettings"
    :is-open="isThemeDialogOpen"
    :theme="pack?.theme"
    @handle-close="isThemeDialogOpen = false"
    @handle-update-theme="handleUpdateTheme" />
  <ChangePackDialog
    v-if="!hideSettings"
    :is-open="isChangePackDialogOpen"
    @handle-close="isChangePackDialogOpen = false"
    @handle-change-pack="handleChangePack" />
</template>

<script lang='ts' setup>
  import {
    defineAsyncComponent, ref, PropType,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import { usePlanningStore } from '@/stores/planning';
  import { Maybe, Pack, Theme } from '@/generated/types';
  import DonutChart from '@/components/common/charts/Donut.vue';
  import PackSkeleton from '@/components/planning/loading/PackSkeleton.vue';

  const PackThemeDialog = defineAsyncComponent(() => import('@/components/common/dialogs/PackThemeDialog.vue'));
  const ChangePackDialog = defineAsyncComponent(() => import('./dialogs/ChangePackDialog.vue'));

  interface MappedData {
    labels: string[] | undefined;
    series: number[] | undefined;
  }

  defineProps({
    data: {
      type: Object as PropType<MappedData>,
      required: true,
      default: () => ({ labels: [], series: [] }),
    },
    loading: { type: Boolean, required: true, default: false },
    hideSettings: { type: Boolean, required: false, default: false },
    packName: { type: String as PropType<Maybe<string> | undefined>, required: false, default: '' },
  });

  const store = usePlanningStore();

  const { pack } = storeToRefs(store);
  const isThemeDialogOpen = ref(false);
  const isChangePackDialogOpen = ref(false);

  const handleChangePack = (newPack: Pack): void => {
    store.changePack(newPack);
    isChangePackDialogOpen.value = false;
  };

  const handleUpdateTheme = (theme: Theme): void => {
    store.updatePack({ theme });
    isThemeDialogOpen.value = false;
  };
</script>

<style lang='scss' scoped>
  @import "@/css/planning/main";

  .header {
    padding-bottom: 0;
  }
</style>
