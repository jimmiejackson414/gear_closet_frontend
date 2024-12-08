<script lang='ts' setup>
  import convert, { type Mass } from 'convert';
  import type { EChartsOption } from 'echarts';
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
  import VChart from 'vue-echarts';
  import { Theme } from '@/types';
  import type { ExtendedCategory } from '@/types/helpers';

  use([
    CanvasRenderer,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  ]);

  const $store = useClosetStore();
  const { data } = storeToRefs($store);

  /* Bar Chart Options */
  const chartRef = ref<InstanceType<typeof VChart> | undefined>(undefined);
  const chartOptions = ref<EChartsOption>({
    animationDuration: 300,
    xAxis: {
      type: 'category',
      axisTick: { alignWithLabel: true },
      axisLabel: { rotate: 30, overflow: 'break', width: 100, margin: 24 },
      data: data.value.selectedPack?.categories?.map(category => (category?.name ? category.name : 'Unnamed')),
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: {
        formatter: (value: any) => {
          const weight = round(convert(value as number, 'g')
            .to('lb'));
          return `${weight} lbs`;
        },
      },
    },
    grid: { show: false },
    series: [
      {
        data: data.value.selectedPack?.categories?.map(category => {
          const categoryWeight = calculateCategoryWeight(category as ExtendedCategory);
          return round(convert(categoryWeight, 'mg')
            .to((category as ExtendedCategory).unit as Mass), 2);
        }),
        type: 'bar',
        itemStyle: {
          borderRadius: 5,
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
    },
  });

  watch(() => data.value.selectedPack?.theme, (newTheme) => {
    chartRef.value?.setOption({
      series: [{
        itemStyle: {
          color: (params: any) => {
            const theme = findTheme(newTheme as Theme);
            return theme[params.dataIndex];
          },
        },
      }],
    });
  });
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <icon-backpack class="h-6 mr-6 text-primary dark:text-primary-light w-6" />
      <typography class="!font-bold">
        Pack Summary
      </typography>
    </div>
    <div class="h-[200px] lg:h-[375px] mb-4 mt-0 w-auto">
      <client-only>
        <v-chart
          ref="chartRef"
          :autoresize="true"
          :option="chartOptions" />
      </client-only>
    </div>
  </div>
</template>
