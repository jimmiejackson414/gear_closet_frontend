<script lang='ts' setup>
  import convert from 'convert';
  import type { EChartsOption } from 'echarts';
  import { PieChart } from 'echarts/charts';
  import { GridComponent, LegendComponent, PolarComponent, TitleComponent, TooltipComponent } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import round from 'lodash.round';
  import VChart from 'vue-echarts';
  import type { Database, Theme } from '@/types';
  import type { ExtendedCategory, ExtendedPack, SelectOption } from '@/types/helpers';
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
  const { data, pageLoading, selectedTripId } = storeToRefs($store);

  const modalState = ref<'insert' | 'update' | undefined>(undefined);
  const submitting = ref(false);
  const fetchingPacks = ref(false);
  const selectedPackId = ref<number | undefined>(undefined);
  const packOptions = ref<SelectOption[]>([]);

  // watch data.pack and set selectedPackId.value to the pack id
  watch(() => data.value.pack, (newValue) => {
    if (newValue) {
      selectedPackId.value = newValue.id;
    }
  }, { immediate: true });

  /**
   * Fetches packs for the current user.
   */
  const fetchPacks = async () => {
    fetchingPacks.value = true;
    try {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: packs, error } = await supabase
        .from('packs')
        .select('*')
        .eq('profile_id', user.value?.id as string);

      if (packs?.length && !error) {
        packOptions.value = packs.map(p => ({
          label: p.name as string,
          value: p.id as number,
        }));
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error fetching packs.');
    } finally {
      fetchingPacks.value = false;
    }
  };

  const isAddPackModalOpen = ref(false);
  watch(isAddPackModalOpen, async (newValue) => {
    if (newValue) {
      await fetchPacks();
    }
  });

  /**
   * Fetches the trip pack.
   */
  const fetchTripPack = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: pack, error } = await supabase
        .from('packs')
        .select(
          `
          *,
          categories(*,
            category_items(*,
              item:item_id(*)
            )
          )
        `,
        )
        .eq('id', selectedPackId.value as number)
        .returns<ExtendedPack | undefined>()
        .single();

      if (pack && !error) {
        data.value.pack = pack;
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error fetching the trip pack.');
    }
  };

  /**
   * Adds a pack to the trip.
   */
  const addPackToTrip = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: createdTripPack, error } = await supabase.from('trip_packs')
        .insert([{
          trip_id: Number(selectedTripId.value),
          pack_id: selectedPackId.value,
          profile_id: user.value?.id,
        }])
        .select();

      if (error || !createdTripPack) {
        throw new Error('There was an error adding the pack to the trip.');
      } else {
        $appStore.notifyPositive('Pack added to trip!');
        isAddPackModalOpen.value = false;
        // fetch new trip pack
        fetchTripPack();
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error adding the pack to the trip.');
    } finally {
      submitting.value = false;
    }
  };

  /**
   * Updates a trip pack.
   */
  const updateTripPack = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: updatedTripPack, error } = await supabase.from('trip_packs')
        .update({ pack_id: selectedPackId.value })
        .eq('trip_id', Number(selectedTripId.value))
        .eq('profile_id', user.value?.id as string)
        .select();

      if (error || !updatedTripPack.length) {
        throw new Error('There was an error updating the trip pack.');
      } else {
        $appStore.notifyPositive('Trip pack updated!');
        isAddPackModalOpen.value = false;
        // fetch new trip pack
        fetchTripPack();
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the trip pack.');
    }
  };

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
      submitting.value = false;
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
          data: data.value.pack?.categories?.map(c => ({
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
        loading: pageLoading.value,
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
            data: data.value.pack?.categories?.map(c => ({
              name: c.name,
              value: calculateCategoryWeight(c as ExtendedCategory),
            })) as { name: string, value: number }[],
            label: { show: false },
            itemStyle: {
              borderRadius: 8,
              borderColor: 'white',
              borderWidth: 2,
              color: (params: any) => {
                const theme = findTheme(data.value.pack?.theme as Theme);
                return theme[params.dataIndex % theme.length];
              },
            },
          },
        ],
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: (value: any) => {
            const category = data.value.pack?.categories?.[value.dataIndex];
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
        <p class="!font-bold text-base">
          Pack
        </p>
      </div>
      <div
        v-if="data.pack"
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
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!data.pack && !pageLoading">
      <p class="mb-4 text-base">
        You haven't added a pack to this trip yet!
      </p>
      <gc-button
        label="Add a pack"
        outlined
        size="sm"
        @click="[modalState = 'insert', isAddPackModalOpen = true]" />
    </gc-empty-state>
    <div v-else>
      <h5 class="text-base-lg">
        Selected Pack:
        <span class="font-black">{{ data.pack?.name }}</span>
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
  <gc-modal
    :is-open="isAddPackModalOpen"
    :title="modalState === 'insert' ? 'Add a Pack' : 'Change Pack'"
    @handle-cancel="isAddPackModalOpen = false">
    <template #content>
      <div class="flex items-start flex-col gap-4 w-full">
        <p class="text-base text-gray">
          {{ !fetchingPacks && !packOptions.length ? 'You haven\'t created any packs yet!' : 'Choose one of your existing packs to add to this trip, or create a new pack!' }}
        </p>
        <gc-select
          v-if="!fetchingPacks && packOptions.length"
          class="mb-2 w-full"
          :disabled="pageLoading"
          label="Selected Pack"
          :model-value="selectedPackId"
          name="selected-pack-select"
          :options="packOptions"
          @update:model-value="(opt: SelectOption) => selectedPackId = ( opt.value as number )" />
        <gc-button
          label="Create a new pack"
          outlined
          size="sm"
          :to="{ name: 'closet' }"
          variant="positive" />
      </div>
    </template>
    <template
      v-if="!fetchingPacks && packOptions.length"
      #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="isAddPackModalOpen = false" />
      <gc-button
        :disabled="submitting"
        :label="modalState === 'insert' ? 'Add Pack' : 'Change Pack'"
        :loading="submitting"
        size="sm"
        @click="modalState === 'insert' ? addPackToTrip() : updateTripPack()" />
    </template>
  </gc-modal>

  <!-- Change Theme Modal -->
  <change-pack-theme-dialog
    :is-open="isChangeThemeModalOpen"
    @on-close="isChangeThemeModalOpen = false"
    @update-theme="updateTheme" />
</template>
