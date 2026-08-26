<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { VueDatePicker } from '@vuepic/vue-datepicker';
  import dayjs from 'dayjs';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { IconBackpack, IconText } from '#components';
  import { coordsFromPlace } from '@/utils/places';
  import type { Database, TablesInsert } from '@/types';
  import type { PlaceSuggestion } from '@/types/places';
  import '@vuepic/vue-datepicker/dist/main.css';

  interface Props {
    isOpen: boolean;
  }

  defineProps<Props>();
  const emits = defineEmits<{
    (event: 'onClose'): void;
  }>();

  const $store = usePlanningStore();
  const formSchema = toTypedSchema(z.object({
    dateRange: z.array(z.date())
      .length(2)
      .optional(),
    description: z.string()
      .min(3)
      .max(500)
      .optional(),
    ending_point: z.string()
      .min(3)
      .max(200)
      .optional(),
    name: z.string()
      .min(3)
      .max(50),
    starting_point: z.string()
      .min(3)
      .max(200)
      .optional(),
  }));

  const { handleSubmit, isFieldDirty, isSubmitting } = useForm({
    validationSchema: formSchema,
  });

  const datePicker = ref(null);
  const format = (dates: Date[]) => {
    const date1 = dayjs(dates[0])
      .format('MMM D, YYYY');
    const date2 = dates[1] ? dayjs(dates[1])
      .format('MMM D, YYYY') : '';
    return `${date1} to ${date2}`;
  };

  /** VueDatePicker v14 types `onBlur` as `() => void`; vee-validate passes `(e: Event) => void`. */

  const datePickerFieldBind = (componentField: any) => {
    const { onBlur, ...rest } = componentField;
    return {
      ...rest,
      onBlur: () => {
        onBlur?.();
      },
    };
  };

  /**
   * Creates a new trip.
   */
  const $appStore = useAppStore();
  const dateRange = ref([]);
  const originPlace = ref<PlaceSuggestion | null>(null);
  const destinationPlace = ref<PlaceSuggestion | null>(null);
  const onSubmit = handleSubmit(async (values) => {
    try {
      isSubmitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const origin = coordsFromPlace(originPlace.value);
      const destination = coordsFromPlace(destinationPlace.value);
      const payload: TablesInsert<'trips'> = {
        description: values.description,
        destination_lat: destination.lat,
        destination_lng: destination.lng,
        destination_place_id: destination.placeId,
        ending_date: values.dateRange?.[1]?.toISOString(),
        ending_point: values.ending_point,
        name: values.name,
        origin_lat: origin.lat,
        origin_lng: origin.lng,
        origin_place_id: origin.placeId,
        profile_id: user.value?.sub as string,
        starting_date: values.dateRange?.[0]?.toISOString(),
        starting_point: values.starting_point,
      };
      const { data: createdTrip, error } = await supabase.from('trips')
        .insert([payload])
        .select();

      if (error) { $appStore.notifyNegative('There was an error creating a new trip.'); }
      else {
        $appStore.notifyPositive('Successfully created a new trip!');
        emits('onClose');
        const trip = createdTrip?.[0];
        if (trip) {
          const cookie = useCookie('selectedTripId');
          cookie.value = encrypt(String(trip.id));
          $store.selectedTripId = String(trip.id);
          if (!$store.data.trips.some(t => t.id === trip.id)) {
            $store.data.trips.push(trip);
          }
          await $store.fetchPlanningPage(trip.id);
        }
      }
    } catch {
      $appStore.notifyNegative('There was an error creating a new trip.');
    } finally {
      isSubmitting.value = false;
    }
  });
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="emits('onClose')"
      @interact-outside="emits('onClose')">
      <dialog-header>
        <dialog-title>Create A New Trip</dialog-title>
        <dialog-description />
      </dialog-header>
      <div class="w-full">
        <form class="flex flex-col gap-6 w-full">
          <!-- Name -->
          <form-field
            v-slot="{ componentField }"
            name="name"
            :validate-on-blur="!isFieldDirty">
            <form-item>
              <form-label>Trip Name</form-label>
              <form-control>
                <input-root
                  :disabled="isSubmitting"
                  :prepend-icon="IconBackpack"
                  v-bind="componentField" />
              </form-control>
            </form-item>
          </form-field>

          <!-- Description -->
          <form-field
            v-slot="{ componentField }"
            name="description"
            :validate-on-blur="!isFieldDirty">
            <form-item>
              <form-label>Description</form-label>
              <form-control>
                <input-root
                  :disabled="isSubmitting"
                  :prepend-icon="IconText"
                  v-bind="componentField" />
              </form-control>
            </form-item>
          </form-field>

          <!-- Starting Point -->
          <form-field
            v-slot="{ componentField }"
            name="starting_point"
            :validate-on-blur="!isFieldDirty">
            <form-item>
              <form-label>Trip Origin</form-label>
              <form-control>
                <gc-place-search
                  :disabled="isSubmitting"
                  placeholder="Search a trailhead, park, or town"
                  v-bind="componentField"
                  @select="originPlace = $event" />
              </form-control>
            </form-item>
          </form-field>

          <!-- Ending Point -->
          <form-field
            v-slot="{ componentField }"
            name="ending_point"
            :validate-on-blur="!isFieldDirty">
            <form-item>
              <form-label>Trip Destination</form-label>
              <form-control>
                <gc-place-search
                  :disabled="isSubmitting"
                  placeholder="Search a trailhead, park, or town"
                  v-bind="componentField"
                  @select="destinationPlace = $event" />
              </form-control>
            </form-item>
          </form-field>

          <!-- Datepicker -->
          <form-field
            v-slot="{ componentField }"
            name="dateRange"
            :validate-on-blur="!isFieldDirty">
            <form-item>
              <form-label>Start and End Dates</form-label>
              <vue-date-picker
                v-bind="datePickerFieldBind(componentField)"
                ref="datePicker"
                :action-row="{ showNow: false, showPreview: false, showCancel: false, showSelect: true }"
                :auto-apply="true"
                class="w-full! gc-dp"
                :formats="{ input: format, preview: format }"
                :hide-navigation="['time']"
                :input-attrs="{ name: 'datePicker' }"
                :model-value="dateRange"
                placeholder="Start and End Dates"
                :range="{ partialRange: false }"
                :time-config="{ enableTimePicker: false }"
                :ui="{ calendarCell: 'gc-dp-cell', input: 'gc-dp-input' }"
                @update:model-value="dateRange = $event">
                <template #input-icon>
                  <icon-calendar class="w-4 h-4 text-gray-400" />
                </template>
              </vue-date-picker>
            </form-item>
          </form-field>
        </form>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="isSubmitting"
          @click="emits('onClose')">
          Cancel
        </dialog-close>
        <button-root
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="onSubmit">
          Create Trip
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
