<script lang='ts' setup>
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

  /** Derived series in lbs — avoid deep-watching nested category edits. */
  const seriesData = computed(() =>
    ($store.data.selectedPack?.categories ?? []).map((category) => ({
      name: category?.name ? category.name : 'Unnamed',
      weight: calculateCategoryWeightInUnit(category as ExtendedCategory, 'lb'),
    })),
  );

  /* Bar Chart Options */
  const legendTextColor = ref('');
  const chartRef = ref<InstanceType<typeof VChart> | undefined>(undefined);
  const chartOptions = ref<EChartsOption>({
    animationDuration: 300,
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: legendTextColor.value } },
      axisTick: { alignWithLabel: true },
      axisLabel: { rotate: 30, overflow: 'break', width: 100, margin: 24 },
      data: seriesData.value.map((d) => d.name),
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: { formatter: (value: any) => `${value} lbs` },
    },
    grid: { show: false },
    series: [
      {
        data: seriesData.value.map((d) => d.weight),
        type: 'bar',
        itemStyle: {
          borderRadius: 5,
          color: (params: any) => {
            const theme = findTheme($store.data.selectedPack?.theme as Theme);
            return theme[params.dataIndex % theme.length] ?? '';
          },
        },
      },
    ],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: (value: any) => {
        const point = seriesData.value[value.dataIndex];
        return (`
          <div class="flex flex-col gap-2 w-fit">
            <p class="text-eyebrow text-sm!">
              <span style="margin-right: 4px; display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${value.color};"></span>
              ${point?.name ?? ''}
            </p>
            <p class="font-bold! text-base-lg text-center">
              ${point?.weight ?? 0} lbs
            </p>
          </div>
        `);
      },
    },
  });

  /**
   * Dynamically update the legend text color based on the current theme.
   */
  const updateLegendTextColor = async () => {
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    legendTextColor.value = await hslVarToHex('hsl(var(--card-foreground))');

    chartRef.value?.setOption({
      xAxis: {
        axisLine: { lineStyle: { color: legendTextColor.value } },
      },
      yAxis: {
        axisLine: { lineStyle: { color: legendTextColor.value } },
      },
    });
  };

  updateLegendTextColor();

  const colorMode = useColorMode();
  watch(() => colorMode.value, () => updateLegendTextColor());

  watch(() => $store.data.selectedPack?.theme, (newTheme) => {
    chartRef.value?.setOption({
      series: [{
        itemStyle: {
          color: (params: any) => {
            const theme = findTheme(newTheme as Theme);
            return theme[params.dataIndex % theme.length] ?? '';
          },
        },
      }],
    });
  });

  watch(seriesData, (data) => {
    chartRef.value?.setOption({
      xAxis: {
        data: data.map((d) => d.name),
      },
      series: [{
        data: data.map((d) => d.weight),
      }],
    });
  });
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <icon-backpack class="mr-6 w-6 h-6 text-primary dark:text-primary-light" />
      <typography class="font-bold!">
        Pack Summary
      </typography>
    </div>
    <div class="mt-0 mb-4 w-auto h-50 lg:h-93.75">
      <client-only>
        <v-chart
          ref="chartRef"
          :autoresize="true"
          :option="chartOptions" />
      </client-only>
    </div>
  </div>
</template>
