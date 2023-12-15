<script setup lang="ts">
  definePageMeta({
    layout: 'auth-layout',
  });

  const user = useSupabaseUser();

  watch(user, () => {
    if (user.value) {
      return navigateTo('/dashboard');
    }
  }, { immediate: true });

</script>

<template>
  <div>Waiting for login...</div>
</template>