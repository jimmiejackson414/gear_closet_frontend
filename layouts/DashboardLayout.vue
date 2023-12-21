<script lang='ts' setup>
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';

  const $store = useUserStore();
  const { loading } = storeToRefs($store);

  await $store.fetchProfile();
</script>

<template>
  <div>
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer />
      <div class="min-h-screen">
        <div class="pl-[72px] pr-4 lg:pr-9 py-4">
          <div class="container">
            <slot />
          </div>
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
