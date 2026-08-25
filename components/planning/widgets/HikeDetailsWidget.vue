<script lang='ts' setup>
  import { TripDetailsType, type Tables, type TablesUpdate } from '@/types';
  import { coordsFromPlace } from '@/utils/places';
  import type { PlaceSuggestion } from '@/types/places';

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

  const saveOrigin = (place: PlaceSuggestion | null, label?: string) => {
    const coords = coordsFromPlace(place);
    updateTrip({
      starting_point: place?.label ?? label ?? $store.selectedTrip?.starting_point,
      origin_lat: coords.lat,
      origin_lng: coords.lng,
      origin_place_id: coords.placeId,
    });
  };

  const saveDestination = (place: PlaceSuggestion | null, label?: string) => {
    const coords = coordsFromPlace(place);
    updateTrip({
      ending_point: place?.label ?? label ?? $store.selectedTrip?.ending_point,
      destination_lat: coords.lat,
      destination_lng: coords.lng,
      destination_place_id: coords.placeId,
    });
  };
</script>

<template>
  <card class="px-4 sm:px-8 py-4 rounded-3xl">
    <div class="justify-start items-center grid grid-cols-[auto_auto_1fr]">
      <icon-mountain class="mr-6 w-6 h-6 text-primary" />
      <typography class="font-bold!">
        Hike Details
      </typography>
      <button-root
        v-if="!$store.pageLoading && hikeDetails.length && $store.canEditSelectedTrip"
        aria-label="Add hike detail"
        class="justify-self-end rounded-full"
        data-testid="create-new-detail-btn"
        size="icon"
        type="button"
        @click="createNewDetail">
        <icon-plus aria-hidden="true" />
      </button-root>
    </div>
    <gc-skeleton v-if="$store.pageLoading" />
    <div v-else>
      <div class="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-6">
        <gc-place-search
          :disabled="!$store.canEditSelectedTrip"
          :model-value="$store.selectedTrip?.starting_point"
          name="starting_point"
          placeholder="Starting point"
          variant="inline"
          @commit="(label) => saveOrigin(null, label)"
          @select="saveOrigin">
          <template #display>
            <typography
              class="font-black!"
              variant="large">
              {{ $store.selectedTrip?.starting_point }}
            </typography>
          </template>
        </gc-place-search>
        <icon-move-right class="hidden sm:block w-6 h-6 text-muted-foreground shrink-0" />
        <gc-place-search
          :disabled="!$store.canEditSelectedTrip"
          :model-value="$store.selectedTrip?.ending_point"
          name="ending_point"
          placeholder="Ending point"
          variant="inline"
          @commit="(label) => saveDestination(null, label)"
          @select="saveDestination">
          <template #display>
            <typography
              class="font-black!"
              variant="large">
              {{ $store.selectedTrip?.ending_point }}
            </typography>
          </template>
        </gc-place-search>
      </div>
      <div class="flex items-center mb-6">
        <gc-inline-edit
          :disabled="!$store.canEditSelectedTrip"
          :model-value="$store.selectedTrip?.description"
          name="description"
          placeholder="Trip description"
          size="sm"
          @update:model-value="updateTrip({ description: $event as string | null })">
          <typography class="text-muted-foreground cursor-pointer">
            {{ $store.selectedTrip?.description }}
          </typography>
        </gc-inline-edit>
      </div>
      <gc-empty-state
        v-if="!hikeDetails.length"
        data-testid="hike-details-empty-state">
        <typography class="mb-4">
          You haven't created any hike details yet!
        </typography>
        <button-root
          v-if="$store.canEditSelectedTrip"
          size="sm"
          variant="outline"
          @click="createNewDetail">
          Get Started
        </button-root>
      </gc-empty-state>
      <details-list
        v-else
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
