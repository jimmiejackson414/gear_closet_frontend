<script lang='ts' setup>
  import GcLogoIcon from '@/components/icons/GcLogoIcon.vue';

  interface Props {
    subtitle: string;
    title: string;
  }

  withDefaults(defineProps<Props>(), {
    subtitle: '',
    title: '',
  });
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center">
    <div class="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
      <div class="relative flex h-[150px] w-full flex-col items-center justify-center px-4">
        <div class="absolute left-[-70px] top-0 flex h-full w-[150%] flex-col rounded-b-[50%] bg-primary" />
        <div class="grid size-full auto-rows-auto grid-cols-1 items-center px-0 pb-12 pt-4 text-center">
          <gc-logo-icon
            fill="#fff"
            wrapper-class="mx-auto z-50 w-12 h-12" />
          <typography
            class="z-10 text-white"
            variant="h3">
            {{ title }}
          </typography>
          <typography
            class="z-10 !mt-0 text-white"
            variant="p">
            {{ subtitle }}
          </typography>
        </div>
      </div>
      <div class="flex w-full flex-col px-4 pb-4 pt-6">
        <slot />
      </div>
    </div>
  </div>
</template>