<template>
  <div class="col-12 col-md-7">
    <q-card class="box-shadow-light full-width chart-wrapper q-pa-lg">
      <div class="header">
        <h6 class="text-h6 q-mt-none q-mb-md">
          Pack summary
        </h6>
        <div class="action-btns-wrapper">
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
              <q-list style="min-width: 150px;">
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
      </div>
      <BarChart
        :data="chartData"
        :theme="selectedPack?.theme" />
    </q-card>
  </div>
  <div class="col-12 col-md-5">
    <q-card class="box-shadow-light full-width stats-wrapper q-pa-lg full-height">
      <div class="header">
        <h6 class="text-h6 q-mt-none q-mb-md">
          Stats
        </h6>
      </div>
      <div class="details-wrapper">
        <div
          v-for="detail in details"
          :key="detail.title"
          class="detail">
          <div class="detail-title">
            <span class="text-overline text-grey-8 q-ma-none text-weight-bold">
              {{ detail.title }}
            </span>
          </div>
          <div class="detail-weight">
            <h6
              class="text-h6 q-ma-none text-weight-bold"
              :style="{ color: detail.color }">
              {{ detail.weight || '' }} lbs
            </h6>
          </div>
        </div>
      </div>
    </q-card>
  </div>
  <PackThemeDialog
    :is-open="isThemeDialogOpen"
    :theme="selectedPack?.theme"
    @handle-close="isThemeDialogOpen = false"
    @handle-update-theme="handleUpdateTheme" />
</template>

<script lang='ts' setup>
  import {
    defineAsyncComponent, reactive, ref, watchEffect,
  } from 'vue';
  import round from 'lodash.round';
  import convert, { Mass } from 'convert';
  import { storeToRefs } from 'pinia';
  import { useClosetStore } from '@/stores/closet';
  import BarChart from '@/components/common/charts/Bar.vue';
  import { Category, Theme } from '@/generated/types';
  import { calculateCategoryWeight, calculatePackWeights } from '@/helpers/functions';
  import { findTheme } from '@/helpers/chartTheme';

  const PackThemeDialog = defineAsyncComponent(() => import('@/components/common/dialogs/PackThemeDialog.vue'));

  // store
  const store = useClosetStore();
  const { selectedPack } = storeToRefs(store);

  // local data
  const isThemeDialogOpen = ref(false);
  const chartData = reactive({
    series: [{
      name: 'Pack Weight',
      data: [] as number[],
    }],
    labels: [] as string[] | undefined,
  });
  const details = reactive([
    { title: 'Worn', weight: 0, color: '' },
    { title: 'Consumable', weight: 0, color: '' },
    { title: 'Base', weight: 0, color: '' },
    { title: 'Total', weight: 0, color: '' },
  ]);

  const handleUpdateTheme = (theme: Theme): void => {
    store.updatePack(selectedPack.value?.id as number, { theme });
    isThemeDialogOpen.value = false;
  };

  // generate data for charts
  watchEffect((onCleanup) => {
    if (selectedPack.value) {
      chartData.series = [{
        name: 'Pack Weight',
        data: selectedPack.value.categories?.map(category => {
          const categoryWeight = calculateCategoryWeight(category as Category);
          return round(convert(categoryWeight, 'mg')
            .to((category as Category).unit as Mass), 2);
        }) as number[],
      }];
      chartData.labels = selectedPack.value.categories?.map(category => (category && category.name ? category.name : 'Unnamed'));

      const weights = calculatePackWeights(selectedPack.value);
      const theme = findTheme(selectedPack.value.theme);

      for (let i = 0; i < details.length; i += 1) {
        const detail = details[i];
        const weight = weights[details[i].title.toLowerCase() as keyof typeof weights];
        detail.weight = round(convert(weight, 'mg')
          .to('lb'), 2);
        detail.color = theme[i];
      }
    }

    onCleanup(() => {
      chartData.labels = [];
      chartData.series = [];
    });
  });
</script>

<style lang='scss' scoped>
  .chart-wrapper {
    .header {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }
  }

  .stats-wrapper {
    background-color: $light-grey;

    .details-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;

      .detail {
        border: 1px dashed $grey-6;
        border-radius: 1rem;
        padding: 1rem;

        .detail-title {
          line-height: 1rem;
        }
      }
    }
  }
</style>
