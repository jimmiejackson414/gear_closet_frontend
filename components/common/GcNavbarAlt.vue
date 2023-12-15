<script lang='ts' setup>
  import { RouterLink } from 'vue-router';
  import GcLogo from '@/components/icons/GcLogo.vue';

  interface Props {
    alignLogo?: 'start' | 'center' | 'end';
  }

  const props = withDefaults(defineProps<Props>(), {
    alignLogo: 'start',
  });

  const classList = computed(() => {
    let classes = ['flex'];
    if (props.alignLogo === 'center') classes.push('justify-center');
    if (props.alignLogo === 'end') classes.push('justify-end');
    if (props.alignLogo === 'start') classes.push('justify-start');
    return classes;
  });
</script>

<template>
  <nav :class="classList">
    <nuxt-link :to="{ name: 'login' }">
      <gc-logo :width="250" />
    </nuxt-link>
  </nav>
</template>
