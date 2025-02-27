<script lang='ts' setup>
  import { type Database, type Tables, type TablesUpdate, TripDetailsType } from '@/types';

  const $appStore = useAppStore();
  const $store = usePlanningStore();
  const activeDetail = ref<Tables<'trip_details'> | undefined>(undefined);
  const isModifyDetailDialogOpen = ref(false);

  const hikeDetails = computed(() => {
    return $store.data?.trip_details.filter((detail) => {
      return detail.type === TripDetailsType.HIKE;
    }) || [];
  });

  /**
   * Creates a new detail for the selected trip.
   */
  const createNewDetail = async () => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: newDetail, error } = await supabase.from('trip_details')
        .insert({
          title: 'New detail',
          trip_id: Number($store.selectedTripId),
          type: TripDetailsType.HIKE,
          value: 'New hike detail description',
        })
        .select();

      if (newDetail?.length && !error) {
        $store.data.trip_details.push(newDetail[0]);
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new detail.');
    }
  };

  /**
   * Updates a trip
   * @param payload
   */
  const updateTrip = async (payload: TablesUpdate<'trips'>) => {
    try {
      const supabase = useSupabaseClient<Database>();
      const { data: updatedTrip, error } = await supabase.from('trips')
        .update(payload)
        .eq('id', Number($store.selectedTripId))
        .select();

      // Update the trip in the store.
      if (updatedTrip?.length && $store.selectedTripId && !error) {
        const tripToUpdate = $store.data.trips.find((t) => t.id === Number($store.selectedTripId));
        if (tripToUpdate) {
          Object.assign(tripToUpdate, updatedTrip[0]);
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error updating the trip.');
    }
  };
</script>

<template>
  <card class="rounded-3xl px-8 py-4">
    <div class="grid grid-cols-[auto,auto,1fr] items-center justify-start">
      <icon-mountain class="mr-6 size-6 text-primary" />
      <div class="flex items-center gap-3">
        <typography class="!font-bold">
          Hike Details
        </typography>
        <icon-info
          v-tippy="{ content: 'Track details such as number of miles, elevation gains, and start and end points.' }"
          class="size-4 cursor-pointer text-muted-foreground" />
      </div>
      <button-root
        v-if="!$store.pageLoading && hikeDetails.length"
        class="justify-self-end rounded-full"
        data-testid="create-new-detail-btn"
        size="icon"
        variant="outline"
        @click="createNewDetail">
        <icon-plus />
      </button-root>
    </div>
    <gc-skeleton v-if="$store.pageLoading" />
    <gc-empty-state
      v-else-if="!$store.pageLoading && !hikeDetails.length"
      data-testid="hike-details-empty-state">
      <typography class="mb-4">
        You haven't created any hike details yet!
      </typography>
      <button-root
        size="sm"
        variant="outline"
        @click="createNewDetail">
        Get Started
      </button-root>
    </gc-empty-state>
    <div v-else>
      <div class="flex w-fit items-center gap-6">
        <gc-inline-edit
          :model-value="$store.selectedTrip?.starting_point"
          name="starting_point"
          placeholder="Ending point"
          size="sm"
          @update:model-value="updateTrip({ starting_point: ( $event as string ) })">
          <typography
            class="!font-black"
            variant="large">
            {{ $store.selectedTrip?.starting_point }}
          </typography>
        </gc-inline-edit>
        <icon-move-right class="size-6 text-muted-foreground" />
        <gc-inline-edit
          :model-value="$store.selectedTrip?.ending_point"
          name="ending_point"
          placeholder="Ending point"
          size="sm"
          @update:model-value="updateTrip({ ending_point: ( $event as string ) })">
          <typography
            class="!font-black"
            variant="large">
            {{ $store.selectedTrip?.ending_point }}
          </typography>
        </gc-inline-edit>
      </div>
      <div class="mb-6 flex items-center">
        <gc-inline-edit
          :model-value="$store.selectedTrip?.description"
          name="description"
          placeholder="Trip description"
          size="sm"
          @update:model-value="updateTrip({ description: ( $event as string ) })">
          <typography class="cursor-pointer text-muted-foreground">
            {{ $store.selectedTrip?.description }}
          </typography>
        </gc-inline-edit>
      </div>
      <ul>
        <li
          v-for="detail in hikeDetails"
          :key="detail.id"
          class="mb-0">
          <div class="group flex items-center justify-between gap-4">
            <div class="flex flex-1 items-center justify-between">
              <typography class="!font-bold text-muted-foreground">
                {{ detail.title }}
              </typography>
              <a
                v-if="detail.url"
                class="text-hyperlink"
                :href="detail.url"
                rel="noopener noreferrer"
                target="_blank">
                {{ detail.value }}
              </a>
              <typography
                v-else
                class="text-muted-foreground">
                {{ detail.value }}
              </typography>
            </div>
            <button-root
              class="rounded-full opacity-0 group-hover:opacity-100"
              size="sm"
              variant="ghost"
              @click="[activeDetail = detail, isModifyDetailDialogOpen = true]">
              <icon-pencil />
            </button-root>
          </div>
        </li>
      </ul>
    </div>
  </card>

  <!-- Modify Detail Dialog -->
  <lazy-modify-detail-dialog
    :active-detail="( activeDetail as Tables<'trip_details'> )"
    :is-open="isModifyDetailDialogOpen"
    @on-close="isModifyDetailDialogOpen = false" />
</template>
