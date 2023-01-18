<template>
  <nav :class="[`justify-${alignLogo} row`]">
    <router-link :to="{ name: 'login' }">
      <Logo :width="250" />
    </router-link>
  </nav>
</template>

<script lang='ts' setup>
  import { RouterLink } from 'vue-router';
  import Logo from '@/components/common/icons/Logo.vue';

  interface Props {
    alignLogo?: 'start' | 'center' | 'end';
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { alignLogo = 'start' } = defineProps<Props>();
</script>
