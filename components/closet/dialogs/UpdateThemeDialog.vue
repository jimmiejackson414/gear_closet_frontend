<script lang='ts' setup>
  import type { Database, Theme } from '@/types';
  import generateThemeOptions from '@/utils/chartTheme';

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
  <dialog-root :open="dialogStates.updateThemeDialog">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="dialogStates.updateThemeDialog = false"
      @interact-outside="dialogStates.updateThemeDialog = false">
      <dialog-header>
        <dialog-title>
          Change Theme Colors
        </dialog-title>
        <dialog-description>
          Change the theme colors of the pack.
        </dialog-description>
      </dialog-header>
      <div class="w-full lg:max-w-sm">
        <select-root v-model="selectedTheme">
          <select-trigger>
            <select-value placeholder="Select a theme" />
          </select-trigger>
          <select-content>
            <select-group>
              <select-item
                v-for="theme in themeOptions"
                :key="theme.value"
                :value="theme.value">
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1">
                    <span
                      v-for="color in theme.colors"
                      :key="color"
                      class="border-1 border-white h-4 rounded-[3px] w-4"
                      :style="{ backgroundColor: color }" />
                  </div>
                  {{ theme.label }}
                </div>
              </select-item>
            </select-group>
          </select-content>
        </select-root>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="dialogStates.updateThemeDialog = false">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          @click="handleSubmit">
          Update
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
