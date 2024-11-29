<script lang='ts' setup>
  import GcLogoIcon from '@/components/icons/GcLogoIcon.vue';

  interface Props {
    title: string;
    subtitle: string;
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    subtitle: '',
  });
</script>

<template>
  <div class="flex justify-center items-center flex-col min-h-screen">
    <div class="bg-white flex flex-col max-w-xl overflow-hidden rounded-2xl shadow-lg w-full">
      <div class="flex justify-center items-center flex-col h-[150px] px-4 relative w-full">
        <div class="absolute top-0 -left-[70px] bg-primary flex flex-col h-full rounded-b-[50%] w-[150%]" />
        <div class="auto-rows-auto grid grid-cols-1 h-full items-center pb-12 pt-4 px-0 text-center w-full">
          <gc-logo-icon
            fill="#fff"
            wrapper-class="mx-auto z-50 w-12 h-12" />
          <typography
            class="text-white z-10"
            variant="h3">
            {{ title }}
          </typography>
          <typography
            class="!mt-0 text-white z-10"
            variant="p">
            {{ subtitle }}
          </typography>
        </div>
      </div>
      <div class="flex flex-col pb-4 pt-6 px-4 w-full">
        <slot />
      </div>
    </div>
  </div>
</template>