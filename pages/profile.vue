<script lang='ts' setup>
  import { Tabs } from 'flowbite';
  import { SubscriptionLevel } from '@/types';
  import type { InstanceOptions, TabsOptions, TabItem } from 'flowbite';

  definePageMeta({ layout: 'page-layout' });

  const $store = useUserStore();
  const $appStore = useAppStore();

  const { loading } = storeToRefs($appStore);
  const { profile } = storeToRefs($store);
  const submitting = ref(false);

  /* Form Validation */
  const fieldErrors = ref<Record<string, string>>({});
  const rules = {
    email: [
      (val: string): boolean | string => (val && val.length > 0) || 'Email is required',
      (val: string): boolean | string => isValidEmail(val) || 'Not a valid email',
    ],
    firstName: [
      (val: string) => (val && val.length > 0) || 'First Name is required',
    ],
    lastName: [
      (val: string) => (val && val.length > 0) || 'Last Name is required',
    ],
    password: [
      (val: string) => (val && val.length > 0) || 'Password is required',
    ],
    passwordConfirm: [
      (val: string) => (val && val.length > 0) || 'Confirm Password is required',
      (val: string) => (newPassword.value === val) || 'Must match password',
    ],
  };

  // const { fieldErrors, validateForm, validateFieldOnBlur } = useValidate(form, rules);

  /**
   * Handles adding a file from the avatar upload component.
   * @param file The file to remove.
   */
  const handleAddFile = (file: File) => {
    console.log('File added', file);
  };

  /**
   * Handles removing a file from the avatar upload component.
   */
  const handleRemoveFile = () => {
    console.log('File removed');
  };

  /**
   * Handles an error from the avatar upload component.
   * @param e The error event.
   */
  const handleError = (e: Event) => {
    console.error('Error', e);
  };

  /**
   * Updates a user's profile.
   */
  const isProfileDisabled = computed(() => {
    return submitting.value || !profile.value?.email || !profile.value?.first_name || !profile.value?.last_name;
  });
  const updateProfile = () => {
    console.log('Update profile');
  };

  /**
   * Updates a user's password
   */
  const newPassword = ref<string | undefined>(undefined);
  const newPasswordConfirm = ref<string | undefined>(undefined);
  const isSettingsDisabled = computed(() => {
    return submitting.value || !newPassword.value || !newPasswordConfirm.value || newPassword.value !== newPasswordConfirm.value;
  });
  const updatePassword = () => {
    console.log('Update password');
  };

  /* 
  * Instantiates the tabs component.
  */
  const activeTab = ref('profile'); // profile, settings, subscription
  const instantiateTabs = () => {
    const tabsElement = document?.getElementById('tabs-group') as HTMLElement;
    if (tabsElement) {
      const tabElements: TabItem[] = [
        {
          id: 'profile',
          triggerEl: document?.querySelector('#profile-tab') as HTMLElement,
          targetEl: document?.querySelector('#profile') as HTMLElement,
        },
        {
          id: 'settings',
          triggerEl: document?.querySelector('#settings-tab') as HTMLElement,
          targetEl: document?.querySelector('#settings') as HTMLElement,
        },
        {
          id: 'subscription',
          triggerEl: document?.querySelector('#subscription-tab') as HTMLElement,
          targetEl: document?.querySelector('#subscription') as HTMLElement,
        },
      ];
      const options: TabsOptions = {
        defaultTabId: activeTab.value,
        activeClasses: 'text-primary font-bold hover:text-primary !border-primary border-primary border-b-2',
        inactiveClasses: 'text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300',
      };
      const instanceOptions: InstanceOptions = {
        id: 'tabs-group',
        override: true,
      };
      return new Tabs(tabsElement, tabElements, options, instanceOptions);
    }
  };

  watch([() => loading.value], async (newValues) => {
    const [newPageLoading] = newValues;

    if (!newPageLoading) {
      await nextTick();
      instantiateTabs();
    }
  }, { immediate: true });

  useHead({
    title: 'Profile | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet profile page!',
      },
    ],
  });
</script>

<template>
  <div class="max-w-full lg:max-w-5xl mx-auto py-8 w-full">
    <div class="grid lg:grid-cols-[400px,1fr] grid-cols-1 gap-6 lg:gap-14">
      <gc-avatar-upload
        :file="(profile!.image as string)"
        @handle-add-file="handleAddFile"
        @handle-error="handleError"
        @handle-remove-file="handleRemoveFile" />
      <div>
        <div class="mb-4">
          <h2
            v-if="profile?.trail_name"
            class="text-4xl">
            {{ profile.trail_name }}
          </h2>
          <p class="mb-4 text-lg">
            {{ friendlyUsername((profile as any), { includeTrailName: false }) }}
          </p>
          <gc-subscription-pill :subscription="(profile!.subscription_level as SubscriptionLevel)" />
        </div>
        <div class="border-b border-gray-200">
          <ul
            id="tabs-group"
            class="-mb-px flex flex-wrap font-medium text-center text-gray-500 text-sm"
            role="tablist">
            <li
              class="me-2"
              role="presentation">
              <button
                id="profile-tab"
                aria-controls="you"
                aria-selected="false"
                class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
                role="tab"
                type="button">
                Profile
              </button>
            </li>
            <li
              class="me-2"
              role="presentation">
              <button
                id="settings-tab"
                aria-controls="group"
                aria-selected="false"
                class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
                role="tab"
                type="button">
                Settings
              </button>
            </li>
            <li
              class="me-2"
              role="presentation">
              <button
                id="subscription-tab"
                aria-controls="group"
                aria-selected="false"
                class="border-b-2 hover:border-gray-300 border-transparent inline-block p-4 rounded-t-lg hover:text-gray-600"
                role="tab"
                type="button">
                Subscription
              </button>
            </li>
          </ul>
        </div>
        <div id="default-tab-content">
          <div
            id="profile"
            aria-labelledby="profile-tab"
            class="bg-gray-50 hidden p-4 rounded-lg"
            role="tabpanel">
            <div class="auto-rows-auto grid grid-cols-1 gap-6">
              <gc-input
                autocomplete="email"
                class="w-full"
                :disabled="submitting || loading"
                label="Email"
                :model-value="profile!.email"
                name="email"
                placeholder="Email"
                required />
              <gc-input
                v-model="profile!.first_name"
                autocomplete="given-name"
                class="w-full"
                :disabled="submitting || loading"
                label="First Name"
                name="firstName"
                placeholder="Tom"
                required />
              <gc-input
                v-model="profile!.last_name"
                autocomplete="family-name"
                class="w-full"
                :disabled="submitting || loading"
                label="Last Name"
                name="lastName"
                placeholder="Jones"
                required />
              <gc-input
                v-model="profile!.trail_name"
                class="w-full"
                :disabled="submitting || loading"
                label="Trail Name"
                name="trailName"
                required />
              <gc-button
                class="justify-self-end"
                :disabled="isProfileDisabled"
                label="Update"
                @click="updateProfile" />
            </div>
          </div>

          <div
            id="settings"
            aria-labelledby="settings-tab"
            class="bg-gray-50 hidden p-4 rounded-lg"
            role="tabpanel">
            <div class="auto-rows-auto grid grid-cols-1 gap-6">
              <gc-input
                v-model="newPassword"
                autocomplete="current-password"
                class="w-full"
                :disabled="submitting"
                :error="fieldErrors.password"
                label="New Password"
                name="password"
                password-toggle
                placeholder="Password"
                required
                type="password" />
              <gc-input
                v-model="newPasswordConfirm"
                autocomplete="confirm-password"
                class="w-full"
                :disabled="submitting"
                :error="fieldErrors.passwordConfirm"
                label="Confirm New Password"
                name="passwordConfirm"
                password-toggle
                placeholder="Confirm password"
                required
                type="password" />
              <gc-button
                class="justify-self-end"
                :disabled="isSettingsDisabled"
                label="Update"
                @click="updatePassword" />
            </div>
          </div>

          <div
            id="subscription"
            aria-labelledby="subscription-tab"
            class="bg-gray-50 hidden p-4 rounded-lg"
            role="tabpanel">
            <div class="auto-rows-auto grid grid-cols-1 gap-6">
              Subscription Tab
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
