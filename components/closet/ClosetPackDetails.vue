<script lang='ts' setup>
  import round from 'lodash.round';
  import convert from 'convert';
  import { BarChart3Icon, SettingsIcon } from 'lucide-vue-next';
  import { Theme } from '@/types';

  const $store = useClosetStore();
  const { data, dialogStates } = storeToRefs($store);

  const details = reactive([
    { title: 'Worn', weight: 0, color: '' },
    { title: 'Consumable', weight: 0, color: '' },
    { title: 'Base', weight: 0, color: '' },
    { title: 'Total', weight: 0, color: '' },
  ]);
  watchEffect(() => {
    if (data.value.selectedPack) {
      const weights = calculatePackWeights(data.value.selectedPack);
      const theme = findTheme(data.value.selectedPack.theme as Theme);

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
        <bar-chart-3-icon class="h-6 mr-6 text-primary w-6" />
        <p class="!font-bold text-base">
          Stats
        </p>
      </div>
      <div class="flex pr-8">
        <headless-menu
          as="div"
          class="inline-block relative text-left">
          <div class="bg-primary flex justify-center items-center h-8 rounded-full w-8">
            <headless-menu-button class="duration-150 ease-snap focus-visible:ring-2 focus-visible:ring-white/0 font-medium inline-flex justify-center outline-none focus:outline-none px-0 py-2 rounded-md text-sm text-white">
              <settings-icon class="h-5 w-5 " />
            </headless-menu-button>
          </div>
          <zoom-transition>
            <headless-menu-items class="absolute right-0 bg-white divide-gray-100 divide-y mt-2 origin-top-right ring-1 ring-black/5 rounded-md shadow-lg w-56 z-10 focus:outline-none">
              <headless-menu-item @click="dialogStates.updateThemeModal = true">
                <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-dark-grey hover:bg-gray-100">
                  Change Theme
                </p>
              </headless-menu-item>
            </headless-menu-items>
          </zoom-transition>
        </headless-menu>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-6 h-full pb-4">
      <div
        v-for="detail in details"
        :key="detail.title"
        class="border border-dashed border-gray-400 p-4 rounded-2xl"
        data-testid="pack-summary-detail">
        <span
          class="font-bold text-eyebrow text-grey-8"
          data-testid="detail-title">
          {{ detail.title }}
        </span>
        <h6
          class="duration-300 ease-snap font-bold text-lg transition-colors"
          data-testid="detail-weight"
          :style="{ color: detail.color }">
          {{ detail.weight || '' }} lbs
        </h6>
      </div>
    </div>
  </div>
</template>
