<script lang='ts' setup>
  import VueTailwindDatepicker from 'vue-tailwind-datepicker';
  import { FootprintsIcon, PencilIcon, PlusIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '@/stores/planning';
  import { TripDetailType } from '@/types';
  import type { Database, TripDetail } from '@/types';

  const emits = defineEmits(['create', 'update']);
  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const { data, pageLoading, selectedTrip } = storeToRefs($store);

  const tripDetails = computed(() => {
    return data.value?.trip_details.filter((detail) => {
      return detail.type === TripDetailType.TRIP;
    }) || [];
  });

  const isEditDialogOpen = ref(false);
  const activeDetail = ref<TripDetail | null>(null);
  const toggleEditDialog = (detail: TripDetail) => {
    activeDetail.value = detail;
    isEditDialogOpen.value = !isEditDialogOpen.value;
  };

  /**
   * Creates a new detail for the selected trip.
   */
  const createNewDetail = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: newDetail, error } = await supabase.from('trip_details')
        .insert({
          trip_id: selectedTrip?.value?.id as number,
          title: 'New detail',
          type: TripDetailType.TRIP,
          value: 'New trip detail description',
        })
        .select();

      if (newDetail?.length && !error) {
        data.value.trip_details.unshift(newDetail[0]);
      }
    } catch (err) {
      console.log({ err });
      $appStore.notifyNegative('There was an error creating a new detail.');
    }
  };

  // const startingDate = ref<string | undefined>(selectedTrip?.value?.starting_date as string);
  // const endingDate = ref<string | undefined>(selectedTrip?.value?.ending_date as string);
  const dateRange = ref<{ start: string | Date; end: string | Date; }>({
    start: '',
    end: '',
  });
</script>

<template>
  <div class="bg-white px-8 py-4 rounded-4xl shadow-light">
    <div class="grid grid-cols-[auto,auto,1fr] justify-start items-center py-4">
      <footprints-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Trip Details
      </p>
      <gc-button
        v-if="!pageLoading && tripDetails.length"
        class="justify-self-end"
        :icon="PlusIcon"
        round
        size="sm"
        variant="positive"
        @click="createNewDetail" />
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !tripDetails?.length">
      <p class="mb-4 text-base">
        You haven't added any trip details yet!
      </p>
      <gc-button
        label="Get Started"
        outlined
        size="sm"
        @click="createNewDetail" />
    </gc-empty-state>
    <div v-else>
      <div class="flex items-center gap-6 mb-3">
        <gc-inline-edit
          :model-value="selectedTrip?.name"
          name="trip_name"
          placeholder="Trip Name"
          size="sm"
          @handle-update="emits('update')">
          <h5 class="!font-black text-base-lg">
            {{ selectedTrip?.name }}
          </h5>
        </gc-inline-edit>
        <div class="hike-duration">
          <vue-tailwind-datepicker
            v-model="dateRange"
            as-single
            input-classes="focus:ring-1 focus:ring-primary focus:outline-none rounded-lg"
            placeholder="Start and End Dates"
            separator="to"
            use-range />
        </div>
      </div>
      <ul>
        <li
          v-for="detail in tripDetails"
          :key="detail.id"
          class="mb-5">
          <div class="flex items-center group space-between">
            <div class="flex flex-1 flex-col">
              <span class="text-eyebrow text-grey">
                {{ detail.title }}
              </span>
              <span class="font-bold text-base">
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
