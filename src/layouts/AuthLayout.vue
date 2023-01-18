<template>
  <q-layout view="lHh lpR lFf">
    <q-page-container :class="{ 'q-pt-xl q-pb-md': $q.platform.is.mobile }">
      <div class="logo-container">
        <Logo
          :width="500"
          :fill="fill" />
      </div>
      <div
        class="image-container"
        data-cy="auth-layout-image" />
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script lang='ts' setup>
  import { useQuasar } from 'quasar';
  import Logo from '@/components/common/icons/Logo.vue';

  const props = defineProps({
    fill: {
      type: String,
      required: true,
      default: '#4a4a4a',
    },
    image: {
      type: String,
      required: true,
      default: '',
    },
  });

  const $q = useQuasar();
</script>

<style lang="scss" scoped>
  .q-page-container {
    background: v-bind("image") no-repeat left center fixed;
    background-size: cover;
    height: 100vh;
    width: auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    align-items: start;
    justify-content: center;
    position: relative;

    @media (min-width: $breakpoint-sm-min) {
      background: none;
      grid-template-columns: 60% 40%;
      grid-template-rows: 1fr;
    }

    footer {
      background-color: #fff;
      padding: 1rem;
      text-align: center;

      @media (min-width: $breakpoint-sm-min) {
        background-color: transparent;
      }
    }
  }

  .logo-container {
    margin: 1rem 2rem;

    @media (min-width: $breakpoint-sm-min) {
      max-width: 400px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  }

  .image-container {
    display: none;

    @media (min-width: $breakpoint-sm-min) {
      background: v-bind("props.image") no-repeat left center fixed;
      display: block;
      background-size: cover;
      height: 100%;
      width: auto;
    }
  }
</style>
