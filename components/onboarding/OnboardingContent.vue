<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import type { FilePondFile } from 'filepond';
  import { useForm } from 'vee-validate';
  import type { FunctionalComponent } from 'vue';
  import * as z from 'zod';
  import { IconAperture, IconCheck, IconCircleUser, IconHeart } from '#components';
  import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Button as FormButton, FormControl, FormField, FormInput, FormLabel, FormMessage, SelectRoot as FormSelect, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Stepper, StepperDescription, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui';
  import { useToast } from '@/components/ui/toast/use-toast';
  import { MeasuringSystem, SubscriptionLevel } from '@/types';

  type StepperState = 'completed' | 'active' | 'inactive';

  /**
   * Global definitions
   */
  const isSubmitting = ref(false);

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

  /**
   * Define the form schema for each step of the onboarding process
   */
  const formSchema = toTypedSchema(z.object({
    first_name: z.string()
      .min(1),
    last_name: z.string()
      .min(1),
    trail_name: z.string()
      .optional(),
    measuring_system: z.union([z.literal(MeasuringSystem.IMPERIAL), z.literal(MeasuringSystem.METRIC)]),
  }));

  const $store = useUserStore();
  const { profile } = storeToRefs($store);
  const { meta, values, errorBag } = useForm({
    initialValues: {
      first_name: profile.value?.first_name ?? '',
      last_name: profile.value?.last_name ?? '',
      trail_name: profile.value?.trail_name ?? '',
      measuring_system: (profile.value?.measuring_system as MeasuringSystem) ?? MeasuringSystem.IMPERIAL,
    },
    keepValuesOnUnmount: true,
    validationSchema: formSchema,
  });

  /**
   * Handle the avatar upload process
   */
  const { toast } = useToast();
  const avatarFile = ref<FilePondFile | string | null>(null);
  const handleAvatarError = () => {
    return toast({
      title: 'Error',
      description: 'There was an error uploading your avatar. Please try again.',
      variant: 'destructive',
    });
  };

  const handleAvatarUpload = async () => {
    isSubmitting.value = true;
    if (avatarFile.value && typeof avatarFile.value !== 'string') {
      const newAvatar = (avatarFile.value as FilePondFile).file as File;
      const { success } = await $store.updateAvatar(newAvatar);
      if (!success) {
        handleAvatarError();
        isSubmitting.value = false;
        return;
      }
    }
    isSubmitting.value = false;
  };

  /**
   * Handle the profile update process
   */
  const handleUpdateProfile = async () => {
    isSubmitting.value = true;
    const { success } = await $store.updateProfile({ ...values });
    isSubmitting.value = false;
    return { success };
  };

  /**
   * Handle the completion of the onboarding process
   */
  const selectedPlan = ref<Tier | null>(null);
  const $router = useRouter();
  const handleCompleteOnboarding = async () => {
    isSubmitting.value = true;
    try {
      const { success } = await $store.updateProfile({ onboard_date: new Date()
        .toISOString() });

      if (!success) throw new Error();

      const response = await $fetch('/api/stripe/subscription', {
        method: 'POST',
        body: JSON.stringify({ subscription: SubscriptionLevel.LIFE }),
      });

      if (!response.ok) throw new Error();

      await $router.push({ name: 'index' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error completing the onboarding process. Please try again.',
        variant: 'destructive',
      });
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleNextStep = async () => {
    if (stepIndex.value === 1) {
      if (avatarFile.value) await handleAvatarUpload();
      stepIndex.value = 2;
    } else if (stepIndex.value === 2) {
      const { success } = await handleUpdateProfile();
      if (success) stepIndex.value = 3;
    }
  };

  const isNextDisabled = ref(false);
  watch(errorBag, () => {
    isNextDisabled.value = Object.keys(errorBag.value).length > 0;
  });
</script>

<template>
  <stepper
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
            :ref="`step${step.step}Ref`"
            class="rounded-full shrink-0 z-10"
            :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
            :disabled="( state !== 'completed' && !meta.valid ) || isNextDisabled || ( step.step === 3 )"
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
    <div class="flex flex-col gap-4 mt-16 mx-auto w-full">
      <!-- Step 1: Upload Avatar -->
      <template v-if="stepIndex === 1">
        <client-only>
          <gc-avatar-upload
            classes="max-w-xs mx-auto"
            @handle-add-file="avatarFile = $event"
            @handle-error="handleAvatarError"
            @handle-remove-file="avatarFile = null" />
        </client-only>
      </template>

      <!-- Step 2: Account Info -->
      <template v-if="stepIndex === 2">
        <div class="flex flex-col gap-4 max-w-xl mx-auto w-full">
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
        </div>
      </template>

      <!-- Step 3: Plan Options -->
      <template v-if="stepIndex === 3">
        <div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
          <upgrade-card
            v-for="tier in tiers"
            :key="tier.title"
            :is-selected="selectedPlan?.value === tier.value"
            :submitting="isSubmitting"
            :tier="tier"
            @handle-action="selectedPlan = $event" />
        </div>
      </template>
    </div>

    <!-- Stepper Button Actions -->
    <div class="flex justify-between items-center mt-16">
      <form-button
        :disabled="stepIndex === 1"
        variant="outline"
        @click="stepIndex > 1 ? stepIndex-- : undefined">
        Back
      </form-button>
      <div class="flex items-center gap-3">
        <form-button
          v-if="stepIndex !== 3"
          :disabled="isSubmitting || isNextDisabled"
          :loading="isSubmitting"
          @click="handleNextStep">
          {{ stepIndex === 1 && !avatarFile ? 'Skip' : 'Next' }}
        </form-button>
        <form-button
          v-if="stepIndex === 3"
          :disabled="isSubmitting"
          :loading="isSubmitting">
          Submit
        </form-button>
      </div>
    </div>
  </stepper>

  <alert-dialog :open="stepIndex === 3">
    <alert-dialog-content>
      <alert-dialog-header>
        <alert-dialog-title class="flex items-center gap-2">
          <icon-heart class="h-8 text-primary w-8" />
          Promotional Period
        </alert-dialog-title>
      </alert-dialog-header>
      <div class="flex items-center space-x-2">
        <div class="flex flex-col">
          <!-- <div class="flex items-center gap-2"> -->
          <typography class="font-semibold">
            Lifetime Membership
          </typography>
          <!-- </div> -->
          <typography>
            For a limited time, enjoy a free <b>LIFETIME</b> membership on us as a thank you for being one of our first members!
          </typography>
        </div>
      </div>
      <alert-dialog-footer>
        <form-button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="handleCompleteOnboarding">
          Continue
        </form-button>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>