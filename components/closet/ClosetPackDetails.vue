<script lang='ts' setup>
  import convert from 'convert';
  import round from 'lodash.round';
  import { Theme } from '@/types';

  const $store = useClosetStore();

  const details = reactive([
    { color: '', title: 'Worn', weight: 0 },
    { color: '', title: 'Consumable', weight: 0 },
    { color: '', title: 'Base', weight: 0 },
    { color: '', title: 'Total', weight: 0 },
  ]);
  watchEffect(() => {
    if ($store.data.selectedPack) {
      const weights = calculatePackWeights($store.data.selectedPack);
      const theme = findTheme($store.data.selectedPack.theme as Theme);

      for (let i = 0; i < details.length; i += 1) {
        const detail = details[i];
        if (!detail) continue;
        const weight = weights[detail.title.toLowerCase() as keyof typeof weights];
        detail.weight = round(convert(weight, 'mg')
          .to('lb'), 2);
        detail.color = theme[i] ?? '';
      }
    }
  });
</script>

<template>
  <div class="flex flex-col min-w-0">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <icon-bar-chart-3 class="h-6 mr-4 sm:mr-6 text-primary dark:text-primary-light w-6 shrink-0" />
        <typography class="font-bold!">
          Stats
        </typography>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2 sm:gap-4 h-full pb-4">
      <div
        v-for="detail in details"
        :key="detail.title"
        class="border border-dashed border-gray-400 p-3 sm:p-4 rounded-2xl min-w-0"
        data-testid="pack-summary-detail">
        <typography
          class="font-bold truncate"
          data-testid="detail-title"
          variant="large">
          {{ detail.title }}
        </typography>
        <typography
          class="duration-300 ease-out font-bold transition-colors"
          data-testid="detail-weight"
          :style="{ color: detail.color }"
          variant="large">
          {{ detail.weight || '' }} lbs
        </typography>
      </div>
    </div>
  </div>
</template>
