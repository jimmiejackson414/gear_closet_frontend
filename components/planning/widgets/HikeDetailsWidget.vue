<script lang='ts' setup>
  import { type Tables, type TablesUpdate, TripDetailsType } from '@/types';

  const $store = usePlanningStore();
  const activeDetail = ref<Tables<'trip_details'> | undefined>(undefined);
  const isModifyDetailDialogOpen = ref(false);

  const hikeDetails = computed(() => {
    return $store.data?.trip_details.filter((detail) => {
      return detail.type === TripDetailsType.HIKE;
    }) || [];
  });

  const createNewDetail = () => $store.createTripDetail(TripDetailsType.HIKE);
  const updateTrip = (payload: TablesUpdate<'trips'>) => $store.updateTrip(payload);
</script>

<template>
  <card class="px-8 py-4 rounded-3xl">
    <div class="grid grid-cols-[auto_auto_1fr] justify-start items-center">
      <icon-mountain class="h-6 mr-6 text-primary w-6" />
      <typography class="font-bold!">
        Hike Details
      </typography>
      <button-root
        v-if="!$store.pageLoading && hikeDetails.length"
        class="justify-self-end rounded-full"
        data-testid="create-new-detail-btn"
        size="icon"
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
      <div class="flex items-center gap-6">
        <gc-inline-edit
          :model-value="$store.selectedTrip?.starting_point"
          name="starting_point"
          placeholder="Ending point"
          size="sm"
          @update:model-value="updateTrip({ starting_point: $event as string | null })">
          <typography
            class="font-black!"
            variant="large">
            {{ $store.selectedTrip?.starting_point }}
          </typography>
        </gc-inline-edit>
        <icon-move-right class="h-6 text-muted-foreground w-6" />
        <gc-inline-edit
          :model-value="$store.selectedTrip?.ending_point"
          name="ending_point"
          placeholder="Ending point"
          size="sm"
          @update:model-value="updateTrip({ ending_point: $event as string | null })">
          <typography
            class="font-black!"
            variant="large">
            {{ $store.selectedTrip?.ending_point }}
          </typography>
        </gc-inline-edit>
      </div>
      <div class="flex items-center mb-6">
        <gc-inline-edit
          :model-value="$store.selectedTrip?.description"
          name="description"
          placeholder="Trip description"
          size="sm"
          @update:model-value="updateTrip({ description: $event as string | null })">
          <typography class="cursor-pointer text-muted-foreground">
            {{ $store.selectedTrip?.description }}
          </typography>
        </gc-inline-edit>
      </div>
      <details-list
        :details="hikeDetails"
        @edit="[activeDetail = $event, isModifyDetailDialogOpen = true]" />
    </div>
  </card>

  <!-- Modify Detail Dialog -->
  <lazy-modify-detail-dialog
    :active-detail="( activeDetail as Tables<'trip_details'> )"
    :is-open="isModifyDetailDialogOpen"
    @on-close="isModifyDetailDialogOpen = false" />
</template>
