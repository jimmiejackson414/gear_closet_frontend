<script lang='ts' setup>
  import type { FunctionalComponent } from 'vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import { CheckIcon, ApertureIcon, CircleUserIcon, HeartIcon } from 'lucide-vue-next';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import type { FilePondFile } from 'filepond';
  import { Button as FormButton, FormControl, FormField, FormLabel, FormMessage, Input as FormInput, Select as FormSelect, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui';
  import { useToast } from '@/components/ui/toast/use-toast';
  import { MeasuringSystem } from '@/types';

  type StepperState = 'completed' | 'active' | 'inactive';

  const formSchema = toTypedSchema(z.object({
    firstName: z.string()
      .min(1),
    lastName: z.string()
      .min(1),
    trailName: z.string()
      .optional(),
    measuringSystem: z.union([z.literal(MeasuringSystem.IMPERIAL), z.literal(MeasuringSystem.METRIC)]),
  }));

  const { isFieldDirty, handleSubmit, isSubmitting, resetForm, meta, validate } = useForm({
    validationSchema: formSchema,
  });

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

  const { toast } = useToast();
  const onSubmit = handleSubmit(async (values: any) => {
    console.log(values);
  });

  const uploadingAvatar = ref(false);
  const avatarFile = ref<FilePondFile | null>(null);
  const handleAddAvatar = (file: FilePondFile) => {
    avatarFile.value = file;
    uploadingAvatar.value = false;
  };

  const handleAvatarError = () => {
    return toast({
      title: 'Error',
      description: 'There was an error uploading your avatar. Please try again.',
      variant: 'destructive',
    });
  };

  const $store = useUserStore();
  const handleUploadAvatar = async () => {
    if (avatarFile.value && avatarFile.value.file instanceof File) {
      const { success } = await $store.updateAvatar(avatarFile.value.file);
      console.log({ success });
      if (success) stepIndex.value = 2;
      else handleAvatarError();
    } else {
      handleAvatarError();
    }
  };

  const handleNextStep = () => {
    if (stepIndex.value === 1) {
      console.log('avatarFile: ', avatarFile.value);
      if (!avatarFile.value) {
        stepIndex.value = 2;
        return;
      } else {
        handleUploadAvatar();
        return;
      }
    }

    if (stepIndex.value === 2) {
      validate();
    }

    // if (meta.valid) {
    //   stepIndex.value += 1;
    // }
  };

  const icons: Record<number, Record<StepperState, FunctionalComponent>> = {
    1: {
      completed: CheckIcon,
      active: ApertureIcon,
      inactive: ApertureIcon,
    },
    2: {
      completed: CheckIcon,
      active: CircleUserIcon,
      inactive: CircleUserIcon,
    },
    3: {
      completed: CheckIcon,
      active: HeartIcon,
      inactive: HeartIcon,
    },
  };

  const stepperIcon = (step: keyof typeof icons, state: StepperState) => icons[step][state];
</script>

<template>
  <stepper
    v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
    v-model="stepIndex"
    class="block max-w-4xl mt-8 mx-auto w-full">
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
            :disabled="state !== 'completed' && !meta.valid"
            size="icon"
            :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'">
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
          @handle-add-file="handleAddAvatar"
          @handle-error="handleAvatarError"
          @handle-process-start="uploadingAvatar = true"
          @handle-remove-file="avatarFile = null" />
      </template>

      <!-- Step 2: Account Info -->
      <template v-if="stepIndex === 2">
        <form
          class="flex flex-col gap-4"
          @submit.prevent="onSubmit">
          <form-field
            v-slot="{ componentField }"
            name="firstName">
            <form-item>
              <form-label>First Name</form-label>
              <form-control>
                <form-input v-bind="componentField" />
              </form-control>
              <form-message />
            </form-item>
          </form-field>

          <form-field
            v-slot="{ componentField }"
            name="lastName">
            <form-item>
              <form-label>Last Name</form-label>
              <form-control>
                <form-input
                  type="text"
                  v-bind="componentField" />
              </form-control>
              <form-message />
            </form-item>
          </form-field>

          <form-field
            v-slot="{ componentField }"
            name="trailName">
            <form-item>
              <form-label>Trail Name (optional)</form-label>
              <form-control>
                <form-input
                  type="text"
                  v-bind="componentField" />
              </form-control>
              <form-message />
            </form-item>
          </form-field>

          <form-field
            v-slot="{ componentField }"
            name="measuringSystem">
            <form-item>
              <form-label>Preferred Measuring System</form-label>
              <form-select v-bind="componentField">
                <form-control>
                  <select-trigger>
                    <select-value placeholder="Select a measuring system" />
                  </select-trigger>
                </form-control>
                <select-content>
                  <select-group>
                    <select-item
                      v-for="system in MeasuringSystem"
                      :key="system"
                      :value="system">
                      {{ system }}
                    </select-item>
                  </select-group>
                </select-content>
              </form-select>
              <form-message />
            </form-item>
          </form-field>
        </form>
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
        @click="prevStep()">
        Back
      </form-button>
      <div class="flex items-center gap-3">
        <form-button
          v-if="stepIndex !== 3"
          :disabled="isNextDisabled"
          :type="meta.valid ? 'button' : 'submit'"
          @click="handleNextStep">
          {{ stepIndex === 1 && !avatarFile ? 'Skip' : 'Next' }}
        </form-button>
        <form-button
          v-if="stepIndex === 3"
          type="submit">
          Submit
        </form-button>
      </div>
    </div>
  </stepper>
</template>