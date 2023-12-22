<script lang='ts' setup>
  const $store = useAppStore();
  const $userStore = useUserStore();

  $userStore.fetchProfile();
</script>

<template>
  <div>
    <gc-loading-wrapper v-if="$store.loading" />
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
