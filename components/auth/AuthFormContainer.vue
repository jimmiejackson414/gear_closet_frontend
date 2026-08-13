<script lang='ts' setup>
  import GcLogoIcon from '@/components/icons/GcLogoIcon.vue';

  interface Props {
    title?: string;
    subtitle?: string;
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    subtitle: '',
  });
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-screen">
    <div class="flex flex-col bg-white shadow-lg rounded-2xl w-full max-w-xl overflow-hidden">
      <div class="relative flex flex-col justify-center items-center px-4 w-full h-37.5">
        <div class="top-0 -left-17.5 absolute flex flex-col bg-primary rounded-b-[50%] w-[150%] h-full" />
        <div class="items-center grid grid-cols-1 auto-rows-auto px-0 pt-4 pb-12 w-full h-full text-center">
          <gc-logo-icon
            fill="#fff"
            wrapper-class="mx-auto z-50 w-12 h-12" />
          <typography
            class="z-10 text-white"
            variant="h3">
            {{ title }}
          </typography>
          <typography
            class="z-10 mt-0! text-white"
            variant="p">
            {{ subtitle }}
          </typography>
        </div>
      </div>
      <div class="flex flex-col px-4 pt-6 pb-4 w-full">
        <slot />
      </div>
    </div>
  </div>
</template>