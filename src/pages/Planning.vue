<template>
  <MainLayout>
    <div class="container container-sm">
      <div class="row select-row q-mb-lg items-center">
        <div class="inline-flex">
          <div class="action-btns-wrapper q-mr-md">
            <q-btn
              class="planning-settings"
              round
              color="grey-4"
              size="sm"
              text-color="text"
              unelevated
              :ripple="false"
              icon="bi-gear-fill">
              <q-menu>
                <q-list
                  style="min-width: 150px;">
                  <q-item
                    v-close-popup
                    clickable
                    :disable="!!poll"
                    @click="handleCreatePoll">
                    <q-item-section class="items-center">
                      Create poll
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    clickable
                    @click="isRemoveDialogOpen = true">
                    <q-item-section class="items-center">
                      Remove from trip
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <q-select
            v-model="selectedTrip"
            :options="trips"
            label="Selected Trip"
            outlined
            dropdown-icon="bi-chevron-down"
            class="q-mr-md trips-dropdown"
            option-label="name"
            dense
            :loading="loadingTrips"
            @update:model-value="handleChangeTrip">
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Create your first Trip!
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-btn
            label="New trip"
            color="secondary"
            icon="bi-plus"
            class="q-pl-sm"
            @click="isCreateTripModalOpen = true" />
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="column left-col">
          <PackWidget
            :data="chartData"
            :loading="loading" />
          <HikeDetails />
          <TripDetails />
        </div>
        <div class="column right-col">
          <Poll v-if="poll" />
          <Friends />
          <Todos />
          <ShoppingList />
        </div>
      </div>
    </div>
    <CreateTripDialog
      :is-open="isCreateTripModalOpen"
      @handle-close="isCreateTripModalOpen = false" />
    <Walkthrough
      :steps="planningSteps(finishWalkthrough)"
      :trigger-start="startWalkthrough" />
    <CreatePollDialog
      :is-open="isCreatePollModalOpen"
      @handle-close="isCreatePollModalOpen = false" />
    <AlertDialog
      alert-color="negative"
      btn-color="negative"
      :has-cancel-btn="true"
      :is-open="isRemoveDialogOpen"
      title="Remove From Trip"
      @handle-close="isRemoveDialogOpen = false"
      @handle-continue="handleRemoveFromTrip">
      <template #content>
        <p class="text-body1">
          Are you sure you want to remove yourself from this trip?
        </p>
        <p class="text-body1">
          This action will <strong>permanently</strong> remove yourself from this trip and cannot be undone.
        </p>
      </template>
    </AlertDialog>
  </MainLayout>
</template>

<script lang='ts' setup>
  import {
    computed, defineAsyncComponent, ref, watchEffect, watch,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import { Cookies, useMeta } from 'quasar';
  import { usePlanningStore } from '@/stores/planning';
  import { useUserStore } from '@/stores/user';
  import MainLayout from '@/layouts/MainLayout.vue';
  import PackWidget from '@/components/planning/PackWidget.vue';
  import HikeDetails from '@/components/planning/HikeDetailsWidget.vue';
  import TripDetails from '@/components/planning/TripDetailsWidget.vue';
  import Friends from '@/components/planning/FriendsWidget.vue';
  import Todos from '@/components/planning/TodoWidget.vue';
  import ShoppingList from '@/components/planning/ShoppingListWidget.vue';
  import { encrypt, decrypt } from '@/helpers/encryption';
  import round from 'lodash.round';
  import convert from 'convert';
  import { calculateCategoryWeight, completedOnboarding } from '@/helpers/functions';
  import { Category, Pack } from '@/generated/types';
  import { planningSteps } from '@/helpers/walkthroughSteps';

  const AlertDialog = defineAsyncComponent(() => import('@/components/common/dialogs/AlertDialog.vue'));
  const CreateTripDialog = defineAsyncComponent(() => import('@/components/planning/dialogs/CreateTripDialog.vue'));
  const CreatePollDialog = defineAsyncComponent(() => import('@/components/planning/dialogs/CreatePollDialog.vue'));
  const Poll = defineAsyncComponent(() => import('@/components/planning/PollWidget.vue'));
  const Walkthrough = defineAsyncComponent(() => import('@/components/Walkthrough.vue'));

  interface MappedData {
    labels: string[] | undefined;
    series: number[] | undefined;
  }

  // metadata
  const metaData = {
    title: 'Planning | Gear Closet',
  };
  useMeta(metaData);

  // instantiate store
  const store = usePlanningStore();
  const userStore = useUserStore();

  const {
    pack, selectedTrip, trips, loading, poll,
  } = storeToRefs(store);
  const { currentUser } = storeToRefs(userStore);

  const isCreateTripModalOpen = ref(false);
  const isRemoveDialogOpen = ref(false);
  const isCreatePollModalOpen = ref(false);
  const loadingTrips = ref(false);
  const startWalkthrough = ref(false);

  const handleChangeTrip = async (trip: any): Promise<void> => {
    store.toggleLoading();
    const cookie = encrypt(trip.id);
    Cookies.set('gc.selected_trip', cookie);
    await store.fetchPageData(trip.id);
  };

  const chartData = computed(() => {
    const data = {
      series: [],
      labels: [],
    } as MappedData;

    if (pack.value) {
      const { categories } = pack.value as Pack;
      data.series = categories?.map(category => round(
        convert(calculateCategoryWeight(category as Category), 'mg')
          .to('lb'),
      ));

      data.labels = pack.value ? pack.value.categories?.map(category => (category && category.name ? category.name : 'Unnamed')) : [];
    }
    return data;
  });

  const handleRemoveFromTrip = async (): Promise<void> => {
    await store.removeFromTrip(selectedTrip.value!.id);
    isRemoveDialogOpen.value = false;
  };

  const finishWalkthrough = (): void => {
    startWalkthrough.value = false;
    const input = {
      page: 'planning',
    };
    userStore.createOnboardingStep(input);
  };

  const handleCreatePoll = async (): Promise<void> => {
    isCreatePollModalOpen.value = true;
  };

  watchEffect(() => {
    const cookie = Cookies.get('gc.selected_trip');

    if (cookie) {
      const decrypted = decrypt(cookie);
      return store.fetchPageData(Number(decrypted));
    }
    return store.fetchPageData();
  });

  watch(() => currentUser.value, () => {
    if (!(completedOnboarding(currentUser.value, 'planning'))) {
      startWalkthrough.value = true;
    }
  });
</script>

<style lang="scss" scoped>
  .select-row {
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    margin-top: 24px;

    .inline-flex {
      align-items: center;
      display: inline-flex;
    }

    @media (min-width: $breakpoint-md-min) {
      justify-content: flex-end;
      margin-top: 0;
    }

    .trips-dropdown {
      min-width: 150px;
    }
  }

  .column {
    display: grid;
    grid-gap: 1rem;

    &.left-col {
      max-width: 100%;
      width: 100%;

      @media (min-width: $breakpoint-md-min) {
        max-width: 65%;
      }
    }

    &.right-col {
      max-width: 100%;
      width: 100%;

      @media (min-width: $breakpoint-md-min) {
        max-width: 35%;
      }
    }
  }
</style>
