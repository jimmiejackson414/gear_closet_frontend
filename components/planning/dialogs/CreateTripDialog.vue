<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import dayjs from 'dayjs';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { IconBackpack, IconMapPin, IconText } from '#components';
  import { type Database, type TablesInsert, TripFriendRole } from '@/types';
  import type { RadarPlace } from '@/components/planning/types/searchResult';
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
      .max(50)
      .optional(),
    name: z.string()
      .min(3)
      .max(50),
    starting_point: z.string()
      .min(3)
      .max(50)
      .optional(),
  }));

  const { handleSubmit, isFieldDirty, isSubmitting, setFieldValue } = useForm({
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

  /**
   * Creates a new trip.
   */
  const $appStore = useAppStore();
  const dateRange = ref([]);
  const onSubmit = handleSubmit(async (values) => {
    try {
      isSubmitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const payload: TablesInsert<'trips'> = {
        description: values.description,
        ending_date: values.dateRange?.[1].toISOString(),
        ending_point: values.ending_point,
        name: values.name,
        starting_date: values.dateRange?.[0].toISOString(),
        starting_point: values.starting_point,
      };
      const { data: createdTrip, error } = await supabase.from('trips')
        .insert([payload])
        .select();

      if (error) { $appStore.notifyNegative('There was an error creating a new trip.'); }

      else {
        const { error } = await supabase.from('trip_friends')
          .insert({
            profile_id: user.value!.id,
            role: TripFriendRole.OWNER,
            trip_id: createdTrip[0].id,
          });

        if (error) throw error;
        $appStore.notifyPositive('Successfully created a new trip!');
        emits('onClose');
        if ($store.selectedTripId) {
          $store.selectedTripId = String(createdTrip[0].id);
          $store.data.trips.push(createdTrip[0]);
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating a new trip.');
    } finally {
      isSubmitting.value = false;
    }
  });

  const searchResults = ref<RadarPlace[]>([]);
  const isSearching = ref(false);

  /**
   * Debounced search function
   */
  const RADAR_TOKEN = useRuntimeConfig().public.radarAccessToken;
  const searchTrails = debounce(async (query: string) => {
    if (!query || query.length < 3) {
      searchResults.value = [];
      return;
    }

    isSearching.value = true;
    try {
      const response = await fetch(
        `https://api.radar.io/v1/search/autocomplete?` +
          `query=${encodeURIComponent(query)}&` +
          `limit=10&` +
          `layers=place`,
        {
          headers: {
            'Authorization': RADAR_TOKEN,
          },
        },
      );
      const data = await response.json();

      console.log({ data });
      searchResults.value = data.addresses?.map((place: any) => ({
        context: [{
          id: 'region',
          text: place.state,
        }, {
          id: 'country',
          text: place.country,
        }],
        country: place.country,
        geometry: {
          coordinates: [place.longitude, place.latitude],
        },
        id: place.placeLabel,
        name: place.placeLabel,
        place_name: `${place.placeLabel}, ${place.formattedAddress}`,
        properties: {
          category: place.layer || 'location',
        },
        state: place.state,
        text: place.placeLabel,
      })) || [];
    } catch (error) {
      console.error(error);
      $appStore.notifyNegative('There was an error searching for locations.');
    } finally {
      isSearching.value = false;
    }
  }, 300);
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="emits('onClose')"
      @interact-outside="emits('onClose')">
      <dialog-header>
        <dialog-title>Create A New Trip</dialog-title>
        <dialog-description />
      </dialog-header>
      <div class="w-full">
        <form class="flex w-full flex-col gap-6">
          <!-- Name -->
          <form-field
            v-slot="{ componentField }"
            name="name"
            :validate-on-blur="!isFieldDirty">
            <form-item>
              <form-label>Trip Name</form-label>
              <form-control>
                <combobox
                  v-bind="componentField"
                  :loading="isSearching"
                  :model-value="componentField.value"
                  :options="searchResults.map((result: RadarPlace) => ({
                    label: result.name,
                    value: result.id,
                    place_name: result.place_name,
                    category: result.properties?.category || 'location',
                    context: [{
                      id: 'region',
                      text: result.state
                    }, {
                      id: 'country',
                      text: result.country
                    }],
                    coordinates: [result.geometry.coordinates[0], result.geometry.coordinates[1]]
                  }))"
                  placeholder="Search for a trail (e.g. Appalachian Trail)"
                  :prepend-icon="IconBackpack"
                  @update:model-value="(value: string) => {
                    console.log({ value });
                    const selected = searchResults.find(r => r.id === value);
                    if (!selected) return;

                    // Set the trail name
                    setFieldValue('name', selected.name);

                    // Set description using context
                    const description = [
                      selected.layer || 'location',
                      selected.state,
                      selected.country
                    ].filter(Boolean).join(', ');
                    setFieldValue('description', description);

                    // Set location
                    const location = `${selected.name}, ${selected.state}`;
                    setFieldValue('starting_point', location);
                    setFieldValue('ending_point', location);
                  }"
                  @update:search-term="searchTrails">
                  <template #option="{ option }">
                    <div class="flex flex-col gap-0.5">
                      <span class="font-medium">{{ option.label }}</span>
                      <span class="text-xs text-muted-foreground">{{ option.place_name }}</span>
                    </div>
                  </template>
                </combobox>
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
                  placeholder="A 2,200 mile long hiking trail in the eastern United States"
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
                <input-root
                  :disabled="isSubmitting"
                  placeholder="Springer Mountain, Georgia"
                  :prepend-icon="IconMapPin"
                  v-bind="componentField" />
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
                <input-root
                  :disabled="isSubmitting"
                  placeholder="Katahdin, Maine"
                  :prepend-icon="IconMapPin"
                  v-bind="componentField" />
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
                v-bind="componentField"
                ref="datePicker"
                :action-row="{ showNow: false, showPreview: false, showCancel: false, showSelect: true }"
                :auto-apply="true"
                calendar-cell-class-name="gc-dp-cell"
                class="gc-dp !w-full"
                :format="format"
                :hide-navigation="['time']"
                input-class-name="gc-dp-input"
                :model-value="dateRange"
                name="datePicker"
                placeholder="Start and End Dates"
                :preview-format="format"
                range
                @update:model-value="dateRange = $event">
                <template #input-icon>
                  <icon-calendar class="pointer-events-none absolute left-2.5 top-1/2 inline-block size-5 -translate-y-1/2 text-base text-foreground" />
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
