<script lang='ts' setup>
  import convert from 'convert';
  import type { EChartsOption } from 'echarts';
  import { PieChart } from 'echarts/charts';
  import { GridComponent, LegendComponent, PolarComponent, TitleComponent, TooltipComponent } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import round from 'lodash.round';
  import VChart from 'vue-echarts';
  import type { Theme } from '@/types';
  import type { ExtendedCategory } from '@/types/helpers';
  import { findTheme } from '@/utils/chartTheme';

  use([
    CanvasRenderer,
    GridComponent,
    PieChart,
    PolarComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
  ]);

  const $store = usePlanningStore();
  const $appStore = useAppStore();

  const modalState = ref<'insert' | 'update' | undefined>(undefined);
  const isAddPackModalOpen = ref(false);

  /*
  * Update Theme associated with the pack
  */
  const isChangeThemeModalOpen = ref(false);
  const updateTheme = (theme: Theme) => {
    try {
      chartRef.value?.setOption({
        series: [{
          itemStyle: {
            color: (params: any) => {
              const foundTheme = findTheme(theme);
              return foundTheme[params.dataIndex % theme.length];
            },
          },
        }],
      });
    } catch (error) {
      $appStore.notifyNegative('There was an error updating your pack theme.');
    } finally {
      isChangeThemeModalOpen.value = false;
    }
  };

  /* Donut Chart Options */
  const legendTextColor = ref('');
  const chartRef = ref<typeof VChart | null>(null);
  const chartOptions = computed<EChartsOption>({
    get () {
      return {
        animationDuration: 300,
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center',
          textStyle: {
            color: legendTextColor.value,
          },
          data: $store.data.pack?.categories?.map(c => ({
            name: c.name as string,
            textStyle: {
              overflow: 'truncate',
              width: 180,
            },
          })),
        },
        grid: {
          bottom: '30%',
        },
        loading: $store.pageLoading,
        media: [
          {
            query: {
              maxWidth: 600,
            },
            option: {
              legend: {
                orient: 'horizontal',
                left: 'center',
                top: 'bottom',
              },
              grid: {
                bottom: '20%',
              },
              series: [
                {
                  center: ['50%', '40%'],
                  radius: ['40%', '120%'],
                },
              ],
            },
          },
        ],
        series: [
          {
            name: 'Pack Categories',
            type: 'pie',
            radius: ['40%', '90%'],
            center: ['80%', '50%'],
            left: 'center',
            height: '100%',
            data: $store.data.pack?.categories?.map(c => ({
              name: c.name,
              value: calculateCategoryWeight(c as ExtendedCategory),
            })) as { name: string, value: number }[],
            label: { show: false },
            itemStyle: {
              borderRadius: 8,
              borderColor: 'white',
              borderWidth: 2,
              color: (params: any) => {
                const theme = findTheme($store.data.pack?.theme as Theme);
                return theme[params.dataIndex % theme.length];
              },
            },
          },
        ],
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: (value: any) => {
            const category = $store.data.pack?.categories?.[value.dataIndex];
            const categoryWeight = calculateCategoryWeight(category as ExtendedCategory);
            const weight = round(convert(categoryWeight, 'mg')
              .to('lb'), 2);
            return (`
              <div class="flex flex-col gap-2 w-fit">
                <p class="text-eyebrow text-sm!">
                  <span style="margin-right: 4px; display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${value.color};"></span>
                  ${category?.name}
                </p>
                <p class="font-bold! text-base-lg text-center">
                  ${weight} lbs
                </p>
              </div>
            `);
          },
        },
      };
    },
    set () {
      // chartRef.value?.setOption(newOptions);
    },
  });

  /**
   * Dynamically update the legend text color based on the current theme.
   */
  const updateLegendTextColor = async () => {
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    legendTextColor.value = await hslVarToHex('hsl(var(--text))');
  };

  updateLegendTextColor();

  const colorMode = useColorMode();
  watch(() => colorMode.value, () => updateLegendTextColor());
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center">
        <icon-backpack class="h-6 mr-6 text-primary w-6" />
        <p class="font-bold! text-base">
          Pack
        </p>
      </div>
      <div
        v-if="$store.data.pack"
        class="flex">
        <dropdown-menu>
          <dropdown-menu-trigger>
            <icon-ellipsis-vertical class="h-6 w-6" />
          </dropdown-menu-trigger>
          <dropdown-menu-content>
            <dropdown-menu-label>
              Actions
            </dropdown-menu-label>
            <dropdown-menu-separator />
            <dropdown-menu-item @select="[modalState = 'update', isAddPackModalOpen = true]">
              Change Pack
            </dropdown-menu-item>
            <dropdown-menu-item @select="isChangeThemeModalOpen = true">
              Update Theme Colors
            </dropdown-menu-item>
          </dropdown-menu-content>
        </dropdown-menu>
      </div>
    </div>
    <gc-skeleton v-if="$store.pageLoading" />
    <gc-empty-state v-else-if="!$store.data.pack && !$store.pageLoading">
      <p class="mb-4 text-base">
        You haven't added a pack to this trip yet!
      </p>
      <button-root
        size="sm"
        variant="outline"
        @click="[modalState = 'insert', isAddPackModalOpen = true]">
        Add a pack
      </button-root>
    </gc-empty-state>
    <div v-else>
      <h5 class="text-base-lg">
        Selected Pack:
        <span class="font-black">{{ $store.data.pack?.name }}</span>
      </h5>
      <div class="h-[400px] mb-4 mt-0 mx-auto w-full">
        <client-only>
          <v-chart
            ref="chartRef"
            :autoresize="true"
            :option="chartOptions" />
        </client-only>
      </div>
    </div>
  </card>

  <!-- Add or Update a Pack Modal -->
  <lazy-change-pack-dialog
    :is-open="isAddPackModalOpen"
    :state="modalState"
    @on-close="isAddPackModalOpen = false" />

  <!-- Change Theme Modal -->
  <lazy-change-pack-theme-dialog
    :is-open="isChangeThemeModalOpen"
    @on-close="isChangeThemeModalOpen = false"
    @update-theme="updateTheme" />
</template>
