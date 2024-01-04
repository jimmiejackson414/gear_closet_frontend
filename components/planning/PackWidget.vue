<script lang='ts' setup>
  import { BackpackIcon } from 'lucide-vue-next';
  import type { ExtendedPack } from '~/types/helpers';

  interface Props {
    data?: ExtendedPack;
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: undefined,
    loading: false,
  });
</script>

<template>
  <div class="bg-white p-4 rounded-4xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <backpack-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Pack
      </p>
    </div>
    <gc-skeleton v-if="loading" />
    <gc-empty-state v-else-if="!loading && !data">
      <p class="mb-4 text-base-lg">
        You haven't added a pack to this trip yet!
      </p>
      <gc-button
        label="Add a pack"
        outlined
        size="sm"
        type="button" />
    </gc-empty-state>
    <div v-else>
      Display pack chart
    </div>
  </div>
</template>
