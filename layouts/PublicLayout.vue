<script lang='ts' setup>
  import GcNavbarAlt from '@/components/common/GcNavbarAlt.vue';
  import GcFooter from '@/components/common/GcFooter.vue';
  import type { Profile } from '@/types';

  const loading = ref(false);

  const user = useSupabaseUser();
  const isLoggedIn = computed(() => !!user.value);

  const $store = useUserStore();
  const { profile } = storeToRefs($store);

  const { data, error } = await useFetch<Profile | null>('/api/profile', {
    headers: useRequestHeaders(['cookie']),
  });

  profile.value = data.value as any;

  const $router = useRouter();
  if (!error.value && data.value && !data.value.onboard_date) {
    $router.push('/onboarding');
  }
</script>

<template>
  <div class="bg-white">
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer v-if="isLoggedIn" />
      <div class="min-h-screen pt-5">
        <div
          class="container-xxl p-4"
          :class="!isLoggedIn ? 'px-4' : 'pl-[90px] pr-4 lg:pr-0 2xl:pl-0 py-9'">
          <gc-navbar v-if="isLoggedIn" />
          <gc-navbar-alt
            v-else
            align-logo="center" />
          <div class="py-6">
            <slot />
          </div>
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
