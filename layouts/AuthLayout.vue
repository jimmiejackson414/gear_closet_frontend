<script lang='ts' setup>
  const { backgroundImage } = await useAuthLayout();

  const computedImage = computed(() => {
    return {
      backgroundImage: `url(${backgroundImage.image})`,
    };
  });
</script>

<template>
  <div
    class="bg-cover bg-no-repeat flex h-screen relative w-full"
    :style="computedImage">
    <div class="flex justify-between items-start p-4">
      <gc-logo
        :fill="backgroundImage.fill"
        :width="500" />
    </div>
    <div class="flex justify-end items-center flex-grow mt-8 p-8">
      <div class="max-w-md w-full">
        <slot />
      </div>
    </div>
  </div>
</template>