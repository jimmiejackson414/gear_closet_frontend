<script lang='ts' setup>
  import type { Database, Theme } from '@/types';
  import generateThemeOptions, { findTheme } from '@/utils/chartTheme';

  const $store = useClosetStore();
  const $appStore = useAppStore();
  const { data, dialogStates } = storeToRefs($store);

  const themeOptions = computed(() => generateThemeOptions());
  const selectedTheme = ref<Theme | undefined>((data.value.selectedPack?.theme as Theme) || undefined);
  const submitting = ref(false);
  const handleSubmit = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: pack, error } = await supabase
        .from('packs')
        .update({ theme: selectedTheme.value })
        .eq('id', data.value.selectedPack?.id as number)
        .select();

      if (error || !pack) throw error;
      data.value.selectedPack!.theme = pack[0].theme;
      $appStore.notifyPositive('Successfully updated your pack theme.');
    } catch (error) {
      $appStore.notifyNegative('There was an error updating your pack theme.');
    } finally {
      dialogStates.value.updateThemeDialog = false;
      submitting.value = false;
    }
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.updateThemeDialog"
    size="sm"
    title="Change Theme"
    @handle-cancel="dialogStates.updateThemeDialog = false">
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
          @update:model-value="(val: Option) => selectedTheme = val.value">
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
          @click="dialogStates.updateThemeDialog = false" />
        <gc-button
          :disabled="submitting"
          label="Update"
          :loading="submitting"
          size="sm"
          @click="handleSubmit" />
      </div>
    </template>
  </gc-modal>
</template>
