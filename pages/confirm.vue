<script setup lang="ts">
  definePageMeta({ colorMode: 'light', layout: 'auth-layout' });
  useHead({ title: 'Confirm '});

  const user = useSupabaseUser();

  watch(user, () => {
    if (user.value) {
      return navigateTo('/');
    }
  }, { immediate: true });

</script>

<template>
  <div>Waiting for login...</div>
</template>