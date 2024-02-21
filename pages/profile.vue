<script lang='ts' setup>
  import { Tabs } from 'flowbite';
  import { SubscriptionLevel } from '@/types';
  import type { InstanceOptions, TabsOptions, TabsInterface, TabItem } from 'flowbite';

  definePageMeta({ layout: 'page-layout' });

  const user = useUserStore().profile;
  const loading = useAppStore().loading;

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

  /* 
  * Instantiates the tabs component.
  */
  const activeTab = ref('profile'); // profile, settings, subscription
  let tabs: TabsInterface | null = null;
  const instantiateTabs = () => {
    const tabsElement = document?.getElementById('profile-tab') as HTMLElement;
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
        activeClasses: 'text-primary hover:text-primary !border-primary border-primary border-b-2',
        inactiveClasses: 'text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300',
      };
      const instanceOptions: InstanceOptions = {
        id: 'profile-tab',
        override: true,
      };
      tabs = new Tabs(tabsElement, tabElements, options, instanceOptions);
    }
  };
  instantiateTabs();

  // watch([() => loading, () => user], async (newValues) => {
  //   const [newLoading, newUser] = newValues;
  //   if (!newLoading && newUser) {
  //     await nextTick();
  //     instantiateTabs();
  //   }
  // }, { immediate: true });
</script>

<template>
  <div class="max-w-full lg:max-w-5xl mx-auto py-8 w-full">
    <div class="grid lg:grid-cols-[400px,1fr] grid-cols-1 gap-6 lg:gap-14">
      <gc-avatar-upload
        :file="(user!.image as string)"
        @handle-add-file="handleAddFile"
        @handle-error="handleError"
        @handle-remove-file="handleRemoveFile" />
      <div>
        <div class="auto-rows-auto grid grid-cols-1 gap-4">
          <div class="mb-4">
            <h2
              v-if="user?.trail_name"
              class="text-4xl">
              {{ user.trail_name }}
            </h2>
            <p class="mb-4 text-lg">
              {{ friendlyUsername(user, { includeTrailName: false }) }}
            </p>
            <gc-subscription-pill :subscription="(user!.subscription_level as SubscriptionLevel)" />
          </div>
          <gc-input
            autocomplete="email"
            class="w-full"
            disabled
            label="Email"
            :model-value="user!.email"
            name="email"
            placeholder="Email"
            required />
          <gc-input
            v-model="user!.first_name"
            autocomplete="given-name"
            class="w-full"
            disabled
            label="First Name"
            name="firstName"
            placeholder="Tom"
            required />
          <gc-input
            v-model="user!.last_name"
            autocomplete="family-name"
            class="w-full"
            disabled
            label="Last Name"
            name="lastName"
            placeholder="Jones"
            required />
        </div>
      </div>
    </div>
  </div>
</template>
