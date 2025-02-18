<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { IconAperture, IconCheck, IconCircleUser, IconHeart } from '#components';
  import { useToast } from '@/components/ui';
  import { MeasuringSystem, SubscriptionLevel } from '@/types';
  import type { FilePondFile } from 'filepond';
  import type { FunctionalComponent } from 'vue';

  type StepperState = 'active' | 'completed' | 'inactive';

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
      description: 'Upload a photo of yourself (optional)',
      step: 1,
      title: 'Upload Avatar',
    },
    {
      description: 'Tell us a little about yourself',
      step: 2,
      title: 'Account Info',
    },
    {
      description: 'Choose your plan',
      step: 3,
      title: 'Plan Options',
    },
  ];

  const icons: Record<number, Record<StepperState, FunctionalComponent>> = {
    1: {
      active: IconAperture,
      completed: IconCheck,
      inactive: IconAperture,
    },
    2: {
      active: IconCircleUser,
      completed: IconCheck,
      inactive: IconCircleUser,
    },
    3: {
      active: IconHeart,
      completed: IconCheck,
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
    measuring_system: z.union([z.literal(MeasuringSystem.IMPERIAL), z.literal(MeasuringSystem.METRIC)]),
    trail_name: z.string()
      .optional(),
  }));

  const $store = useUserStore();
  const { errorBag, meta, values } = useForm({
    initialValues: {
      first_name: $store.profile?.first_name ?? '',
      last_name: $store.profile?.last_name ?? '',
      measuring_system: ($store.profile?.measuring_system as MeasuringSystem) ?? MeasuringSystem.IMPERIAL,
      trail_name: $store.profile?.trail_name ?? '',
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
      description: 'There was an error uploading your avatar. Please try again.',
      title: 'Error',
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
        body: JSON.stringify({ subscription: SubscriptionLevel.LIFE }),
        method: 'POST',
      });

      if (!response.ok) throw new Error();

      await $router.push({ name: 'index' });
    } catch (error) {
      toast({
        description: 'There was an error completing the onboarding process. Please try again.',
        title: 'Error',
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
    isNextDisabled.value = (stepIndex.value === 2 && Object.keys(errorBag.value).length > 0);
  });
</script>

<template>
  <stepper
    v-model="stepIndex"
    class="mx-auto mt-8 block w-full max-w-4xl">
    <div class="flex w-full gap-2">
      <!-- Stepper Navigation -->
      <stepper-item
        v-for="step in steps"
        :key="step.step"
        v-slot="{ state }"
        class="relative flex w-full flex-col items-center justify-center"
        :step="step.step">
        <stepper-separator
          v-if="step.step !== steps[steps.length - 1].step"
          class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

        <stepper-trigger as-child>
          <button-root
            :ref="`step${step.step}Ref`"
            class="z-10 shrink-0 rounded-full"
            :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
            :disabled="( state !== 'completed' && !meta.valid ) || isNextDisabled || ( step.step === 3 )"
            size="icon"
            :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
            @click="stepIndex = step.step">
            <component :is="stepperIcon(step.step, state)" />
          </button-root>
        </stepper-trigger>

        <div class="mt-5 flex flex-col items-center text-center">
          <stepper-title
            class="text-sm font-semibold transition lg:text-base"
            :class="[state === 'active' && 'text-primary']">
            {{ step.title }}
          </stepper-title>
          <stepper-description
            class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
            :class="[state === 'active' && 'text-primary']">
            {{ step.description }}
          </stepper-description>
        </div>
      </stepper-item>
    </div>

    <!-- Stepper Content -->
    <div class="mx-auto mt-16 flex w-full flex-col gap-4">
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
        <div class="mx-auto flex w-full max-w-xl flex-col gap-4">
          <form-field
            v-slot="{ componentField }"
            name="first_name">
            <form-item>
              <form-label>First Name</form-label>
              <form-control>
                <input-root
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
                <input-root
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
                <input-root
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
              <select-root
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
              </select-root>
              <form-message />
            </form-item>
          </form-field>
        </div>
      </template>

      <!-- Step 3: Plan Options -->
      <template v-if="stepIndex === 3">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
    <div class="mt-16 flex items-center justify-between">
      <button-root
        :disabled="stepIndex === 1"
        variant="outline"
        @click="stepIndex > 1 ? stepIndex-- : undefined">
        Back
      </button-root>
      <div class="flex items-center gap-3">
        <button-root
          v-if="stepIndex !== 3"
          :disabled="isSubmitting || isNextDisabled"
          :loading="isSubmitting"
          @click="handleNextStep">
          {{ stepIndex === 1 && !avatarFile ? 'Skip' : 'Next' }}
        </button-root>
        <button-root
          v-if="stepIndex === 3"
          :disabled="isSubmitting"
          :loading="isSubmitting">
          Submit
        </button-root>
      </div>
    </div>
  </stepper>

  <alert-dialog :open="stepIndex === 3">
    <alert-dialog-content>
      <alert-dialog-header>
        <alert-dialog-title class="flex items-center gap-2">
          <icon-heart class="size-8 text-primary" />
          Promotional Period
        </alert-dialog-title>
      </alert-dialog-header>
      <div class="flex items-center space-x-2">
        <div class="flex flex-col">
          <typography class="font-semibold">
            Lifetime Membership
          </typography>
          <typography>
            For a limited time, enjoy a free <b>LIFETIME</b> membership on us as a thank you for being one of our first members!
          </typography>
        </div>
      </div>
      <alert-dialog-footer>
        <button-root
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="handleCompleteOnboarding">
          Continue
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>