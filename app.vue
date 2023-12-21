<script lang="ts" setup>
  import type { Database } from '~/types';

  const supabase = useSupabaseClient<Database>();

  supabase.auth.onAuthStateChange((event, _session) => {
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
  @import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;700;900&display=swap");

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