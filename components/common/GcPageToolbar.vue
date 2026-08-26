<script lang="ts" setup>
  interface Props {
    title: string
  }

  defineProps<Props>();
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-x-3 gap-y-3 mb-6 min-w-0"
    data-testid="page-toolbar">
    <h1 class="text-2xl sm:text-3xl basis-full sm:basis-auto min-w-0 shrink-0">
      {{ title }}
    </h1>
    <div class="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0 flex-1 sm:flex-none sm:ml-auto sm:justify-end">
      <slot />
    </div>
  </div>
</template>
