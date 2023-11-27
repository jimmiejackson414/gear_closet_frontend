<script lang='ts' setup>
  import { useHead } from '@unhead/vue';
  import { BookUserIcon, CheckCircleIcon, HeartIcon } from 'lucide-vue-next';
  import PageLayout from '@/layouts/PageLayout.vue'; 
  import GcAvatarUpload from '@/components/common/GcAvatarUpload.vue';
  import GcInput from '@/components/common/GcInput.vue';
  import GcButton from '@/components/common/GcButton.vue';
  import FadeTransition from '@/components/transitions/FadeTransition.vue';
  import { tailwind } from '@/helpers';
  import { useValidate } from '@/composables';
  import type { FilePondFile } from 'filepond';
  
  // global 
  const step = ref(1);
  const submitting = ref(false);

  // 1. avatar
  const avatarFile = ref<any>(null);
  const uploadError = ref(false);
  const uploadedAvatar = computed(() => avatarFile.value !== null);
  const handleAddAvatar = (file: FilePondFile) => {
    uploadError.value = false;
    avatarFile.value = file;
  };
  const handleRemoveAvatar = () => {
    avatarFile.value = null;
  };
  const handleAvatarError = () => {
    uploadError.value = true;
  };

  // 2. account
  const account = reactive({
    first_name: '',
    last_name: '',
    trail_name: '',
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
  const handleSubmitStepTwo = () => {
    console.log(`handleSubmitStepTwo`);
  };

  // 3. plans
  const handleComplete = () => {
    console.log(`handleComplete`);
  };

  useHead({
    title: 'Onboarding | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Get started with Gear Closet',
      },
    ],
  });
</script>

<template>
  <div class="px-6 md:px-14 py-9">
    <page-layout
      align-logo="center"
      minimal>
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
            { 'text-primary': step >= 2},
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
          class="flex justify-center mt-6">
          <div class="flex flex-col w-full">
            <p class="text-base text-center">
              1. Upload a profile picture
            </p>
            <gc-avatar-upload
              class="h-full max-h-[250px] max-w-[250px] mt-6 mx-auto w-full"
              @handle-add-file="handleAddAvatar"
              @handle-error="handleAvatarError"
              @handle-remove-file="handleRemoveAvatar" />
            <gc-button
              class="mt-6 self-center"
              :disabled="submitting"
              :label="uploadedAvatar ? 'Next' : 'Skip'"
              :loading="submitting"
              @click="step++" />
          </div>
        </div>

        <div
          v-else-if="step === 2"
          class="flex justify-center flex-col max-w-xl mt-6 mx-auto">
          <p class="text-base text-center">
            2. Update your details
          </p>
          <div class="grid md:grid-cols-6 grid-cols-1 gap-4 mt-6 w-full">
            <!-- First Name -->
            <gc-input
              v-model="account.first_name"
              autocomplete="given-name"
              class="md:col-span-3"
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
              class="md:col-span-3"
              :disabled="submitting"
              :error="fieldErrors.last_name"
              label="Last Name"
              name="last_name"
              required
              @blur="validateFieldOnBlur('last_name')" />

            <!-- Trail Name -->
            <gc-input
              v-model="account.trail_name"
              class="md:col-span-6"
              :disabled="submitting"
              label="Trail Name (optional)"
              name="trail_name" />

            <!-- City, State, Country -->
            <gc-input
              v-model="account.city"
              autocomplete="address-level2"
              class="md:col-span-2"
              :disabled="submitting"
              label="City"
              name="city" />

            <gc-input
              v-model="account.state"
              autocomplete="address-level1"
              class="md:col-span-2"
              :disabled="submitting"
              label="State/Province"
              name="state" />

            <gc-input
              v-model="account.country"
              autocomplete="country"
              class="md:col-span-2"
              :disabled="submitting"
              label="Country"
              name="country" />
          </div>
          <gc-button
            class="mt-6 self-center"
            :disabled="submitting"
            label="Next"
            :loading="submitting"
            @click="handleSubmitStepTwo" />
        </div>

        <div v-else-if="step === 3">
          Step 3
          <button
            class="btn"
            @click="handleComplete">
            Finish
          </button>
        </div>
      </fade-transition>
    </page-layout>
  </div>
</template>
