<script lang='ts' setup>
  import VChart from 'vue-echarts';
  import { BarChart } from 'echarts/charts';
  import {
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
  } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { Theme } from '@/types';
  import type { ExtendedCategory } from '@/types/closet';
  import type { EChartsOption } from 'echarts';
  import type { CallbackDataParams, TopLevelFormatterParams } from 'echarts/types/dist/shared';

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
    grid: {
      bottom: 8,
      containLabel: true,
      left: 8,
      right: 12,
      show: false,
      top: 8,
    },
    series: [
      {
        data: seriesData.value.map((d) => d.weight),
        itemStyle: {
          borderRadius: 5,
          color: (params: CallbackDataParams) => {
            const theme = findTheme($store.data.selectedPack?.theme as Theme);
            return theme[params.dataIndex % theme.length] ?? '';
          },
        },
        type: 'bar',
      },
    ],
    tooltip: {
      formatter: (params: TopLevelFormatterParams) => {
        // Trigger is 'item', but the callback type still allows the array form.
        const value = Array.isArray(params) ? params[0] : params;
        const point = value ? seriesData.value[value.dataIndex] : undefined;
        return (`
          <div class="flex flex-col gap-2 w-fit">
            <p class="text-eyebrow text-sm!">
              <span style="margin-right: 4px; display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${value?.color};"></span>
              ${point?.name ?? ''}
            </p>
            <p class="font-bold! text-base-lg text-center">
              ${point?.weight ?? 0} lbs
            </p>
          </div>
        `);
      },
      show: true,
      trigger: 'item',
    },
    xAxis: {
      axisLabel: { margin: 24, overflow: 'break', rotate: 30, width: 100 },
      axisLine: { lineStyle: { color: legendTextColor.value } },
      axisTick: { alignWithLabel: true },
      data: seriesData.value.map((d) => d.name),
      type: 'category',
    },
    yAxis: {
      axisLabel: { formatter: (value: number) => `${value} lbs` },
      splitLine: { show: false },
      type: 'value',
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
          color: (params: CallbackDataParams) => {
            const theme = findTheme(newTheme as Theme);
            return theme[params.dataIndex % theme.length] ?? '';
          },
        },
      }],
    });
  });

  watch(seriesData, (data) => {
    chartRef.value?.setOption({
      series: [{
        data: data.map((d) => d.weight),
      }],
      xAxis: {
        data: data.map((d) => d.name),
      },
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
    <div class="mt-0 mb-4 w-auto h-80 lg:h-93.75">
      <client-only>
        <v-chart
          ref="chartRef"
          :autoresize="true"
          :option="chartOptions" />
      </client-only>
    </div>
  </div>
</template>
