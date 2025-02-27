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
  <div class="flex animate-pulse">
    <div
      v-if="avatar"
      class="shrink-0">
      <span class="block size-12 rounded-full bg-gray-200" />
    </div>

    <div class="ms-4 mt-2 w-full">
      <h3
        class="h-4 rounded-full bg-gray-200"
        style="width: 40%;" />

      <ul class="mt-5 space-y-3">
        <li
          v-for="index in Number(lines)"
          :key="index"
          class="h-4 w-full rounded-full bg-gray-200" />
      </ul>
    </div>
  </div>
</template>
