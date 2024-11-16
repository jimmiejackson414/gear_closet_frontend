<script lang='ts' setup>
  import type { Tables } from '@/types';
  import type { SelectOption } from '@/types/helpers';

  const $store = usePlanningStore();
  const { data, pageLoading, selectedTripId } = storeToRefs($store);
  const { isPaidMember } = storeToRefs(useUserStore());

  const tripOptions = computed(() => data.value.trips.map((t: Tables<'trips'>) => ({ label: t.name, value: t.id })) as SelectOption[]);

  /**
   * Leaves the current trip.
   */
  const leaveTrip = async () => {
    // TODO: implement
  };

  /**
   * Handles selecting a trip and setting the cookie.
   */
  const handleSelectTrip = async (trip: { label: string, value: number }) => {
    const cookie = useCookie('selectedTripId');
    cookie.value = encrypt(trip.value);
  };
</script>

<template>
  <div class="flex justify-between lg:justify-end items-center gap-6 mb-8">
    <div class="flex justify-center items-center gap-4">
      <div class="flex">
        <headless-menu
          as="div"
          class="inline-block relative text-left">
          <div>
            <headless-menu-button class="duration-150 ease-snap focus-visible:ring-2 focus-visible:ring-white/0 font-medium inline-flex justify-center outline-none focus:outline-none px-4 py-2 rounded-md text-gray-500 hover:text-dark-grey text-sm w-full">
              <icon-settings
                class="h-6 w-6"
                data-testid="settings-icon" />
            </headless-menu-button>
          </div>
          <zoom-transition>
            <headless-menu-items class="absolute right-0 bg-white divide-gray-100 divide-y mt-2 origin-top-right ring-1 ring-black/5 rounded-md shadow-lg w-56 focus:outline-none">
              <headless-menu-item @click="leaveTrip">
                <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-dark-grey hover:bg-gray-100">
                  Leave Trip
                </p>
              </headless-menu-item>
            </headless-menu-items>
          </zoom-transition>
        </headless-menu>
      </div>
      <gc-select
        :disabled="pageLoading || (!isPaidMember && data.trips.length >= 1)"
        :model-value="selectedTripId"
        name="selected-trip-select"
        no-options-copy="No trips found"
        :options="tripOptions"
        placeholder="Selected Trip"
        @update:model-value="handleSelectTrip" />
    </div>

    <div v-tippy="{ content: !isPaidMember && data.trips.length >= 1 ? 'Free accounts are limited to one pack. Please upgrade to enjoy unlimited packs!' : '' }">
      <gc-button
        :disabled="pageLoading || (!isPaidMember && data.trips.length >= 1)"
        label="New Trip"
        size="sm"
        @click="$store.dialogStates.createTripDialog = true" />
    </div>
  </div>
</template>
