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
    <div class="mb-10 flex items-center justify-between">
      <div class="flex items-center">
        <icon-bar-chart-3 class="mr-6 size-6 text-primary dark:text-primary-light" />
        <typography class="!font-bold">
          Stats
        </typography>
      </div>
    </div>
    <div class="grid h-full grid-cols-2 gap-6 pb-4">
      <div
        v-for="detail in details"
        :key="detail.title"
        class="w-auto rounded-2xl border border-dashed border-gray-400 p-4"
        data-testid="pack-summary-detail">
        <typography
          class="font-bold"
          variant="large">
          {{ detail.title }}
        </typography>
        <typography
          class="font-bold transition-colors duration-300 ease-in-out"
          data-testid="detail-weight"
          :style="{ color: detail.color }"
          variant="large">
          {{ detail.weight || '' }} lbs
        </typography>
      </div>
    </div>
  </div>
</template>
