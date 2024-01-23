<script lang='ts' setup>
  interface Props {
    id: string;
    label?: string;
  }

  defineProps<Props>();
</script>

<template>
  <div
    :id="id"
    class="absolute bg-dark-grey duration-300 font-medium inline-block invisible opacity-0 px-3 py-2 rounded-lg shadow-sm text-sm text-white tooltip transition-opacity z-10"
    role="tooltip"
    @mouseover="$event.stopPropagation">
    <span v-if="$slots.default">
      <slot />
    </span>
    <span v-else>
      {{ label }}
    </span>
  </div>
</template>
