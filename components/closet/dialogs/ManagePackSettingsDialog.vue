<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { IconBackpack } from '#components';
  import { type Database, Theme } from '@/types';
  import type { ExtendedPack } from '@/types/helpers';
  import generateThemeOptions from '@/utils/chartTheme';

  const $store = useClosetStore();
  const $appStore = useAppStore();

  const themeOptions = computed(() => generateThemeOptions());

  const formSchema = toTypedSchema(z.object({
    name: z.string()
      .min(3)
      .max(50),
    allow_comments: z.boolean(),
    theme: z.nativeEnum(Theme),
    private: z.boolean(),
  }));

  const defaultMode = ref<'create' | 'update'>('create');
  const mode = inject<Ref<'create' | 'update'>>('dialogMode', defaultMode);
  const { isFieldDirty, handleSubmit, isSubmitting, setValues } = useForm({
    keepValuesOnUnmount: true,
    validationSchema: formSchema,
    initialValues: {
      name: mode.value === 'update' ? $store.data.selectedPack?.name as string : '',
      allow_comments: mode.value === 'update' ? $store.data.selectedPack?.allow_comments as boolean : true,
      theme: mode.value === 'update' ? $store.data.selectedPack?.theme as Theme : Theme.BLUE6,
      private: mode.value === 'update' ? $store.data.selectedPack?.private as boolean : false,
    },
  });

  watch(() => $store.dialogStates.managePackSettingsDialog, (newValue) => {
    if (newValue) {
      setValues({
        name: mode.value === 'update' ? $store.data.selectedPack?.name as string : '',
        allow_comments: mode.value === 'update' ? $store.data.selectedPack?.allow_comments as boolean : true,
        theme: mode.value === 'update' ? $store.data.selectedPack?.theme as Theme : Theme.BLUE6,
        private: mode.value === 'update' ? $store.data.selectedPack?.private as boolean : false,
      });
    }
  });

  const submitting = ref(false);
  const onSubmit = handleSubmit(async (values) => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();

      // create mode
      if (mode.value === 'create') {
        const { data: createdPack, error } = await supabase.from('packs')
          .insert([{
            ...values,
            profile_id: user.value?.sub as string,
          }])
          .select();

        if (createdPack?.length && !error) {
          $store.data.allPacks.push({ id: createdPack[0].id, name: createdPack[0].name as string, slug: createdPack[0].slug as string });
          $store.data.selectedPack = createdPack[0] as ExtendedPack;
          $appStore.notifyPositive('Pack created successfully.');
        }
      } else {
        // update mode
        const { data: updatedPack, error } = await supabase
          .from('packs')
          .update({ ...values })
          .eq('id', $store.data.selectedPack?.id as number)
          .select();
        if (error || !updatedPack) throw error;
        $store.data.selectedPack = { ...$store.data.selectedPack, ...updatedPack[0] } as ExtendedPack;
        $appStore.notifyPositive('Successfully updated your pack theme.');
      }
    } catch (error) {
      $appStore.notifyNegative(`There was an error ${mode.value === 'create' ? 'creating' : 'updating'} your pack.`);
    } finally {
      $store.dialogStates.managePackSettingsDialog = false;
      submitting.value = false;
    }
  });
</script>

<template>
  <dialog-root :open="$store.dialogStates.managePackSettingsDialog">
    <dialog-content
      class="sm:max-w-[450px] lg:max-w-[650px] max-h-[90dvh]"
      @escape-key-down="$store.dialogStates.managePackSettingsDialog = false"
      @interact-outside="$store.dialogStates.managePackSettingsDialog = false">
      <dialog-header>
        <dialog-title>
          {{ mode === 'create' ? 'Create a new pack' : 'Pack settings' }}
        </dialog-title>
        <dialog-description>
          {{ mode === 'create' ? '' : 'Update settings related to your pack.' }}
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col gap-6">
        <!-- New pack name -->
        <form-field
          v-slot="{ componentField }"
          name="name"
          :validate-on-blur="!isFieldDirty">
          <form-item>
            <form-label>Pack Name</form-label>
            <form-control>
              <input-root
                :disabled="isSubmitting"
                :prepend-icon="IconBackpack"
                v-bind="componentField" />
            </form-control>
          </form-item>
        </form-field>

        <!-- Pack theme colors -->
        <form-field
          v-slot="{ componentField }"
          name="theme">
          <form-item>
            <form-label>Theme</form-label>
            <select-root v-bind="componentField">
              <form-control>
                <select-trigger>
                  <select-value placeholder="Select a theme" />
                </select-trigger>
              </form-control>
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
                          class="border-1 border-white rounded-[3px] w-4 h-4"
                          :style="{ backgroundColor: color }" />
                      </div>
                      {{ theme.label }}
                    </div>
                  </select-item>
                </select-group>
              </select-content>
            </select-root>
          </form-item>
        </form-field>

        <!-- Private checkbox -->
        <form-field
          v-slot="{ value, handleChange }"
          name="private"
          :validate-on-blur="!isFieldDirty">
          <form-item class="flex flex-row justify-between items-center p-4 border rounded-lg">
            <div class="space-y-0.5">
              <form-label class="text-base">
                Private?
              </form-label>
              <form-description>
                Private packs cannot be viewed by other users. {{ mode === 'update' ? 'This setting can be changed later.' : '' }}
              </form-description>
            </div>
            <form-control>
              <switch-root
                :checked="value"
                @update:checked="handleChange" />
            </form-control>
          </form-item>
        </form-field>

        <!-- Allow comments checkbox -->
        <form-field
          v-slot="{ value, handleChange }"
          name="allow_comments"
          :validate-on-blur="!isFieldDirty">
          <form-item class="flex flex-row justify-between items-center p-4 border rounded-lg">
            <div class="space-y-0.5">
              <form-label class="text-base">
                Allow comments?
              </form-label>
              <form-description>
                Allow users you share this pack with list to make comments? {{ mode === 'update' ? 'This setting can be changed later.' : '' }}
              </form-description>
            </div>
            <form-control>
              <switch-root
                :checked="value"
                @update:checked="handleChange" />
            </form-control>
          </form-item>
        </form-field>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="$store.dialogStates.managePackSettingsDialog = false">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          @click="onSubmit">
          {{ mode === 'create' ? 'Create pack' : 'Update pack' }}
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
