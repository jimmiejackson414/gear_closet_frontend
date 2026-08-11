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
      data: $store.data.selectedPack?.categories?.map(category => (category?.name ? category.name : 'Unnamed')),
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: { formatter: (value: any) => `${value} lbs` },
    },
    grid: { show: false },
    series: [
      {
        data: $store.data.selectedPack?.categories?.map(category => calculateCategoryWeight(category as ExtendedCategory)),
        type: 'bar',
        itemStyle: {
          borderRadius: 5,
          color: (params: any) => {
            const theme = findTheme($store.data.selectedPack?.theme as Theme);
            const extendedTheme = Array.from({ length: $store.data.selectedPack?.categories?.length || 0 }, (_, i) => theme[i % theme.length]);
            return extendedTheme[params.dataIndex];
          },
        },
      },
    ],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: (value: any) => {
        const category = $store.data.selectedPack?.categories?.[value.dataIndex];
        const weight = calculateCategoryWeight(category as ExtendedCategory);
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
  watch(() => colorMode.value, () => updateLegendTextColor(), { immediate: true });

  watch(() => $store.data.selectedPack?.theme, (newTheme) => {
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

  watch(() => $store.data.selectedPack?.categories, () => {
    chartRef.value?.setOption({
      xAxis: {
        data: $store.data.selectedPack?.categories?.map(category => (category?.name ? category.name : 'Unnamed')),
      },
      series: [{
        data: $store.data.selectedPack?.categories?.map(category => calculateCategoryWeight(category as ExtendedCategory)),
      }],
    });
  }, { deep: true, immediate: true });
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <icon-backpack class="mr-6 w-6 h-6 text-primary dark:text-primary-light" />
      <typography class="!font-bold">
        Pack Summary
      </typography>
    </div>
    <div class="mt-0 mb-4 w-auto h-[200px] lg:h-[375px]">
      <client-only>
        <v-chart
          ref="chartRef"
          :autoresize="true"
          :option="chartOptions" />
      </client-only>
    </div>
  </div>
</template>
