<script lang='ts' setup>
  import { CheckCircleIcon, BookUserIcon, HeartIcon } from 'lucide-vue-next';
  import type { FilePondFile } from 'filepond';
  import { SubscriptionLevel, MeasuringSystem, type Database } from '@/types';
  import { Modal, type InstanceOptions, type ModalInterface, type ModalOptions } from 'flowbite';
  import type { SelectOption } from '@/types/helpers';

  definePageMeta({ layout: 'page-layout' });

  // global
  const step = ref(1);
  const submitting = ref(false);
  const $store = useUserStore();
  const { profile } = storeToRefs($store);

  // 1. avatar
  const avatarFile = ref<any>(null);
  const uploadError = ref(false);
  const uploadedAvatar = computed(() => avatarFile.value !== null);

  const handleAddAvatar = (file: FilePondFile) => {
    uploadError.value = false;
    avatarFile.value = file;
    submitting.value = false;
  };

  const handleRemoveAvatar = () => {
    avatarFile.value = null;
  };

  const handleAvatarError = () => {
    uploadError.value = true;
  };

  const handleUploadAvatar = async () => {
    if (uploadedAvatar.value) {
      const { success } = await $store.updateAvatar(avatarFile.value.file);
      if (success) step.value = 2;
      else uploadError.value = true;
    } else {
      step.value = 2;
    }
  };

  // 2. account
  const account = reactive({
    first_name: '',
    last_name: '',
    trail_name: '',
    measuring_system: MeasuringSystem.IMPERIAL,
    city: '',
    state: '',
    country: '',
  });

  const rules = {
    first_name: [
      (val: string): boolean | string => (val && val.length > 0) || 'Required field',
    ],
    last_name: [
      (val: string): boolean | string => (val && val.length > 0) || 'Required field',
    ],
  };

  const { fieldErrors, validateForm, validateFieldOnBlur } = useValidate(account, rules);
  const handleSubmitStepTwo = async () => {
    try {
      submitting.value = true;

      if (!validateForm()) return;

      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.from('profiles')
        .update({
          first_name: account.first_name,
          last_name: account.last_name,
          trail_name: account.trail_name,
          city: account.city,
          state: account.state,
          country: account.country,
        })
        .eq('id', profile.value!.id)
        .select();

      if (error) {
        console.error({ error });
        return;
      }

      step.value = 3;
    } catch (error) {
      console.error({ error });
    } finally {
      submitting.value = false;
    }
  };

  // prefill account info if exists
  watch(profile, () => {
    if (profile.value) {
      account.first_name = profile.value.first_name || '';
      account.last_name = profile.value.last_name || '';
      account.trail_name = profile.value.trail_name || '';
    }
  }, { deep: true, immediate: true });

  // 3. plans
  const selectedPlan = ref<Tier | null>(null);
  const handleSelectedTier = (tier: Tier) => {
    selectedPlan.value = tier;
  };

  const submitLabel = computed(() => {
    if (!selectedPlan.value) return 'Select a plan';
    return `${(selectedPlan.value?.value === SubscriptionLevel.MONTHLY || selectedPlan.value?.value === SubscriptionLevel.ANNUAL)
      ? `Upgrade to ${selectedPlan.value?.title} Plan`
      : 'Continue with Free Plan'
    }`;
  });

  // finish onboarding and send to dashboard
  // TODO: handle stripe checkout session
  const $router = useRouter();
  const submitError = ref(false);
  const handleFinishOnboarding = async (subscriptionLevel: SubscriptionLevel) => {
    submitting.value = true;

    try {
      const supabase = useSupabaseClient<Database>();
      await supabase.from('profiles')
        .update({
          subscription_level: SubscriptionLevel.LIFE,
          onboard_date: new Date()
            .toISOString(),
        })
        .eq('id', profile.value!.id)
        .select();
      $router.push({ name: 'index' });
      // if free plan, manually create customer and subscription in stripe and push to dashboard
      // if (subscriptionLevel === SubscriptionLevel.FREE || subscriptionLevel === SubscriptionLevel.LIFE) {
      //   const res = await $subscriptionStore.createFreeSubscription(subscriptionLevel, profile.value?.email as string);

      //   if (res.subscription && !res.errors) {
      //     $router.push({ name: 'dashboard' });
      //   } else {
      //     submitError.value = true;
      //   }
      // } else {
      // if upgrading, create checkout session and redirect to stripe checkout
      //   const { session } = await $subscriptionStore.createCheckoutSession(subscriptionLevel);
      //   const stripe = await getStripe();
      //   stripe?.redirectToCheckout({
      //     sessionId: session?.id as string,
      //   });
      // }
      // $store.sendWelcomeEmail();
    } catch (error) {
      console.error({ error });
    } finally {
      submitting.value = false;
    }
  };

  const handleOpenTempModal = async () => {
    await nextTick();

    const $targetEl = document.querySelector('#onboarding-alert-modal') as HTMLElement;
    if (!$targetEl) return;

    const options: ModalOptions = {
      placement: 'center',
      backdrop: 'static',
      closable: false,
      onHide: () => console.log('onHide'),
      onShow: () => console.log('onShow'),
      onToggle: () => console.log('onToggle'),
    };

    const instanceOptions: InstanceOptions = {
      id: 'onboarding-alert-modal',
      override: true,
    };

    const modal: ModalInterface = new Modal($targetEl, options, instanceOptions);

    modal.show();
  };

  watch(step, async () => {
    if (step.value === 3) {
      await nextTick();
      handleOpenTempModal();
    }
  }, { immediate: true });

  useHead({
    title: 'Onboarding | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet, let\'s get started!',
      },
    ],
  });
</script>

<template>
  <div class="px-6 md:px-14 py-9">
    <div class="flex justify-center mb-8">
      <h6 class="text-2xl text-center">
        Onboarding
      </h6>
    </div>

    <!-- stepper nav -->
    <ol class="flex justify-center items-center font-medium max-w-4xl mx-auto text-center sm:text-base text-gray-500 text-sm w-full">
      <li
        class="duration-100 ease-in-out flex sm:after:content-[''] items-center text-primary transition-all after:border-4 after:border-b after:h-1 after:hidden after:mx-6 after:rounded-xl after:w-full sm:after:inline-block md:w-full xl:after:mx-10"
        :class="[
          step >= 2 ? 'after:border-primary-light' : 'after:border-gray-300'
        ]">
        <span class="flex after:content-['/'] items-center after:mx-2 after:text-gray-300 sm:after:hidden">
          <span
            class="me-2.5 p-2 rounded-full w-auto"
            :class="step === 1 ? 'bg-primary-light' : 'bg-white'">
            <check-circle-icon
              class="h-4 sm:h-5 w-4 sm:w-5"
              :color="tailwind.theme.colors['text-primary']"
              :stroke-width="3" />
          </span>
          Personal <span class="hidden sm:inline-flex sm:ms-2">Avatar</span>
        </span>
      </li>
      <li
        class="duration-100 ease-in-out flex after:content-[''] items-center transition-all after:border-4 after:border-b after:border-gray-300 after:h-1 after:hidden after:mx-6 after:rounded-xl after:w-full sm:after:inline-block md:w-full xl:after:mx-10"
        :class="[
          { 'text-dark-grey': step === 1 },
          { 'text-primary': step >= 2 },
          { 'after:border-primary-light': step >= 3 },
        ]">
        <span class="flex after:content-['/'] items-center after:mx-2 after:text-gray-300 sm:after:hidden">
          <span
            class="me-2 p-2 rounded-full w-auto"
            :class="step === 2 ? 'bg-primary-light' : 'bg-white'">
            <check-circle-icon
              v-if="step >= 2"
              class="h-4 sm:h-5 w-4 sm:w-5"
              :color="tailwind.theme.colors['primary']"
              :stroke-width="3" />
            <book-user-icon
              v-else
              class="h-4 sm:h-5 w-4 sm:w-5"
              :color="tailwind.theme.colors['grey']" />
          </span>
          Account <span class="hidden sm:inline-flex sm:ms-2">Info</span>
        </span>
      </li>
      <li
        class="duration-100 ease-in-out flex items-center transition-all"
        :class="step === 3 ? 'text-primary' : 'text-dark-grey'">
        <span
          class="me-2 p-2 rounded-full w-auto"
          :class="step === 3 ? 'bg-primary-light' : 'bg-white'">
          <check-circle-icon
            v-if="step === 3"
            class="h-4 sm:h-5 w-4 sm:w-5"
            :color="tailwind.theme.colors['primary']"
            :stroke-width="3" />
          <heart-icon
            v-else
            class="h-4 sm:h-5 w-4 sm:w-5"
            :color="tailwind.theme.colors['grey']"
            :stroke-width="3" />
        </span>
        Plan <span class="hidden sm:inline-flex sm:ms-2">Options</span>
      </li>
    </ol>

    <!-- stepper content -->
    <fade-transition>
      <div
        v-if="step === 1"
        class="flex justify-center max-w-4xl mt-6 mx-auto">
        <div class="flex flex-col w-full">
          <p class="font-bold text-base text-center">
            1. Upload a profile picture
          </p>
          <gc-alert
            v-if="uploadError"
            class="!w-fit mt-6 mx-auto"
            message="There was an error uploading your avatar.<br>Please try again later, or update from your profile settings." />
          <gc-avatar-upload
            class="h-full max-h-[350px] max-w-[350px] mt-6 mx-auto w-full"
            @handle-add-file="handleAddAvatar"
            @handle-error="handleAvatarError"
            @handle-process-start="submitting = true"
            @handle-remove-file="handleRemoveAvatar" />
          <gc-button
            class="self-end"
            :disabled="submitting"
            :label="uploadedAvatar ? 'Next' : 'Skip'"
            :loading="submitting"
            @click="handleUploadAvatar" />
        </div>
      </div>

      <div
        v-else-if="step === 2"
        class="flex justify-center flex-col max-w-xl mt-6 mx-auto">
        <p class="font-bold text-base text-center">
          2. Update your details
        </p>
        <div class="grid md:grid-cols-6 grid-cols-1 gap-4 mt-6 w-full">
          <!-- First Name -->
          <gc-input
            v-model="account.first_name"
            autocomplete="given-name"
            class="!w-full md:col-span-3"
            :disabled="submitting"
            :error="fieldErrors.first_name"
            label="First name"
            name="first_name"
            required
            @blur="validateFieldOnBlur('first_name')" />

          <!-- Last Name -->
          <gc-input
            v-model="account.last_name"
            autocomplete="family-name"
            class="!w-full md:col-span-3"
            :disabled="submitting"
            :error="fieldErrors.last_name"
            label="Last Name"
            name="last_name"
            required
            @blur="validateFieldOnBlur('last_name')" />

          <!-- Trail Name -->
          <gc-input
            v-model="account.trail_name"
            class="!w-full md:col-span-3"
            :disabled="submitting"
            label="Trail Name (optional)"
            name="trail_name" />

          <!-- Measuring System -->
          <gc-select
            class="!w-full md:col-span-3"
            :disabled="submitting"
            label="Preferred measurement system"
            :model-value="account.measuring_system"
            :options="[
              { label: 'Imperial (lbs, oz)', value: MeasuringSystem.IMPERIAL },
              { label: 'Metric (kgs, g)', value: MeasuringSystem.METRIC }
            ]"
            @update:model-value="(val: SelectOption) => account.measuring_system = ( val.value as MeasuringSystem )" />

          <!-- City, State, Country -->
          <gc-input
            v-model="account.city"
            autocomplete="address-level2"
            class="!w-full md:col-span-2"
            :disabled="submitting"
            label="City (optional)"
            name="city" />

          <gc-input
            v-model="account.state"
            autocomplete="address-level1"
            class="!w-full md:col-span-2"
            :disabled="submitting"
            label="State/Province (optional)"
            name="state" />

          <gc-input
            v-model="account.country"
            autocomplete="country"
            class="!w-full md:col-span-2"
            :disabled="submitting"
            label="Country (optional)"
            name="country" />
        </div>
        <gc-button
          class="mt-6 self-center md:self-end"
          :disabled="submitting"
          label="Next"
          :loading="submitting"
          @click="handleSubmitStepTwo" />
      </div>

      <div
        v-else-if="step === 3"
        class="flex justify-center flex-col max-w-4xl mt-6 mx-auto">
        <p class="font-bold text-base text-center">
          3. Explore our plans
        </p>
        <p class="text-base text-center">
          Please make a select to complete onboarding!
        </p>
        <div class="grid md:grid-cols-3 grid-cols-1 gap-8 mt-6 w-full">
          <upgrade-card
            v-for="tier in tiers"
            :key="tier.title"
            :is-selected="selectedPlan?.value === tier.value"
            :submitting="submitting"
            :tier="tier"
            @handle-action="handleSelectedTier" />
        </div>
        <gc-button
          class="mt-6 self-center"
          :disabled="submitting || !selectedPlan"
          :label="submitLabel"
          :loading="submitting"
          @click="handleFinishOnboarding" />
      </div>
    </fade-transition>

    <gc-modal
      id="onboarding-alert-modal"
      :cancel-button="false"
      :closeable="false"
      :is-open="step === 3"
      title="Promotional Period">
      <template #content>
        <p class="text-base">
          For a limited time, enjoy a free <b>LIFETIME</b> membership on us as a thank you for being one of our first members!
        </p>
        <p class="text-base">
          Click the Continue button to get started.
        </p>
      </template>
      <template #actions>
        <div class="flex justify-end w-full">
          <gc-button
            label="Finish"
            size="sm"
            @click="() => handleFinishOnboarding(SubscriptionLevel.LIFE)" />
        </div>
      </template>
    </gc-modal>
  </div>
</template>
