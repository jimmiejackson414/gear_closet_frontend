<script lang='ts' setup>
  import { ColumnsIcon, MoveRightIcon, PencilIcon, PlusIcon } from 'lucide-vue-next';
  import { TripDetailType, type Database, type Trip, type TripDetail } from '@/types';
  import type { PlanningPageData } from '@/pages/planning.vue';
  
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
  const $store = useAppStore();

  const hikeDetails = computed(() => {
    return props.data?.trip_details.filter((detail) => {
      return detail.type === TripDetailType.HIKE;
    });
  });

  /**
   * Creates a new detail for the selected trip.
   */
  const createNewDetail = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: newDetail, error } = await supabase.from('trip_details')
        .insert({
          trip_id: props.selectedTrip?.id as number,
          title: 'New detail',
          type: TripDetailType.HIKE,
          value: 'New detail description',
        })
        .select();

      if (newDetail?.length && !error) {
        emits('create', newDetail);
      }
    } catch (err) {
      console.log({ err });
      $store.notifyNegative('There was an error creating a new detail.');
    }
  };

  const isEditDialogOpen = ref(false);
  const activeDetail = ref<TripDetail | null>(null);
  const toggleEditDialog = (detail: TripDetail) => {
    activeDetail.value = detail;
    isEditDialogOpen.value = !isEditDialogOpen.value;
  };
</script>

<template>
  <div class="bg-white px-8 py-4 rounded-4xl shadow-light">
    <div class="grid grid-cols-[auto,auto,1fr] justify-start items-center py-4">
      <columns-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Hike Details
      </p>
      <gc-button
        v-if="!loading && data?.trip_details.length"
        class="justify-self-end"
        :icon="PlusIcon"
        round
        size="sm"
        variant="positive"
        @click="createNewDetail" />
    </div>
    <gc-skeleton v-if="loading" />
    <gc-empty-state v-else-if="!loading && !data?.trip_details.length">
      <p class="mb-4 text-base">
        You haven't created any hike details yet!
      </p>
      <gc-button
        label="Add a detail"
        outlined
        size="sm"
        @click="createNewDetail" />
    </gc-empty-state>
    <div v-else>
      <div class="flex items-center gap-6 mb-3">
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
      <ul>
        <li
          v-for="detail in hikeDetails"
          :key="detail.id"
          class="mb-5">
          <div class="flex items-center group space-between">
            <div class="flex flex-1 flex-col">
              <span class="text-eyebrow text-grey">
                {{ detail.title }}
              </span>
              <a
                v-if="detail.url"
                class="font-bold text-base"
                :href="detail.url"
                rel="noopener noreferrer"
                target="_blank">
                {{ detail.value }}
              </a>
              <span
                v-else
                class="font-bold text-base">
                {{ detail.value }}
              </span>
            </div>
            <gc-button
              class="group-hover:opacity-100 opacity-0"
              ghost
              :icon="PencilIcon"
              round
              size="sm"
              @click="toggleEditDialog(detail)" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
