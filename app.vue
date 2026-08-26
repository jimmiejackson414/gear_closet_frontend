<script lang="ts" setup>
  import { ConfigProvider } from 'reka-ui';
  import type { Database } from '@/types';

  const supabase = useSupabaseClient<Database>();
  supabase.auth.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_OUT') {
      await supabase.removeAllChannels();
    }
  });

  // fixes SSR hydration issue with reka-ui
  const ssrId = () => useId();

  useHead({
    titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} | Gear Closet` : 'Gear Closet',
  });
</script>

<template>
  <config-provider :use-id="ssrId">
    <div class="h-full">
      <nuxt-loading-indicator
        color="hsl(var(--primary))"
        :height="3"
        :throttle="0" />
      <suspense>
        <nuxt-layout>
          <nuxt-page />
          <toaster />
        </nuxt-layout>
      </suspense>
    </div>
  </config-provider>
</template>

<style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;600;700;900&display=swap");

  .page-enter-active,
  .page-leave-active,
  .layout-enter-active,
  .layout-leave-active {
    transition: opacity 0.15s ease;
  }
  .page-enter-from,
  .page-leave-to,
  .layout-enter-from,
  .layout-leave-to {
    opacity: 0;
  }
</style>