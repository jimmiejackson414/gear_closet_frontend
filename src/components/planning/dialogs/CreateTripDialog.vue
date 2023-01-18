<template>
  <q-dialog
    :model-value="props.isOpen"
    class="create-trip-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-form @submit.prevent.stop="handleCreate">
        <q-card-section class="header">
          <div class="row justify-between align-center">
            <h6 class="text-h6 q-ma-none">
              Create A New Trip
            </h6>
          </div>
          <p
            v-if="props.description"
            class="text-body1 q-mb-none">
            {{ props.description }}
          </p>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 q-col-gutter-sm">
              <!-- Name -->
              <q-input
                v-model="data.name"
                outlined
                dense
                :disable="isSubmitting"
                label="Name">
                <template #prepend>
                  <q-icon name="bi-fonts" />
                </template>
              </q-input>
              <!-- Description -->
              <q-input
                v-model="data.description"
                outlined
                dense
                :disable="isSubmitting"
                label="Description"
                autogrow>
                <template #prepend>
                  <q-icon name="bi-fonts" />
                </template>
              </q-input>
              <!-- Starting Point -->
              <q-input
                v-model="data.starting_point"
                outlined
                dense
                :disable="isSubmitting"
                label="Starting Point"
                autogrow>
                <template #prepend>
                  <q-icon name="bi-geo-fill" />
                </template>
              </q-input>
              <!-- Ending Point -->
              <q-input
                v-model="data.ending_point"
                outlined
                dense
                :disable="isSubmitting"
                label="Ending Point"
                autogrow>
                <template #prepend>
                  <q-icon name="bi-geo-fill" />
                </template>
              </q-input>
              <!-- Datepicker -->
              <q-input
                v-model="formattedDatepicker"
                outlined
                dense
                label="Start and End Dates">
                <template #prepend>
                  <q-icon
                    name="bi-calendar-check"
                    class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale">
                      <q-date
                        v-model="datepicker"
                        minimal
                        range
                        @input="closeDatepicker">
                        <div class="row items-center justify-between">
                          <q-btn
                            v-close-popup
                            label="Close"
                            flat
                            color="text"
                            :ripple="false" />
                          <q-btn
                            v-close-popup
                            label="Select"
                            :ripple="false"
                            color="primary"
                            flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-between">
          <q-btn
            unelevated
            :ripple="false"
            flat
            text-color="text"
            label="Cancel"
            :disable="isSubmitting"
            @click="emit('handleClose')" />
          <q-btn
            unelevated
            :ripple="false"
            color="primary"
            label="Create"
            :disable="isSubmitting"
            type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import {
    reactive, ref, watch, watchEffect,
  } from 'vue';
  import dayjs from 'dayjs';
  import duration from 'dayjs/plugin/duration';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { CreateTripInput } from '@/generated/types';
  import { usePlanningStore } from '@/stores/planning';
  import { useUserStore } from '@/stores/user';
  import { capitalize } from '@/helpers/functions';

  dayjs.extend(duration);
  dayjs.extend(relativeTime);

  // instantiate store
  const store = usePlanningStore();
  const userStore = useUserStore();

  // define props
  const props = defineProps<{
    isOpen: boolean;
    description?: string;
  }>();

  // define emits
  const emit = defineEmits(['handleClose']);

  // local data
  const isSubmitting = ref(false);
  const datepicker = ref({
    from: '' as string | undefined,
    to: '' as string | undefined,
  });
  const formattedDatepicker = ref('');
  const data = reactive({
    name: '',
    description: '',
    starting_point: '',
    ending_point: '',
  });

  const closeDatepicker = (): void => {
    console.log('closeDatepicker');
  };

  // handle update function
  const handleCreate = async (): Promise<void> => {
    isSubmitting.value = true;
    const payload = { ...data, user_id: userStore.currentUser?.id };

    store.toggleLoading();
    await store.createTrip(payload as CreateTripInput);
    emit('handleClose');

    isSubmitting.value = false;
  };

  watch(() => datepicker, (newVal) => {
    const from = dayjs(newVal.value.from);
    const to = dayjs(newVal.value.to)
      .add(1, 'day');
    const calcDuration = dayjs.duration(from.diff(to))
      .humanize();
    formattedDatepicker.value = capitalize(calcDuration);
  }, { deep: true });

  watchEffect(() => {
    if (!props.isOpen) {
      data.name = '';
      data.description = '';
      data.starting_point = '';
      data.ending_point = '';
      datepicker.value = {
        from: '',
        to: '',
      };
      formattedDatepicker.value = '';
    }
  });
</script>

<style lang="scss" scoped>
  .create-trip-dialog {
    .q-card {
      border-top: 5px solid $primary;
      min-width: 350px;
    }
  }
</style>
