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
    grid: { show: false },
    series: [
      {
        data: $store.data.selectedPack?.categories?.map(category => calculateCategoryWeight(category as ExtendedCategory)),
        itemStyle: {
          borderRadius: 5,
          color: (params: any) => {
            const theme = findTheme($store.data.selectedPack?.theme as Theme);
            const extendedTheme = Array.from({ length: $store.data.selectedPack?.categories?.length || 0 }, (_, i) => theme[i % theme.length]);
            return extendedTheme[params.dataIndex];
          },
        },
        type: 'bar',
      },
    ],
    tooltip: {
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
      show: true,
      trigger: 'item',
    },
    xAxis: {
      axisLabel: { margin: 24, overflow: 'break', rotate: 30, width: 100 },
      axisLine: { lineStyle: { color: legendTextColor.value } },
      axisTick: { alignWithLabel: true },
      data: $store.data.selectedPack?.categories?.map(category => (category?.name ? category.name : 'Unnamed')),
      type: 'category',
    },
    yAxis: {
      axisLabel: { formatter: (value: any) => `${value} lbs` },
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
      series: [{
        data: $store.data.selectedPack?.categories?.map(category => calculateCategoryWeight(category as ExtendedCategory)),
      }],
      xAxis: {
        data: $store.data.selectedPack?.categories?.map(category => (category?.name ? category.name : 'Unnamed')),
      },
    });
  }, { deep: true, immediate: true });
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
