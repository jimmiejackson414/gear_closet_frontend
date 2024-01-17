<script lang='ts' setup>
  interface Props {
    avatar?: boolean;
    lines?: number | string;
  }

  withDefaults(defineProps<Props>(), {
    avatar: false,
    lines: 3,
  });
</script>

<template>
  <div class="animate-pulse flex">
    <div
      v-if="avatar"
      class="flex-shrink-0">
      <span class="bg-gray-200 block h-12 rounded-full w-12" />
    </div>

    <div class="ms-4 mt-2 w-full">
      <h3
        class="bg-gray-200 h-4 rounded-full"
        style="width: 40%;" />

      <ul class="mt-5 space-y-3">
        <li
          v-for="index in Number(lines)"
          :key="index"
          class="bg-gray-200 h-4 rounded-full w-full" />
      </ul>
    </div>
  </div>
</template>
