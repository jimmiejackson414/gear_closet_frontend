<script lang='ts' setup>
  import VChart from 'vue-echarts';
  import convert from 'convert';
  import { PieChart } from 'echarts/charts';
  import { GridComponent, LegendComponent, PolarComponent, TitleComponent, TooltipComponent } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import round from 'lodash.round';
  import { findTheme } from '@/utils/chartTheme';
  import type { Theme } from '@/types';
  import type { ExtendedCategory } from '@/types/closet';
  import type { EChartsOption } from 'echarts';
  import type { CallbackDataParams, TopLevelFormatterParams } from 'echarts/types/dist/shared';

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
  const $userStore = useUserStore();
  const sessionUser = useSupabaseUser();

  const currentUserId = computed(() =>
    sessionUser.value?.sub ?? $userStore.profile?.id);

  const viewingOwnPack = computed(() =>
    !$store.viewedPackProfileId
    || $store.viewedPackProfileId === currentUserId.value);

  const displayedPack = computed(() => {
    const pack = viewingOwnPack.value
      ? $store.data.pack
      : $store.data.party_packs.find(party =>
        party.profile_id === $store.viewedPackProfileId)?.pack ?? undefined;
    if (!pack || Array.isArray(pack) || typeof pack !== 'object') return undefined;
    return pack;
  });

  const viewedPackOwnerLabel = computed(() => {
    if (viewingOwnPack.value) return 'your pack';
    const party = $store.data.party_packs.find(item =>
      item.profile_id === $store.viewedPackProfileId);
    return party?.display_name || 'this pack';
  });

  const canManagePack = computed(() =>
    $store.canEditSelectedTrip && viewingOwnPack.value);

  const modalState = ref<'insert' | 'update' | undefined>(undefined);
  const isAddPackModalOpen = ref(false);

  /*
  * Update Theme associated with the pack
  */
  const isChangeThemeModalOpen = ref(false);
  const updateTheme = (theme: Theme) => {
    try {
      chartRef.value?.setOption?.({
        series: [{
          itemStyle: {
            color: (params: CallbackDataParams) => {
              const foundTheme = findTheme(theme);
              return foundTheme[params.dataIndex % theme.length];
            },
          },
        }],
      });
    } catch {
      $appStore.notifyNegative('There was an error updating your pack theme.');
    } finally {
      isChangeThemeModalOpen.value = false;
    }
  };

  /* Donut Chart Options — stable base; series/legend/theme via setOption */
  const legendTextColor = ref('');
  const chartRef = ref<InstanceType<typeof VChart> | undefined>(undefined);
  const chartOptions = ref<EChartsOption>({
    animationDuration: 300,
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: {
        color: legendTextColor.value,
      },
      data: [],
    },
    grid: {
      bottom: '30%',
    },
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
        data: [],
        label: { show: false },
        itemStyle: {
          borderRadius: 8,
          borderColor: 'white',
          borderWidth: 2,
          color: (params: CallbackDataParams) => {
            const theme = findTheme(displayedPack.value?.theme as Theme);
            return theme[params.dataIndex % theme.length] ?? '';
          },
        },
      },
    ],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: (params: TopLevelFormatterParams) => {
        // Trigger is 'item', but the callback type still allows the array form.
        const value = Array.isArray(params) ? params[0] : params;
        const category = value ? displayedPack.value?.categories?.[value.dataIndex] : undefined;
        const categoryWeight = calculateCategoryWeight(category as ExtendedCategory);
        const weight = round(convert(categoryWeight, 'mg')
          .to('lb'), 2);
        return (`
          <div class="flex flex-col gap-2 w-fit">
            <p class="text-eyebrow text-sm!">
              <span style="margin-right: 4px; display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${value?.color};"></span>
              ${category?.name}
            </p>
            <p class="font-bold! text-base-lg text-center">
              ${weight} lbs
            </p>
          </div>
        `);
      },
    },
  });

  const applyPackSeries = () => {
    const categories = displayedPack.value?.categories ?? [];
    const seriesData = categories.map(category => ({
      name: category.name ?? 'Unnamed',
      value: calculateCategoryWeight({
        ...category,
        category_items: category.category_items ?? [],
      } as ExtendedCategory),
    }));
    chartRef.value?.setOption?.({
      legend: {
        data: categories.map(category => ({
          name: category.name as string,
          textStyle: {
            overflow: 'truncate',
            width: 180,
          },
        })),
      },
      series: [{
        data: seriesData,
        itemStyle: {
          color: (params: CallbackDataParams) => {
            const theme = findTheme(displayedPack.value?.theme as Theme);
            return theme[params.dataIndex % (theme.length || 1)] ?? '';
          },
        },
      }],
    });
  };

  const schedulePackSeries = async () => {
    await nextTick();
    applyPackSeries();
  };

  /**
   * Dynamically update the legend text color based on the current theme.
   */
  const updateLegendTextColor = async () => {
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    legendTextColor.value = await hslVarToHex('hsl(var(--text))');

    chartRef.value?.setOption?.({
      legend: {
        textStyle: {
          color: legendTextColor.value,
        },
      },
    });
  };

  updateLegendTextColor();

  const colorMode = useColorMode();
  watch(() => colorMode?.value, () => {
    void updateLegendTextColor();
  });

  watch(() => displayedPack.value?.theme, (newTheme) => {
    chartRef.value?.setOption?.({
      series: [{
        itemStyle: {
          color: (params: CallbackDataParams) => {
            const theme = findTheme(newTheme as Theme);
            return theme[params.dataIndex % (theme.length || 1)] ?? '';
          },
        },
      }],
    });
  });

  watch(() => displayedPack.value?.categories, () => {
    void schedulePackSeries();
  }, { deep: true, immediate: true });

  watch(chartRef, (chart) => {
    if (chart) void schedulePackSeries();
  }, { flush: 'post' });

  watch(() => $store.pageLoading, (loading) => {
    if (!loading) void schedulePackSeries();
  });
</script>

<template>
  <card class="px-4 sm:px-8 py-4 rounded-3xl">
    <div class="flex flex-wrap justify-between items-center gap-2 py-4">
      <div class="flex items-center gap-2 sm:gap-4 min-w-0">
        <icon-backpack class="mr-2 w-6 h-6 text-primary shrink-0" />
        <p class="font-bold! text-base shrink-0">
          Pack
        </p>
        <button-root
          v-if="!viewingOwnPack"
          data-testid="pack-widget-my-pack"
          size="sm"
          type="button"
          variant="outline"
          @click="$store.viewTripPack()">
          My pack
        </button-root>
      </div>
      <div
        v-if="displayedPack"
        class="flex items-center gap-2">
        <button-root
          v-if="displayedPack.slug"
          as-child
          size="sm"
          variant="outline">
          <nuxt-link
            data-testid="pack-widget-view-full"
            :to="{ name: 'p-packs-slug', params: { slug: displayedPack.slug } }">
            View full pack
          </nuxt-link>
        </button-root>
        <dropdown-menu v-if="canManagePack">
          <dropdown-menu-trigger>
            <icon-ellipsis-vertical class="w-6 h-6" />
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
    <gc-empty-state v-else-if="!displayedPack && !$store.pageLoading">
      <p class="mb-4 text-base">
        {{ viewingOwnPack ? "You haven't added a pack to this trip yet!" : 'This person has not added a pack to this trip yet.' }}
      </p>
      <button-root
        v-if="canManagePack"
        size="sm"
        variant="outline"
        @click="[modalState = 'insert', isAddPackModalOpen = true]">
        Add a pack
      </button-root>
    </gc-empty-state>
    <div v-else-if="displayedPack">
      <h5 class="text-base-lg">
        Selected Pack:
        <span class="font-black">{{ displayedPack?.name }}</span>
        <span
          v-if="!viewingOwnPack"
          class="ml-1 text-muted-foreground font-normal">
          ({{ viewedPackOwnerLabel }})
        </span>
      </h5>
      <div class="mx-auto mt-0 mb-4 w-full h-100">
        <client-only>
          <v-chart
            :key="displayedPack?.id ?? 'pack-chart'"
            ref="chartRef"
            :autoresize="true"
            :option="chartOptions" />
        </client-only>
      </div>
    </div>
  </card>

  <!-- Add or Update a Pack Modal -->
  <lazy-change-pack-dialog
    v-if="isAddPackModalOpen"
    :is-open="isAddPackModalOpen"
    :state="modalState"
    @on-close="isAddPackModalOpen = false" />

  <!-- Change Theme Modal -->
  <lazy-change-pack-theme-dialog
    v-if="isChangeThemeModalOpen"
    :is-open="isChangeThemeModalOpen"
    @on-close="isChangeThemeModalOpen = false"
    @update-theme="updateTheme" />
</template>
