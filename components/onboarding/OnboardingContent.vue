<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import type { FilePondFile } from 'filepond';
  import { useForm } from 'vee-validate';
  import type { FunctionalComponent } from 'vue';
  import * as z from 'zod';
  import { IconAperture, IconCheck, IconCircleUser, IconHeart } from '#components';
  import { Button as FormButton, FormControl, FormField, Input as FormInput, FormLabel, FormMessage, Select as FormSelect, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Stepper, StepperDescription, Form as StepperForm, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui';
  import { useToast } from '@/components/ui/toast/use-toast';
  import { MeasuringSystem, SubscriptionLevel, type Tables, type TablesUpdate } from '@/types';

  type StepperState = 'completed' | 'active' | 'inactive';

  // const formSchema = toTypedSchema(z.object({
  //   first_name: z.string()
  //     .min(1),
  //   last_name: z.string()
  //     .min(1),
  //   trail_name: z.string()
  //     .optional(),
  //   measuring_system: z.union([z.literal(MeasuringSystem.IMPERIAL), z.literal(MeasuringSystem.METRIC)]),
  // }));
  /**
   * Define the form schema for each step of the onboarding process
   */
  const formSchema = [
    z.object({
      avatar_file: z.custom<FilePondFile | undefined>()
        .optional(),
    }),
    z.object({
      first_name: z.string()
        .min(1),
      last_name: z.string()
        .min(1),
      trail_name: z.string()
        .optional(),
      measuring_system: z.union([z.literal(MeasuringSystem.IMPERIAL), z.literal(MeasuringSystem.METRIC)]),
    }),
    z.object({
      plan: z.string()
        .min(1),
    }),
  ];

  const $store = useUserStore();
  const { profile } = storeToRefs($store);
  // const { isSubmitting, meta, values } = useForm({
  //   initialValues: {
  //     first_name: profile.value?.first_name ?? '',
  //     last_name: profile.value?.last_name ?? '',
  //     trail_name: profile.value?.trail_name ?? '',
  //     measuring_system: (profile.value?.measuring_system as MeasuringSystem) ?? MeasuringSystem.IMPERIAL,
  //   },
  //   validationSchema: formSchema,
  // });

  /**
   * Stepper Definitions
   */
  const stepIndex = ref(1);
  const steps = [
    {
      step: 1,
      title: 'Upload Avatar',
      description: 'Upload a photo of yourself (optional)',
    },
    {
      step: 2,
      title: 'Account Info',
      description: 'Tell us a little about yourself',
    },
    {
      step: 3,
      title: 'Plan Options',
      description: 'Choose your plan',
    },
  ];

  const icons: Record<number, Record<StepperState, FunctionalComponent>> = {
    1: {
      completed: IconCheck,
      active: IconAperture,
      inactive: IconAperture,
    },
    2: {
      completed: IconCheck,
      active: IconCircleUser,
      inactive: IconCircleUser,
    },
    3: {
      completed: IconCheck,
      active: IconHeart,
      inactive: IconHeart,
    },
  };

  const stepperIcon = (step: keyof typeof icons, state: StepperState) => icons[step][state];

  const { toast } = useToast();
  const uploadingAvatar = ref(false);
  // const avatarFile = ref<FilePondFile | null>(null);
  // const handleAddAvatar = (file: FilePondFile) => {
  // avatarFile.value = file;
  // console.log(`handleAddAvatar`);
  // };

  const handleAvatarError = () => {
    return toast({
      title: 'Error',
      description: 'There was an error uploading your avatar. Please try again.',
      variant: 'destructive',
    });
  };

  const handleUploadAvatar = async (file: FilePondFile) => {
    uploadingAvatar.value = true;
    if (file && file.file instanceof File) {
      const { success } = await $store.updateAvatar(file.file);
      // if (success) stepIndex.value = 2;
      // else handleAvatarError();
      if (!success) handleAvatarError();
      uploadingAvatar.value = false;
    } else {
      handleAvatarError();
      uploadingAvatar.value = false;
    }
  };

  const profileUpdated = ref(false);
  const handleUpdateProfile = async ({ first_name, last_name, trail_name, measuring_system }: TablesUpdate<'profiles'>) => {
    const payload = { first_name, last_name, trail_name, measuring_system };
    const { success } = await $store.updateProfile(payload);
    if (success) {
      profileUpdated.value = true;
      stepIndex.value = 3;
    }
  };

  const handleCompleteOnboarding = async () => {
    console.log(`Completing onboarding...`);
  };

  const handleNextStep = async (values: any, validate: any, nextStep: any) => {
    console.log(`Current stepIndex: `, stepIndex.value);
    validate();
    if (stepIndex.value === 1) {
      if (!values.avatar_file) {
        // stepIndex.value = 2;
        nextStep();
      } else {
        await handleUploadAvatar(values.avatar_file);
        nextStep();
      }
    } else if (stepIndex.value === 2) {
      await handleUpdateProfile(values);
      nextStep();
    }
    console.log(`After handleNexttep stepIndex: `, stepIndex.value);
  };
</script>

<template>
  <stepper-form
    v-slot="{ meta, values, validate, isSubmitting, setFieldValue }"
    as=""
    :initial-values="{
      avatar_file: undefined as FilePondFile | undefined,
      first_name: profile!.first_name ?? '',
      last_name: profile?.last_name ?? '',
      trail_name: profile?.trail_name ?? '',
      measuring_system: profile?.measuring_system ?? MeasuringSystem.IMPERIAL,
      plan: SubscriptionLevel.FREE,
    }"
    keep-values
    :validation-schema="toTypedSchema(formSchema[stepIndex - 1])">
    <stepper
      v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
      v-model="stepIndex"
      class="block max-w-4xl mt-8 mx-auto w-full">
      <form>
        <div class="flex flex-start gap-2 w-full">
          <!-- Stepper Navigation -->
          <stepper-item
            v-for="step in steps"
            :key="step.step"
            v-slot="{ state }"
            class="flex justify-center items-center flex-col relative w-full"
            :step="step.step">
            <stepper-separator
              v-if="step.step !== steps[steps.length - 1].step"
              class="absolute top-5 right-[calc(-50%+10px)] left-[calc(50%+20px)] bg-muted block group-data-[state=completed]:bg-primary h-0.5 rounded-full shrink-0" />

            <stepper-trigger as-child>
              <form-button
                class="rounded-full shrink-0 z-10"
                :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                :disabled="( state !== 'completed' && !meta.valid ) || (step.step === 3 && !profileUpdated)"
                size="icon"
                :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                @click="stepIndex = step.step">
                <component :is="stepperIcon(step.step, state)" />
              </form-button>
            </stepper-trigger>

            <div class="flex items-center flex-col mt-5 text-center">
              <stepper-title
                class="font-semibold text-sm lg:text-base transition"
                :class="[state === 'active' && 'text-primary']">
                {{ step.title }}
              </stepper-title>
              <stepper-description
                class="sr-only text-muted-foreground lg:text-sm text-xs transition md:not-sr-only"
                :class="[state === 'active' && 'text-primary']">
                {{ step.description }}
              </stepper-description>
            </div>
          </stepper-item>
        </div>

        <!-- Stepper Content -->
        <div class="flex flex-col gap-4 max-w-xl mt-16 mx-auto">
          <!-- Step 1: Upload Avatar -->
          <template v-if="stepIndex === 1">
            <gc-avatar-upload
              classes="max-w-xs mx-auto"
              :file="values.avatar_file"
              @handle-add-file="setFieldValue('avatar_file', $event)"
              @handle-error="handleAvatarError"
              @handle-remove-file="setFieldValue('avatar_file', null)" />
          </template>

          <!-- Step 2: Account Info -->
          <template v-if="stepIndex === 2">
            <form-field
              v-slot="{ componentField }"
              name="first_name">
              <form-item>
                <form-label>First Name</form-label>
                <form-control>
                  <form-input
                    v-bind="componentField"
                    :default-value="values.first_name" />
                </form-control>
                <form-message />
              </form-item>
            </form-field>

            <form-field
              v-slot="{ componentField }"
              name="last_name">
              <form-item>
                <form-label>Last Name</form-label>
                <form-control>
                  <form-input
                    :default-value="values.last_name"
                    v-bind="componentField" />
                </form-control>
                <form-message />
              </form-item>
            </form-field>

            <form-field
              v-slot="{ componentField }"
              name="trail_name">
              <form-item>
                <form-label>Trail Name (optional)</form-label>
                <form-control>
                  <form-input
                    :default-value="values.trail_name"
                    v-bind="componentField" />
                </form-control>
                <form-message />
              </form-item>
            </form-field>

            <form-field
              v-slot="{ componentField }"
              name="measuring_system">
              <form-item>
                <form-label>Preferred Measuring System</form-label>
                <form-select
                  v-bind="componentField"
                  :default-value="formattedMeasuringSystem[0].value">
                  <form-control>
                    <select-trigger>
                      <select-value placeholder="Select a measuring system" />
                    </select-trigger>
                  </form-control>
                  <select-content>
                    <select-group>
                      <select-item
                        v-for="system in formattedMeasuringSystem"
                        :key="system.value"
                        :value="system.value">
                        {{ system.label }}
                      </select-item>
                    </select-group>
                  </select-content>
                </form-select>
                <form-message />
              </form-item>
            </form-field>
          </template>

          <!-- Step 3: Plan Options -->
          <template v-if="stepIndex === 3">
            <div>
              Select a Plan
            </div>
          </template>
        </div>

        <!-- Stepper Button Actions -->
        <div class="flex justify-between items-center mt-16">
          <form-button
            :disabled="isPrevDisabled"
            variant="outline"
            @click="prevStep">
            Back
          </form-button>
          <div class="flex items-center gap-3">
            <form-button
              v-if="stepIndex !== 3"
              :disabled="uploadingAvatar || isSubmitting || isNextDisabled"
              :loading="uploadingAvatar || isSubmitting"
              @click="() => handleNextStep(values, validate, nextStep)">
              {{ stepIndex === 1 && !values.avatar_file ? 'Skip' : 'Next' }}
            </form-button>
            <form-button
              v-if="stepIndex === 3"
              :disabled="isSubmitting"
              :loading="isSubmitting"
              @click="handleCompleteOnboarding">
              Submit
            </form-button>
          </div>
        </div>
      </form>
    </stepper>
  </stepper-form>
</template>