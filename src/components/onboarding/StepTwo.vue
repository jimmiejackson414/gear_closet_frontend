<template>
  <div class="row q-mb-sm justify-center">
    <p class="text-body1 q-mt-none q-mb-md">
      2. Update your details
    </p>
  </div>
  <div class="row">
    <q-form class="full-width row">
      <div class="col-12 col-md-6 offset-md-3 q-gutter-y-sm">
        <!-- First Name -->
        <q-input
          v-model="state.first_name"
          outlined
          dense
          aria-required="true"
          label="First Name"
          :rules="nameRules">
          <template #prepend>
            <q-icon name="bi-person-circle" />
          </template>
        </q-input>
        <!-- Last Name -->
        <q-input
          v-model="state.last_name"
          outlined
          dense
          aria-required="true"
          label="Last Name"
          :rules="nameRules">
          <template #prepend>
            <q-icon name="bi-person-circle" />
          </template>
        </q-input>
        <!-- Trail Name -->
        <q-input
          v-model="state.trail_name"
          :style="{ marginBottom: '28px' }"
          outlined
          dense
          label="Trail Name (optional)">
          <template #prepend>
            <q-icon name="bi-person-circle" />
          </template>
        </q-input>
        <!-- GeoLocation -->
        <q-select
          v-model="state.location"
          :use-input="!state.location"
          input-debounce="500"
          label="Location (optional)"
          :options="options"
          dense
          clear-icon="bi-x"
          dropdown-icon="bi-chevron-down"
          clearable
          outlined
          @filter="fetchOptions">
          <template #prepend>
            <q-icon name="bi-geo-alt" />
          </template>
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </q-form>
    <q-stepper-navigation class="row full-width">
      <q-btn
        flat
        :ripple="false"
        color="primary"
        label="Back"
        class="q-ml-sm"
        @click="handlePrevStep" />
      <q-space />
      <q-btn
        color="primary"
        :loading="isSubmitting"
        :ripple="false"
        label="Continue"
        @click="handleNextStep" />
    </q-stepper-navigation>
  </div>
</template>

<script lang='ts' setup>
  import { reactive, ref } from 'vue';
  import { QSelect } from 'quasar';
  import { useUserStore } from '@/stores/user';
  import { getSdk } from '@/generated/types';
  import { useClient } from '@/lib/graphqlRequest';
  import { fetchGeocodeResults } from '@/services';

  interface Result {
    position: {
      lat: number;
      lng: number;
    }
    title: string;
  }

  // define emits
  const emit = defineEmits(['handleNextStep', 'handlePrevStep']);

  // instantiate stores and libs
  const user = useUserStore();
  const client = useClient();
  const sdk = getSdk(client);

  // local state
  const options = ref([]);
  const isSubmitting = ref(false);
  const state = reactive({
    first_name: user.currentUser?.first_name || undefined,
    last_name: user.currentUser?.last_name || undefined,
    trail_name: user.currentUser?.trail_name || undefined,
    location: user.currentUser?.location ? JSON.parse(user.currentUser.location) : undefined,
  });

  const fetchOptions = async (val: string, update: any): Promise<void> => {
    if (val === '') {
      update();
      return;
    }

    const needle = val.toLowerCase();
    const results = await fetchGeocodeResults(needle);

    options.value = results.items.map((item: Result) => ({
      label: item.title,
      value: item.position,
    }));

    update();
  };

  // validation
  const nameRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Required field',
  ];

  // handle previous step
  const handlePrevStep = (): void => {
    emit('handlePrevStep');
  };

  // handle next step
  const handleNextStep = async (): Promise<void> => {
    isSubmitting.value = true;

    try {
      const payload = { input: { id: user.currentUser?.id, ...JSON.parse(JSON.stringify(state)) } };
      if (state.location) {
        payload.input.location = JSON.stringify(state.location);
      }
      await sdk.UpdateUser(payload);
    } catch (error) {
      console.error({ error });
    }
    emit('handleNextStep');
  };
</script>
