<template>
  <div class="bottom">
    <q-form @submit.prevent.stop="handleSubmit">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-input
            ref="emailRef"
            v-model="email"
            :disable="isSubmitting"
            outlined
            dense
            aria-required="true"
            label="Email"
            type="email"
            :rules="emailRules">
            <template #prepend>
              <q-icon name="bi-envelope" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            ref="trailNameRef"
            v-model="state.trail_name"
            :disable="isSubmitting"
            outlined
            dense
            aria-required="false"
            label="Trail Name">
            <template #prepend>
              <span class="material-icons">
                hiking
              </span>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            ref="firstNameRef"
            v-model="state.first_name"
            :disable="isSubmitting"
            outlined
            dense
            aria-required="true"
            label="First Name"
            :rules="nameRules">
            <template #prepend>
              <q-icon name="bi-person-circle" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            ref="lastNameRef"
            v-model="state.last_name"
            :disable="isSubmitting"
            outlined
            dense
            aria-required="true"
            label="Last Name"
            :rules="nameRules">
            <template #prepend>
              <q-icon name="bi-person-circle" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
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
      </div>
      <div class="row justify-end q-mt-md">
        <q-btn
          :loading="isSubmitting"
          :disable="isSubmitting"
          label="Update"
          type="submit"
          color="primary"
          :ripple="false">
          <template #loading>
            <q-spinner-tail color="white" />
          </template>
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script lang='ts' setup>
  import { reactive, ref } from 'vue';
  import { UpdateUserInput, User } from '@/generated/types';
  import { isValidEmail } from '@/helpers/functions';
  import { fetchGeocodeResults } from '@/services';
  import { useAppStore } from '@/stores/app';
  import { useUserStore } from '@/stores/user';

  interface Result {
    position: {
      lat: number;
      lng: number;
    }
    title: string;
  }

  // define props
  const props = defineProps<{
    currentUser: User | null
  }>();

  // instantiate store and libs
  const app = useAppStore();
  const user = useUserStore();

  // local state
  const email = ref(props.currentUser?.email || '');
  const options = ref([]);
  const isSubmitting = ref(false);
  const state = reactive({
    first_name: props.currentUser?.first_name || undefined,
    last_name: user.currentUser?.last_name || undefined,
    trail_name: user.currentUser?.trail_name || undefined,
    location: user.currentUser?.location ? JSON.parse(user.currentUser.location) : undefined,
  });
  const emailRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Email is required',
    (val: string): boolean | string => isValidEmail(val) || 'Not a valid email',
  ];
  const nameRules = [
    (val: string): boolean | string => (val && val.length > 0) || 'Required field',
  ];

  // fetch geolocation options
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

  // submit form
  const handleSubmit = async (): Promise<void> => {
    isSubmitting.value = true;

    try {
      const payload: UpdateUserInput = { id: user.currentUser?.id, ...JSON.parse(JSON.stringify(state)) };
      if (state.location) {
        payload.location = JSON.stringify(state.location);
      }
      await user.updateUser(payload);
      app.notifyPositive('Successfully updated');
      isSubmitting.value = false;
    } catch (err) {
      isSubmitting.value = false;
      app.notifyNegative('An error occurred');
    }
  };
</script>

<style lang='scss' scoped>
  .top {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5%;
    justify-content: center;
    margin-bottom: 4rem;
    padding: 0;

    @media (min-width: $breakpoint-md-min) {
      grid-template-columns: 40% 1fr;
      grid-gap: 4rem;
      padding: 0 4rem;
    }

    .details-wrapper {
      text-align: center;

      @media (min-width: $breakpoint-md-min) {
        text-align: left;
      }

      h4 {
        margin-bottom: 1rem;
      }
    }
  }

  .bottom {
    padding: 0;

    @media (min-width: $breakpoint-md-min) {
      padding: 0 4rem;
    }

    section {
      margin-bottom: 2rem;

      h5 {
        margin-bottom: 1rem;
      }
    }
  }
</style>
