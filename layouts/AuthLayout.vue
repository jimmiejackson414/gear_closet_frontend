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
    class="flex min-h-screen w-full flex-row bg-cover bg-no-repeat"
    :style="computedImage">
    <div class="flex items-start justify-between p-4">
      <gc-logo
        :fill="backgroundImage.fill"
        :width="500" />
    </div>
    <div class="flex grow items-center justify-end p-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>