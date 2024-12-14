<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { IconBackpack } from '#components';
  import { type Database, Theme } from '@/types';
  import type { ExtendedPack } from '@/types/helpers';
  import generateThemeOptions from '@/utils/chartTheme';

  export interface CreatePack {
    allow_comments: boolean;
    name: string;
    theme: Theme;
    private: boolean;
  }

  const $store = useClosetStore();
  const { data, dialogStates } = storeToRefs($store);
  const submitting = ref(false);
  const themeOptions = computed(() => generateThemeOptions());

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
      name: '',
      allow_comments: false,
      theme: Theme.BLUE6,
      private: true,
    },
  });

  /**
   * Creates a new pack.
   */
  const $appStore = useAppStore();
  const onSubmit = handleSubmit(async (values) => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: createdPack, error } = await supabase.from('packs')
        .insert([{
          ...values,
          profile_id: user.value?.id as string,
        }])
        .select();

      if (createdPack?.length && !error) {
        data.value.allPacks.push({ id: createdPack[0].id, name: createdPack[0].name as string, slug: createdPack[0].slug as string });
        data.value.selectedPack = createdPack[0] as ExtendedPack;
        $appStore.notifyPositive('Pack created successfully.');
      } else {
        $appStore.notifyNegative('There was an error creating the pack.');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating the pack.');
    } finally {
      submitting.value = false;
      dialogStates.value.createPackDialog = false;
    }
  });

  const handleClose = () => {
    dialogStates.value.createPackDialog = false;
    setValues({
      name: '',
      allow_comments: false,
      theme: Theme.BLUE6,
      private: true,
    });
  };
</script>

<template>
  <dialog-root :open="dialogStates.createPackDialog">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>
          Create a new pack
        </dialog-title>
        <dialog-description />
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
          @click="handleClose">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          @click="onSubmit">
          Create pack
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>

