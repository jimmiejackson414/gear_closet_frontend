<script lang='ts' setup>
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';

  const $store = useUserStore();
  const { loading } = storeToRefs($store);

  await $store.fetchCurrentUser();
</script>

<template>
  <div>
    <gc-loading-wrapper v-if="loading" />
    <div v-else>
      <gc-drawer />
      <div class="min-h-screen">
        <div class="p-4 pl-[72px] pr-9">
          <slot />
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
