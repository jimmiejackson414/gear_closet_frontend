<script lang='ts' setup>
  import type { Database, Theme } from '@/types';
  import generateThemeOptions from '@/utils/chartTheme';

  interface Props {
    isOpen: boolean;
  }

  const props = defineProps<Props>();
  const emits = defineEmits<{
    (event: 'onClose'): void;
    (event: 'updateTheme', theme: Theme): void;
  }>();

  const $store = usePlanningStore();
  const $appStore = useAppStore();

  const selectedTheme = ref<Theme | undefined>(($store.data.pack?.theme as Theme) || undefined);
  const themeOptions = computed(() => generateThemeOptions());
  const submitting = ref(false);
  const updateTheme = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: pack, error } = await supabase
        .from('packs')
        .update({ theme: selectedTheme.value })
        .eq('id', $store.data.pack?.id as number)
        .select();

      if (error || !pack) throw error;
      const updatedPack = pack[0];
      if (updatedPack) {
        $store.data.pack!.theme = updatedPack.theme;
      }
      $appStore.notifyPositive('Successfully updated your pack theme.');
      emits('updateTheme', selectedTheme.value as Theme);
    } catch (error) {
      $appStore.notifyNegative('There was an error updating your pack theme.');
    } finally {
      submitting.value = false;
    }
  };

  // when opened, set the selected theme to the pack's theme
  watchEffect(() => {
    if (props.isOpen) {
      selectedTheme.value = $store.data.pack?.theme as Theme;
    }
  });
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="emits('onClose')"
      @interact-outside="emits('onClose')">
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
                      class="border border-white h-4 rounded-[3px] w-4"
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
          @click="emits('onClose')">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          @click="updateTheme">
          Update
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
