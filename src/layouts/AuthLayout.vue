<script lang='ts' setup>
  import GcLogo from '@/components/icons/GcLogo.vue';

  interface Props {
    fill: string;
    image: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    fill: '#4a4a4a',
    image: '',
  });

  const computedImage = computed(() => {
    return {
      backgroundImage: `url(${props.image})`,
    };
  });
</script>

<template>
  <div class="h-screen w-full">
    <div class="grid grid-cols-1 grid-rows-1 h-full">
      <div
        :style="computedImage"
        class="bg-cover bg-left bg-no-repeat" />
      <div class="absolute top-0 right-0 left-0 max-w-3xl mx-8 my-4">
        <gc-logo
          :width="500"
          :fill="props.fill" />
      </div>
      <div class="absolute right-0 bg-white grid grid-cols-1 justify-center h-full items-center max-w-lg px-12 py-8 rounded-s-3xl w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

