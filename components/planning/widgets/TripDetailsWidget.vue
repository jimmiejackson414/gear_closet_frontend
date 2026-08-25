<script lang='ts' setup>
  import dayjs from 'dayjs';
  import { IconPencil, IconPlus } from '#components';
  import { usePlanningStore } from '@/stores/planning';
  import { TripDetailsType, type Tables, type TablesUpdate } from '@/types';

  const VueDatePicker = defineAsyncComponent(async () => {
    await import('@vuepic/vue-datepicker/dist/main.css');
    const { VueDatePicker: DatePicker } = await import('@vuepic/vue-datepicker');
    return DatePicker;
  });

  const $store = usePlanningStore();
  const activeDetail = ref<Tables<'trip_details'> | undefined>(undefined);
  const dialogMode = ref<'create' | 'edit'>('edit');
  const isModifyDetailDialogOpen = ref(false);

  const tripDetails = computed(() => {
    return $store.data?.trip_details.filter((detail) => detail.type === TripDetailsType.TRIP) || [];
  });

  const openDetail = (detail: Tables<'trip_details'>) => {
    activeDetail.value = detail;
    dialogMode.value = 'edit';
    nextTick(() => {
      isModifyDetailDialogOpen.value = true;
    });
  };

  const closeDetail = () => {
    isModifyDetailDialogOpen.value = false;
  };

  const openCreate = () => {
    activeDetail.value = undefined;
    dialogMode.value = 'create';
    nextTick(() => {
      isModifyDetailDialogOpen.value = true;
    });
  };
  const updateTrip = (payload: TablesUpdate<'trips'>) => $store.updateTrip(payload);

  const datePicker = ref(null);
  const editingTripDates = ref(false);
  const dateRange = computed(() => [$store.selectedTrip?.starting_date || '', $store.selectedTrip?.ending_date || '']);
  const format = (dates: Date[]) => {
    const date1 = dayjs(dates[0])
      .format('MMM D, YYYY');
    const date2 = dates[1] ? dayjs(dates[1])
      .format('MMM D, YYYY') : '';
    return `${date1} to ${date2}`;
  };

  const formattedDate = (date: string | undefined | null) => {
    if (!date) return '';
    return dayjs(date)
      .format('MMM D, YYYY');
  };

  onClickOutside(datePicker, () => editingTripDates.value = false);
</script>

<template>
  <card class="px-4 sm:px-8 py-4 rounded-3xl">
    <div class="justify-start items-center grid grid-cols-[auto_auto_1fr]">
      <icon-footprints class="mr-6 w-6 h-6 text-primary" />
      <p class="font-bold! text-base">
        Trip Details
      </p>
      <button-root
        v-if="!$store.pageLoading && tripDetails.length && $store.canEditSelectedTrip"
        aria-label="Add trip detail"
        class="justify-self-end rounded-full"
        data-testid="create-trip-detail-btn"
        size="icon"
        type="button"
        @click="openCreate">
        <icon-plus aria-hidden="true" />
      </button-root>
    </div>
    <gc-skeleton v-if="$store.pageLoading" />
    <div v-else>
      <div class="flex flex-col mb-6">
        <gc-inline-edit
          :disabled="!$store.canEditSelectedTrip"
          :model-value="$store.selectedTrip?.name"
          name="trip_name"
          placeholder="Trip Name"
          size="sm"
          @update:model-value="updateTrip({ name: $event as string | null })">
          <typography
            class="font-black!"
            variant="large">
            {{ $store.selectedTrip?.name }}
          </typography>
        </gc-inline-edit>
        <div>
          <div
            v-if="!editingTripDates"
            class="group flex flex-wrap items-center gap-2 sm:gap-4"
            @click="$store.canEditSelectedTrip && (editingTripDates = !editingTripDates)">
            <typography class="text-muted-foreground cursor-pointer">
              {{ $store.selectedTrip?.starting_date ? formattedDate($store.selectedTrip?.starting_date) : 'Start Date' }}
            </typography>
            <icon-move-right class="w-6 h-6 text-muted-foreground" />
            <typography class="text-muted-foreground cursor-pointer">
              {{ $store.selectedTrip?.ending_date ? formattedDate($store.selectedTrip?.ending_date) : 'End Date' }}
            </typography>
            <button-root
              v-if="$store.canEditSelectedTrip"
              aria-label="Edit trip dates"
              class="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 rounded-full"
              size="sm"
              type="button"
              variant="ghost">
              <icon-pencil aria-hidden="true" />
            </button-root>
          </div>
          <vue-date-picker
            v-else
            ref="datePicker"
            :action-row="{ showNow: false, showPreview: false, showCancel: false, showSelect: true }"
            :auto-apply="true"
            class="gc-dp"
            :formats="{ input: format, preview: format }"
            :hide-navigation="['time']"
            :model-value="dateRange"
            placeholder="Start and End Dates"
            range
            :time-config="{ enableTimePicker: false }"
            :ui="{ calendarCell: 'gc-dp-cell', input: 'gc-dp-input' }"
            @update:model-value="
              updateTrip({ starting_date: $event[0], ending_date: $event[1] }),
              editingTripDates = false;
            " />
        </div>
      </div>
      <gc-empty-state v-if="!tripDetails.length">
        <p class="mb-4 text-base">
          You haven't added any trip details yet!
        </p>
        <button-root
          v-if="$store.canEditSelectedTrip"
          size="sm"
          variant="outline"
          @click="openCreate">
          Get Started
        </button-root>
      </gc-empty-state>
      <details-list
        v-else
        :can-edit="$store.canEditSelectedTrip"
        :details="tripDetails"
        @edit="openDetail" />
    </div>

    <modify-detail-dialog
      v-if="isModifyDetailDialogOpen"
      :active-detail="activeDetail"
      :detail-type="TripDetailsType.TRIP"
      :is-open="true"
      :mode="dialogMode"
      @on-close="closeDetail" />
  </card>
</template>
