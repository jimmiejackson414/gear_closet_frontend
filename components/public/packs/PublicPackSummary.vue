<script lang='ts' setup>
  import VChart from 'vue-echarts';
  import convert, { type Mass } from 'convert';
  import { BarChart } from 'echarts/charts';
  import {
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
  } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import round from 'lodash.round';
  import { Theme } from '@/types';
  import { findTheme } from '@/utils/chartTheme';
  import type { ExtendedCategory, PublicPack } from '@/types/helpers';
  import type { EChartsOption } from 'echarts';

  use([
    CanvasRenderer,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  ]);

  interface Props {
    pack?: PublicPack;
  }

  const props = defineProps<Props>();

  /* Bar Chart Options */
  const chartRef = ref<InstanceType<typeof VChart> | null>(null);
  const details = computed(() => {
    const initialDetails = [
      { color: '', title: 'Worn', weight: 0 },
      { color: '', title: 'Consumable', weight: 0 },
      { color: '', title: 'Base', weight: 0 },
      { color: '', title: 'Total', weight: 0 },
    ];
    if (!props.pack) return initialDetails;
    const weights = calculatePackWeights(props.pack);
    const theme = findTheme(props.pack.theme as Theme);
    for (let i = 0; i < initialDetails.length; i += 1) {
      const detail = initialDetails[i];
      const weight = weights[initialDetails[i].title.toLowerCase() as keyof typeof weights];
      detail.weight = round(convert(weight, 'mg')
        .to('lb'), 2);
      detail.color = theme[i];
    }
    return initialDetails;
  });
  const chartOptions = ref<EChartsOption>({
    animationDuration: 300,
    grid: { show: false },
    series: [
      {
        data: props.pack?.categories?.map(category => {
          const categoryWeight = calculateCategoryWeight(category as ExtendedCategory);
          return round(convert(categoryWeight, 'mg')
            .to((category as ExtendedCategory).unit as Mass), 2);
        }),
        itemStyle: {
          borderRadius: 5,
          color: (params: any) => {
            const theme = findTheme(props.pack?.theme as Theme);
            return theme[params.dataIndex];
          },
        },
        type: 'bar',
      },
    ],
    tooltip: {
      formatter: (value: any) => {
        const category = props.pack?.categories?.[value.dataIndex];
        const categoryWeight = calculateCategoryWeight(category as ExtendedCategory);
        const weight = round(convert(categoryWeight, 'mg')
          .to('lb'), 2);
        return (`
          <div class="flex flex-col gap-2 w-fit">
            <p class="text-eyebrow !text-sm">
              <span style="margin-right: 4px; display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${value.color};"></span>
              ${category?.name}
            </p>
            <p class="!font-bold text-base-lg text-center">
              ${weight} lbs
            </p>
          </div>
        `);
      },
      show: true,
      trigger: 'item',
    },
    xAxis: {
      axisLabel: { margin: 24, overflow: 'break', rotate: 30, width: 100 },
      axisTick: { alignWithLabel: true },
      data: props.pack?.categories?.map(category => (category?.name ? category.name : 'Unnamed')),
      type: 'category',
    },
    yAxis: {
      axisLabel: {
        formatter: (value: any) => {
          const weight = round(convert(value as number, 'g')
            .to('lb'));
          return `${weight} lbs`;
        },
      },
      splitLine: { show: false },
      type: 'value',
    },
  });
</script>

<template>
  <div class="flex lg:flex-row flex-col gap-6 pt-4">
    <div class="flex flex-col lg:w-3/5">
      <div class="flex items-center">
        <icon-backpack class="h-6 mr-6 text-primary w-6" />
        <p class="!font-bold text-base">
          Pack Summary
        </p>
      </div>
      <div class="h-[20vh] lg:h-[30vh] mb-4 mt-0 mx-auto w-full">
        <client-only>
          <v-chart
            ref="chartRef"
            :autoresize="true"
            :option="chartOptions" />
        </client-only>
      </div>
    </div>
    <div class="flex flex-col lg:w-2/5">
      <div class="flex justify-between items-center mb-10">
        <div class="flex items-center">
          <icon-bar-chart-3 class="h-6 mr-6 text-primary w-6" />
          <p class="!font-bold text-base">
            Stats
          </p>
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
            class="duration-300 ease-snap font-bold text-lg transition-colors"
            :style="{ color: detail.color }">
            {{ detail.weight || '' }} lbs
          </h6>
        </div>
      </div>
    </div>
  </div>
</template>
