<script lang='ts' setup>
  import { BackpackIcon, SettingsIcon } from 'lucide-vue-next';
  import generateThemeOptions from '@/utils/chartTheme';
  import { Theme, type Database } from '@/types';

  const $appStore = useAppStore();
  const $store = useClosetStore();
  const { data } = storeToRefs($store);

  /**
   * Updates the theme associated with the pack.
   */
  const submitting = ref(false);
  const isChangeThemeModalOpen = ref(false);
  const updateTheme = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: pack, error } = await supabase
        .from('packs')
        .update({ theme: selectedTheme.value })
        .eq('id', data.value.selectedPack?.id as number)
        .select();
      
      if (error || !pack) throw error;
      $appStore.notifyPositive('Successfully updated your pack theme.');
    } catch (error) {
      $appStore.notifyNegative('There was an error updating your pack theme.');
    } finally {
      isChangeThemeModalOpen.value = false;
      submitting.value = false;
    }
  };

  const selectedTheme = ref(data.value.selectedPack?.theme);
  const themeOptions = computed(() => generateThemeOptions());
</script>

<template>
  <div class="card card-main">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center">
        <backpack-icon class="h-6 mr-6 text-primary w-6" />
        <p class="!font-bold text-base">
          Pack Summary
        </p>
      </div>
      <div class="flex">
        <headless-menu
          as="div"
          class="inline-block relative text-left">
          <div class="bg-primary flex justify-center items-center h-8 rounded-full w-8">
            <headless-menu-button class="duration-150 ease-snap focus-visible:ring-2 focus-visible:ring-white/0 font-medium inline-flex justify-center outline-none focus:outline-none px-0 py-2 rounded-md text-sm text-white">
              <settings-icon class="h-5 w-5 " />
            </headless-menu-button>
          </div>
          <zoom-transition>
            <headless-menu-items class="absolute right-0 bg-white divide-gray-100 divide-y mt-2 origin-top-right ring-1 ring-black/5 rounded-md shadow-lg w-56 z-10 focus:outline-none">
              <headless-menu-item @click="isChangeThemeModalOpen = true">
                <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-dark-grey hover:bg-gray-100">
                  Change Theme
                </p>
              </headless-menu-item>
            </headless-menu-items>
          </zoom-transition>
        </headless-menu>
      </div>
    </div>
  </div>

  <gc-modal
    :is-open="isChangeThemeModalOpen"
    size="sm"
    title="Change Theme"
    @handle-cancel="isChangeThemeModalOpen = false">
    <template #default>
      <div class="flex flex-col">
        <p class="mb-4 text-base">
          Change the theme associated with your pack.
        </p>
        <gc-select
          :disabled="submitting"
          label="Theme"
          :model-value="selectedTheme"
          :options="themeOptions"
          @update:model-value="(value: Theme) => selectedTheme = value">
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
