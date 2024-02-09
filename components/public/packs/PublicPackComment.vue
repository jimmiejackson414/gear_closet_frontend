<script lang='ts' setup>
  interface Props {
    comment: Comment;
  }
</script>

<template>
  <div class="flex items-start gap-2.5 relative">
    <div class="absolute top-0 left-3 bg-black h-full rounded-[50%] w-0.5" />
    <img
      alt="Jese image"
      class="h-8 rounded-full w-8"
      src="https://i.pravatar.cc/60">
    <div class="flex flex-col gap-1 max-w-[320px] w-full">
      <div class="flex items-center space-x-2 rtl:space-x-reverse">
        <span class="font-semibold text-gray-900 dark:text-white text-sm">Bonnie Green</span>
        <span class="font-normal text-gray-500 dark:text-gray-400 text-sm">11:46</span>
      </div>
      <div class="bg-gray-100 dark:bg-gray-700 border-gray-200 flex flex-col leading-1.5 p-4 rounded-e-xl rounded-es-xl">
        <p class="font-normal text-gray-900 dark:text-white text-sm">
          That's awesome. I think our users will really appreciate the improvements.
        </p>
      </div>
      <span class="font-normal text-gray-500 dark:text-gray-400 text-sm">Delivered</span>
    </div>
  </div>
</template>
