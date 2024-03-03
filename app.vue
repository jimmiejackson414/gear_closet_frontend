<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { Database, Profile } from '@/types';

  const supabase = useSupabaseClient<Database>();

  // if profile and profile has no onboarding_date, redirect to onboarding
  const $store = useUserStore();
  const { profile } = storeToRefs($store);
  const $router = useRouter();
  useAsyncData(async () => {
    // TODO: Fix this to replace commented out code in watcher
    const response = await $fetch<Profile | null>('/api/profile');
    profile.value = response;

    if (profile.value && !profile.value.onboard_date) {
      $router.push('/onboarding');
    }
  });
  // watch(profile, (newProfile) => {
  //   if (newProfile && !newProfile?.onboard_date) {
  //     $router.push('/onboarding');
  //   }
  // }, { immediate: true });

  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      supabase.removeAllChannels();
    }
  });
</script>

<template>
  <div class="bg-white h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;600;700;900&display=swap");

  .page-enter-active,
  .page-leave-active,
  .layout-enter-active,
  .layout-leave-active {
    transition: all 0.4s;
  }
  .page-enter-from,
  .page-leave-to,
  .layout-enter-from,
  .layout-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }
</style>