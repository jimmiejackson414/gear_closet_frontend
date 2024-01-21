<script lang='ts' setup>
  import { BarChart } from 'echarts/charts';
  import {
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
  } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import VChart from 'vue-echarts';
  import round from 'lodash.round';
  import { BackpackIcon, BarChart3Icon, SettingsIcon } from 'lucide-vue-next';
  import generateThemeOptions, { findTheme } from '@/utils/chartTheme';
  import { Theme, type Database } from '@/types';
  import convert, { type Mass } from 'convert';
  import type { ExtendedCategory } from '@/types/helpers';

  use([
    CanvasRenderer,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  ]);

  const $appStore = useAppStore();
  const $store = useClosetStore();
  const { data } = storeToRefs($store);

  /**
   * Updates the theme associated with the pack.
   */
  const submitting = ref(false);
  const isChangeThemeModalOpen = ref(false);
  const updateTheme = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: pack, error } = await supabase
        .from('packs')
        .update({ theme: selectedTheme.value })
        .eq('id', data.value.selectedPack?.id as number)
        .select();
      
      if (error || !pack) throw error;
      $appStore.notifyPositive('Successfully updated your pack theme.');
    } catch (error) {
      $appStore.notifyNegative('There was an error updating your pack theme.');
    } finally {
      isChangeThemeModalOpen.value = false;
      submitting.value = false;
    }
  };

  const selectedTheme = ref<Theme | undefined>((data.value.selectedPack?.theme as Theme) || undefined);
  const themeOptions = computed(() => generateThemeOptions());

  /* Bar Chart Options */
  const barChart = ref(null);
  const categoryName = ref('');
  const categoryColor = ref('');
  const details = reactive([
    { title: 'Worn', weight: 0, color: '' },
    { title: 'Consumable', weight: 0, color: '' },
    { title: 'Base', weight: 0, color: '' },
    { title: 'Total', weight: 0, color: '' },
  ]);
  const option = ref({
    // tooltip: {
    //   trigger: 'item',
    //   formatter: '{a} <br/>{b} : {c} ({d}%)',
    // },
    xAxis: {
      type: 'category',
      axisTick: { alignWithLabel: true },
      axisLabel: { rotate: 30 },
      data: data.value.selectedPack?.categories?.map(category => (category?.name ? category.name : 'Unnamed')),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.value.selectedPack?.categories?.map(category => {
          const categoryWeight = calculateCategoryWeight(category as ExtendedCategory);
          return round(convert(categoryWeight, 'mg')
            .to((category as ExtendedCategory).unit as Mass), 2);
        }),
        type: 'bar',
        itemStyle: {
          barBorderRadius: 5,
          color: (params: any) => {
            const theme = findTheme(data.value.selectedPack?.theme as Theme);
            return theme[params.dataIndex];
          },
        },
      },
    ],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: (value: any) => {
        const category = data.value.selectedPack?.categories?.[value.dataIndex];
        console.log({ category });
        const categoryWeight = calculateCategoryWeight(category as ExtendedCategory);
        const weight = round(convert(categoryWeight, 'mg')
          .to('lb'), 2);
        return (
          `<div class="flex flex-col gap-2 w-fit">
            <p class="!font-bold text-base">
              ${category?.name}
            </p>
            <p class="font-bold text-base">
              ${weight} lbs
            </p>
          </div>`
        );
      },
      // formatter: (params: any) => {
      //   console.log({ params });
      //   return (
      //     `<div class="flex gap-2 w-fit">
      //       <span
      //         class="border-1 border-white h-4 rounded-full w-4"
      //         :style="{ backgroundColor: ${params.color} }"></span>
      //       <p class="font-bold text-base">
      //         ${params.name}
      //       </p>
      //       <p class="font-bold text-base">
      //         ${params.value} lbs
      //       </p>
      //     </div>`
      //   );
      // },
    },
  });

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

  // watch for theme change
  watch(() => selectedTheme, () => {
    option.value.series[0].itemStyle.color = (params: any) => {
      const theme = findTheme(selectedTheme.value);
      return theme[params.dataIndex];
    };
  });
</script>

<template>
  <div class="card card-main">
    <div class="grid lg:grid-cols-[60%,40%] grid-cols-1 gap-6 pt-4">
      <div class="flex flex-col">
        <div class="flex items-center">
          <backpack-icon class="h-6 mr-6 text-primary w-6" />
          <p class="!font-bold text-base">
            Pack Summary
          </p>
        </div>
        <div class="h-[200px] lg:h-[375px] mb-4 mt-0 mx-auto w-full">
          <v-chart :option="option" />
        </div>
      </div>
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
                  <headless-menu-item @click="isChangeThemeModalOpen = true">
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
            class="border border-dashed border-gray-400 p-4 rounded-2xl">
            <span class="font-bold text-eyebrow text-grey-8">
              {{ detail.title }}
            </span>
            <h6
              class="font-bold text-lg"
              :style="{ color: detail.color }">
              {{ detail.weight || '' }} lbs
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
  

  <gc-modal
    :is-open="isChangeThemeModalOpen"
    size="sm"
    title="Change Theme"
    @handle-cancel="isChangeThemeModalOpen = false">
    <template #default>
      <div class="flex flex-col">
        <p class="mb-4 text-base">
          Change the theme associated with your pack.
        </p>
        <gc-select
          :disabled="submitting"
          label="Theme"
          :model-value="selectedTheme"
          :options="themeOptions"
          @update:model-value="(value: Theme) => selectedTheme = value">
          <template #option="{ option }">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <span
                  v-for="color in (option as Option).colors"
                  :key="color"
                  class="border-1 border-white h-4 rounded-[3px] w-4"
                  :style="{ backgroundColor: color }" />
              </div>
              <p class="text-base">
                {{ option.label }}
              </p>
            </div>
          </template>
        </gc-select>
      </div>
    </template>
    <template #actions>
      <div class="flex justify-end items-center gap-4 w-full">
        <gc-button
          :disabled="submitting"
          label="Cancel"
          size="sm"
          variant="secondary"
          @click="isChangeThemeModalOpen = false" />
        <gc-button
          :disabled="submitting"
          label="Update"
          :loading="submitting"
          size="sm"
          @click="updateTheme" />
      </div>
    </template>
  </gc-modal>
</template>
