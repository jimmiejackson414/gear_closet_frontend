<script lang='ts' setup>
  import { MountainIcon, MoveRightIcon, PencilIcon, PlusIcon } from 'lucide-vue-next';
  import { usePlanningStore } from '@/stores/planning';
  import { TripDetailType, type Database, type TripDetail } from '@/types';

  const emits = defineEmits(['create', 'update']);
  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const { data, pageLoading, selectedTrip } = storeToRefs($store);

  const hikeDetails = computed(() => {
    return data.value?.trip_details.filter((detail) => {
      return detail.type === TripDetailType.HIKE;
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
          type: TripDetailType.HIKE,
          value: 'New hike detail description',
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
</script>

<template>
  <div class="bg-white px-8 py-4 rounded-4xl shadow-light">
    <div class="grid grid-cols-[auto,auto,1fr] justify-start items-center py-4">
      <mountain-icon class="h-6 mr-6 text-primary w-6" />
      <p class="font-bold text-base">
        Hike Details
      </p>
      <gc-button
        v-if="!pageLoading && hikeDetails.length"
        class="justify-self-end"
        :icon="PlusIcon"
        round
        size="sm"
        variant="positive"
        @click="createNewDetail" />
    </div>
    <gc-skeleton v-if="pageLoading" />
    <gc-empty-state v-else-if="!pageLoading && !hikeDetails.length">
      <p class="mb-4 text-base">
        You haven't created any hike details yet!
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
            <div class="flex justify-between items-center flex-1">
              <span class="!font-bold text-base text-grey">
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
                class="font-bold text-base text-grey">
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
