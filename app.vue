<script lang="ts" setup>
  import type { Database } from '@/types';

  const supabase = useSupabaseClient<Database>();
  supabase.auth.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_OUT') {
      await supabase.removeAllChannels();
    }
  });

  // Use SSR-safe IDs for Headless UI
  provideHeadlessUseId(() => useId());
</script>

<template>
  <div class="bg-white dark:bg-black h-full">
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