<script lang='ts' setup>
  const { backgroundImage } = useAuthLayout();

  const computedImage = computed(() => {
    return {
      backgroundImage: `url(${backgroundImage.image})`,
    };
  });
</script>

<template>
  <div
    class="bg-cover bg-no-repeat flex flex-col lg:flex-row min-h-screen w-full"
    :style="computedImage">
    <div class="hidden lg:flex justify-between items-start p-4">
      <gc-logo
        :fill="backgroundImage.fill"
        :width="500" />
    </div>
    <div class="flex justify-center lg:justify-end items-center grow min-w-0 p-4 sm:p-8">
      <div class="max-w-md w-full min-w-0">
        <slot />
      </div>
    </div>
  </div>
</template>