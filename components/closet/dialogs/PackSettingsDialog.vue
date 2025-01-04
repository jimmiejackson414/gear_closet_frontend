<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { IconBackpack } from '#components';
  import { type Database, Theme } from '@/types';
  import generateThemeOptions from '@/utils/chartTheme';

  const $store = useClosetStore();
  const $appStore = useAppStore();
  const { data, dialogStates } = storeToRefs($store);
  const isPrivate = ref(data.value.selectedPack?.private as boolean);
  const allowsComments = ref(data.value.selectedPack?.allow_comments as boolean);

  const themeOptions = computed(() => generateThemeOptions());
  const selectedTheme = ref<Theme | undefined>((data.value.selectedPack?.theme as Theme) || undefined);

  const formSchema = toTypedSchema(z.object({
    name: z.string()
      .min(3)
      .max(50),
    allow_comments: z.boolean(),
    theme: z.nativeEnum(Theme),
    private: z.boolean(),
  }));

  const { isFieldDirty, handleSubmit, isSubmitting, setValues } = useForm({
    keepValuesOnUnmount: true,
    validationSchema: formSchema,
    initialValues: {
      name: data.value.selectedPack?.name as string,
      allow_comments: data.value.selectedPack?.allow_comments as boolean,
      theme: data.value.selectedPack?.theme as Theme || Theme.BLUE6,
      private: data.value.selectedPack?.private as boolean,
    },
  });

  const submitting = ref(false);
  const onSubmit = handleSubmit(async (values) => {
    // try {
    //   submitting.value = true;
    //   const supabase = useSupabaseClient<Database>();
    //   const { data: pack, error } = await supabase
    //     .from('packs')
    //     .update({ theme: selectedTheme.value })
    //     .eq('id', data.value.selectedPack?.id as number)
    //     .select();

    //   if (error || !pack) throw error;
    //   data.value.selectedPack!.theme = pack[0].theme;
    //   $appStore.notifyPositive('Successfully updated your pack theme.');
    // } catch (error) {
    //   $appStore.notifyNegative('There was an error updating your pack theme.');
    // } finally {
    //   dialogStates.value.packSettingsDialog = false;
    //   submitting.value = false;
    // }
  });
</script>

<template>
  <dialog-root :open="dialogStates.packSettingsDialog">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="dialogStates.packSettingsDialog = false"
      @interact-outside="dialogStates.packSettingsDialog = false">
      <dialog-header>
        <dialog-title>
          Pack Settings
        </dialog-title>
        <dialog-description>
          Update settings related to your pack.
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
                          class="border-1 border-white h-4 rounded-[3px] w-4"
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
          <form-item class="border flex justify-between items-center flex-row p-4 rounded-lg">
            <div class="space-y-0.5">
              <form-label class="text-base">
                Private?
              </form-label>
              <form-description>
                Private packs cannot be viewed by other users. This setting can be changed later.
              </form-description>
            </div>
            <form-control>
              <switch
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
          <form-item class="border flex justify-between items-center flex-row p-4 rounded-lg">
            <div class="space-y-0.5">
              <form-label class="text-base">
                Allow comments?
              </form-label>
              <form-description>
                Allow users you share this pack with list to make comments? This setting can be changed later.
              </form-description>
            </div>
            <form-control>
              <switch
                :checked="value"
                @update:checked="handleChange" />
            </form-control>
          </form-item>
        </form-field>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="dialogStates.packSettingsDialog = false">
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
