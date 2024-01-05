<script lang='ts' setup>
  import { ColumnsIcon, MoveRightIcon } from 'lucide-vue-next';
  import { TripDetailType, type Trip } from '~/types';
  import type { PlanningPageData } from '~/pages/planning.vue';
  
  interface Props {
    data?: PlanningPageData;
    selectedTrip?: Trip;
    loading: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: undefined,
    selectedTrip: undefined,
    loading: false,
  });

  const emits = defineEmits(['create', 'update']);

  const hikeDetails = computed(() => {
    return props.data?.trip_details.filter((detail) => {
      return detail.type === TripDetailType.HIKE;
    });
  });
</script>

<template>
  <div class="bg-white p-4 rounded-4xl shadow-light">
    <div class="flex justify-start items-center py-4">
      <columns-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Hike Details
      </p>
    </div>
    <gc-skeleton v-if="loading" />
    <gc-empty-state v-else-if="!loading && !data?.trip_details.length">
      <p class="mb-4 text-base">
        You haven't added any hike details to this trip yet!
      </p>
      <gc-button
        label="Add a detail"
        outlined
        size="sm"
        @click="emits('create', TripDetailType.HIKE)" />
    </gc-empty-state>
    <div v-else>
      <div class="flex items-center gap-6">
        <gc-inline-edit
          :model-value="selectedTrip?.starting_point"
          name="starting_point"
          placeholder="Ending point"
          size="sm"
          @handle-update="emits('update')">
          <h5 class="!font-black text-base-lg">
            {{ selectedTrip?.starting_point }}
          </h5>
        </gc-inline-edit>
        <move-right-icon class="h-6 text-grey w-6" />
        <gc-inline-edit
          :model-value="selectedTrip?.ending_point"
          name="ending_point"
          placeholder="Ending point"
          size="sm"
          @handle-update="emits('update')">
          <h5 class="!font-black text-base-lg">
            {{ selectedTrip?.ending_point }}
          </h5>
        </gc-inline-edit>
      </div>
    </div>
  </div>
</template>
