<script lang='ts' setup>
  import { use } from 'echarts/core';
  import { PieChart } from 'echarts/charts';
  import { GridComponent, PolarComponent, TitleComponent, LegendComponent, TooltipComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  import VChart from 'vue-echarts';
  import { BackpackIcon, SettingsIcon } from 'lucide-vue-next';
  import round from 'lodash.round';
  import convert from 'convert';
  import generateThemeOptions, { findTheme } from '@/utils/chartTheme';
  import type { EChartsOption } from 'echarts';
  import type { Database, Theme } from '@/types';
  import type { ExtendedCategory, ExtendedPack, SelectOption } from '~/types/helpers';

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
          trip_id: selectedTripId.value,
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
        .eq('trip_id', selectedTripId.value as number)
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
  const selectedTheme = ref<Theme | undefined>((data.value.pack?.theme as Theme) || undefined);
  const themeOptions = computed(() => generateThemeOptions());
  const updateTheme = async () => {
    console.log('updateTheme');
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: pack, error } = await supabase
        .from('packs')
        .update({ theme: selectedTheme.value })
        .eq('id', data.value.pack?.id as number)
        .select();

      if (error || !pack) throw error;
      chartRef.value?.setOption({
        series: [{
          itemStyle: {
            color: (params: any) => {
              const theme = findTheme(selectedTheme.value);
              return theme[params.dataIndex % theme.length];
            },
          },
        }],
      });
      data.value.pack!.theme = pack[0].theme;
      $appStore.notifyPositive('Successfully updated your pack theme.');
    } catch (error) {
      $appStore.notifyNegative('There was an error updating your pack theme.');
    } finally {
      isChangeThemeModalOpen.value = false;
      submitting.value = false;
    }
  };

  /* Donut Chart Options */
  const chartRef = ref<typeof VChart | null>(null);
  const chartOptions = computed<EChartsOption>({
    get () {
      return {
        animationDuration: 300,
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center',
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

  const handleUpdateModelValue = (val: Option) => {
    console.log(`handleUpdateModelValue`);
    selectedTheme.value = val.value as Theme;
  };
</script>

<template>
  <div class="card card-main">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center">
        <backpack-icon class="h-6 mr-6 text-primary w-6" />
        <p class="!font-bold text-base">
          Pack
        </p>
      </div>
      <div
        v-if="data.pack"
        class="flex">
        <headless-menu
          as="div"
          class="inline-block relative text-left">
          <div class="bg-primary flex justify-center items-center h-6 rounded-full w-6">
            <headless-menu-button class="duration-150 ease-snap focus-visible:ring-2 focus-visible:ring-white/0 font-medium inline-flex justify-center outline-none focus:outline-none px-0 py-2 rounded-md text-sm text-white">
              <settings-icon class="h-4 w-4" />
            </headless-menu-button>
          </div>
          <zoom-transition>
            <headless-menu-items class="absolute right-0 bg-white divide-gray-100 divide-y mt-2 origin-top-right ring-1 ring-black/5 rounded-md shadow-lg w-56 z-10 focus:outline-none">
              <headless-menu-item @click="[modalState = 'update', isAddPackModalOpen = true]">
                <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-dark-grey hover:bg-gray-100">
                  Change Pack
                </p>
              </headless-menu-item>
              <headless-menu-item @click="isChangeThemeModalOpen = true">
                <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-dark-grey hover:bg-gray-100">
                  Update Theme Colors
                </p>
              </headless-menu-item>
            </headless-menu-items>
          </zoom-transition>
        </headless-menu>
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
  </div>

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
  <gc-modal
    :is-open="isChangeThemeModalOpen"
    size="sm"
    title="Change Theme"
    @handle-cancel="isChangeThemeModalOpen = false">
    <template #content>
      <div class="flex flex-col">
        <p class="mb-4 text-base">
          Change the theme associated with your pack.
        </p>
        <gc-select
          :disabled="submitting"
          label="Theme"
          :model-value="selectedTheme"
          :options="themeOptions"
          @update:model-value="handleUpdateModelValue">
          <template #option="{ option }">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <span
                  v-for="color in (option as Option).colors"
                  :key="color"
                  class="border-1 border-white h-4 rounded-[3px] w-4"
                  :style="{ backgroundColor: color }" />
              </div>
              <p class="text-base">
                {{ option.label }}
              </p>
            </div>
          </template>
          <template #selected="{ selectedOption }">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <span
                  v-for="color in findTheme(selectedOption)"
                  :key="color"
                  class="border-1 border-white h-4 rounded-[3px] w-4"
                  :style="{ backgroundColor: color }" />
              </div>
              <p class="text-base">
                {{ selectedOption }}
              </p>
            </div>
          </template>
        </gc-select>
      </div>
    </template>
    <template #actions>
      <div class="flex justify-end items-center gap-4 w-full">
        <gc-button
          :disabled="submitting"
          label="Cancel"
          size="sm"
          variant="secondary"
          @click="isChangeThemeModalOpen = false" />
        <gc-button
          :disabled="submitting"
          label="Update"
          :loading="submitting"
          size="sm"
          @click="updateTheme" />
      </div>
    </template>
  </gc-modal>
</template>
