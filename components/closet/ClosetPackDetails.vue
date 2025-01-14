<script lang='ts' setup>
  import convert from 'convert';
  import round from 'lodash.round';
  import { Theme } from '@/types';

  const $store = useClosetStore();

  const details = reactive([
    { title: 'Worn', weight: 0, color: '' },
    { title: 'Consumable', weight: 0, color: '' },
    { title: 'Base', weight: 0, color: '' },
    { title: 'Total', weight: 0, color: '' },
  ]);
  watchEffect(() => {
    if ($store.data.selectedPack) {
      const weights = calculatePackWeights($store.data.selectedPack);
      const theme = findTheme($store.data.selectedPack.theme as Theme);

      for (let i = 0; i < details.length; i += 1) {
        const detail = details[i];
        const weight = weights[details[i].title.toLowerCase() as keyof typeof weights];
        detail.weight = round(convert(weight, 'mg')
          .to('lb'), 2);
        detail.color = theme[i];
      }
    }
  });
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center mb-10">
      <div class="flex items-center">
        <icon-bar-chart-3 class="h-6 mr-6 text-primary dark:text-primary-light w-6" />
        <typography class="!font-bold">
          Stats
        </typography>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-6 h-full pb-4">
      <div
        v-for="detail in details"
        :key="detail.title"
        class="border border-dashed border-gray-400 p-4 rounded-2xl w-auto"
        data-testid="pack-summary-detail">
        <typography
          class="font-bold"
          variant="large">
          {{ detail.title }}
        </typography>
        <typography
          class="duration-300 ease-snap font-bold transition-colors"
          data-testid="detail-weight"
          :style="{ color: detail.color }"
          variant="large">
          {{ detail.weight || '' }} lbs
        </typography>
      </div>
    </div>
  </div>
</template>
