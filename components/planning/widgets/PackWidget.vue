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

  if (import.meta.client) {
    use([
      CanvasRenderer,
      GridComponent,
      PieChart,
      PolarComponent,
      TitleComponent,
      LegendComponent,
      TooltipComponent,
    ]);
  }

  const $store = usePlanningStore();
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
  const updateTheme = (_theme: Theme) => {
    isChangeThemeModalOpen.value = false;
  };

  const packCategories = computed(() => displayedPack.value?.categories ?? []);
  const packSeriesData = computed(() => packCategories.value.map(category => ({
    name: category.name ?? 'Unnamed',
    value: calculateCategoryWeight({
      ...category,
      category_items: category.category_items ?? [],
    } as ExtendedCategory),
  })));

  /* Donut Chart Options — series/legend live in the option so vue-echarts 8 can apply them */
  const legendTextColor = ref('');
  const chartOptions = computed<EChartsOption>(() => ({
    animationDuration: 300,
    grid: {
      bottom: '30%',
    },
    legend: {
      data: packCategories.value.map(category => ({
        name: category.name as string,
        textStyle: {
          overflow: 'truncate',
          width: 180,
        },
      })),
      left: 'left',
      orient: 'vertical',
      textStyle: {
        color: legendTextColor.value,
      },
      top: 'center',
    },
    media: [
      {
        option: {
          grid: {
            bottom: '20%',
          },
          legend: {
            left: 'center',
            orient: 'horizontal',
            top: 'bottom',
          },
          series: [
            {
              center: ['50%', '40%'],
              radius: ['40%', '120%'],
            },
          ],
        },
        query: {
          maxWidth: 600,
        },
      },
    ],
    series: [
      {
        center: ['80%', '50%'],
        data: packSeriesData.value,
        height: '100%',
        itemStyle: {
          borderColor: 'white',
          borderRadius: 8,
          borderWidth: 2,
          color: (params: CallbackDataParams) => {
            const theme = findTheme(displayedPack.value?.theme as Theme);
            return theme[params.dataIndex % (theme.length || 1)] ?? '';
          },
        },
        label: { show: false },
        left: 'center',
        name: 'Pack Categories',
        radius: ['40%', '90%'],
        type: 'pie',
      },
    ],
    tooltip: {
      formatter: (params: TopLevelFormatterParams) => {
        const value = Array.isArray(params) ? params[0] : params;
        const category = value ? displayedPack.value?.categories?.[value.dataIndex] : undefined;
        const categoryWeight = calculateCategoryWeight({
          ...(category as ExtendedCategory),
          category_items: category?.category_items ?? [],
        });
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
      show: true,
      trigger: 'item',
    },
  }));

  /**
   * Dynamically update the legend text color based on the current theme.
   */
  const updateLegendTextColor = async () => {
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    legendTextColor.value = await hslVarToHex('hsl(var(--text))');
  };

  updateLegendTextColor();

  const colorMode = useColorMode();
  watch(() => colorMode?.value, () => {
    void updateLegendTextColor();
  });
</script>

<template>
  <card class="px-4 sm:px-8 py-4 rounded-3xl">
    <div class="flex flex-wrap justify-between items-center gap-2 py-4">
      <div class="flex items-center gap-2 sm:gap-4 min-w-0">
        <icon-backpack class="mr-2 w-6 h-6 text-primary shrink-0" />
        <typography class="font-bold! shrink-0">
          Pack
        </typography>
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
          v-if="!viewingOwnPack && displayedPack.slug"
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
      <typography class="mb-4">
        {{ viewingOwnPack ? "You haven't added a pack to this trip yet!" : 'This person has not added a pack to this trip yet.' }}
      </typography>
      <button-root
        v-if="canManagePack"
        size="sm"
        variant="outline"
        @click="[modalState = 'insert', isAddPackModalOpen = true]">
        Add a pack
      </button-root>
    </gc-empty-state>
    <div v-else-if="displayedPack">
      <typography class="text-base-lg">
        Selected Pack:
        <span class="font-black">{{ displayedPack?.name }}</span>
        <span
          v-if="!viewingOwnPack"
          class="ml-1 text-muted-foreground font-normal">
          ({{ viewedPackOwnerLabel }})
        </span>
      </typography>
      <div class="mx-auto mt-0 mb-4 w-full h-100">
        <client-only>
          <v-chart
            :key="displayedPack?.id ?? 'pack-chart'"
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
