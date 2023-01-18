<template>
  <q-card
    id="trip-details-widget"
    class="q-pa-xs widget box-shadow-light">
    <div v-if="loading">
      <DetailsLoading />
    </div>
    <div v-else>
      <q-card-section class="header">
        <div class="left">
          <p class="text-body2 title q-mb-xs">
            Trip Details
          </p>
          <div class="hike-name">
            <InlineEdit
              :model="selectedTrip"
              field="name"
              hide-edit-btn
              @handle-update="handleUpdateTrip">
              <span class="text-h5 text-weight-bolder">{{ selectedTrip?.name || 'Trip Name' }}</span>
            </InlineEdit>
          </div>
          <div class="hike-duration">
            <InlineDateEdit
              :model="selectedTrip"
              field="starting_date"
              hide-edit-btn
              minimal
              placeholder="Starting date"
              @handle-update="handleUpdateTrip">
              <span class="text-body2 text-grey-6">{{ formattedStartDate }}</span>
            </InlineDateEdit>
            <q-icon
              name="bi-arrow-right-short"
              color="grey-6"
              size="md" />
            <InlineDateEdit
              :model="selectedTrip"
              field="ending_date"
              hide-edit-btn
              minimal
              placeholder="Ending date"
              @handle-update="handleUpdateTrip">
              <span class="text-body2 text-grey-6">{{ formattedEndDate }}</span>
            </InlineDateEdit>
          </div>
        </div>
        <div class="action-btns-wrapper">
          <q-btn
            round
            color="primary"
            size="sm"
            unelevated
            :ripple="false"
            icon="bi-plus-lg"
            @click="handleCreateDetail" />
        </div>
      </q-card-section>
      <q-card-section
        v-if="tripDetails?.length"
        class="row details-wrapper">
        <div
          v-for="detail in tripDetails"
          :key="detail.id"
          class="col-6 col-md-4 q-mb-md detail">
          <div class="left">
            <span class="text-caption text-grey-7 q-mb-none">
              {{ detail.title }}
            </span>
            <a
              v-if="detail.url"
              :href="detail.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-body1 text-weight-bold">
              {{ detail.value }}
            </a>
            <span
              v-else
              class="text-body1 text-weight-bold">
              {{ detail.value }}
            </span>
          </div>
          <div class="right q-ml-md">
            <q-btn
              round
              color="white"
              size="xs"
              text-color="text"
              unelevated
              :ripple="false"
              icon="bi-pencil-fill"
              @click="toggleEditDialog(detail)" />
          </div>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <q-list>
          <q-item>
            <q-item-section class="text-center">
              <q-item-label>You haven't created any Trip Details yet!</q-item-label>
              <q-item-label>Click on the <b>Add</b> button to get started.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </div>
  </q-card>
  <EditDetailsDialog
    v-if="selectedDetail"
    :is-open="isEditDetailDialogOpen"
    :detail="selectedDetail"
    :type="DetailType.Trip"
    description="Provide trip-related info, or even link to your car or hotel information!"
    @handle-close="toggleEditDialog(null)" />
</template>

<script lang='ts' setup>
  import { computed, defineAsyncComponent, ref } from 'vue';
  import dayjs from 'dayjs';
  import { storeToRefs } from 'pinia';
  import { usePlanningStore } from '@/stores/planning';
  import {
    CreateTripDetailInput, DetailType, TripDetail, UpdateTripInput,
  } from '@/generated/types';
  import InlineEdit from '@/components/common/InlineEdit.vue';
  import InlineDateEdit from '@/components/common/InlineDateEdit.vue';
  import DetailsLoading from './loading/DetailsLoading.vue';

  const EditDetailsDialog = defineAsyncComponent(() => import('./dialogs/EditDetailsDialog.vue'));

  const store = usePlanningStore();

  const { loading, tripDetails, selectedTrip } = storeToRefs(store);
  const isEditDetailDialogOpen = ref(false);
  const selectedDetail = ref<TripDetail | null>(null);

  const formattedStartDate = computed(() => {
    const date = selectedTrip.value?.starting_date;
    return date ? dayjs(date)
      .format('MMM DD, YYYY') : 'Start date';
  });

  const formattedEndDate = computed(() => {
    const date = selectedTrip.value?.ending_date;
    return date ? dayjs(date)
      .format('MMM D, YYYY') : 'End date';
  });

  const toggleEditDialog = (detail: TripDetail | null): void => {
    selectedDetail.value = detail;
    isEditDetailDialogOpen.value = !isEditDetailDialogOpen.value;
  };

  const handleUpdateTrip = async (newTrip: any): Promise<void> => {
    const updateTripInput = { ...newTrip } as UpdateTripInput;

    await store.updateTrip(updateTripInput);
  };

  // handle creating new detail
  const handleCreateDetail = async (): Promise<void> => {
    const newDetail = {
      title: 'New Detail',
      url: undefined,
      value: 'Info',
      type: DetailType.Trip,
      trip_id: selectedTrip.value?.id,
    } as CreateTripDetailInput;

    await store.createTripDetail(newDetail);
  };
</script>

<style lang='scss' scoped>
  @import "@/css/planning/main";

  .header {
    padding-bottom: 0;

    .left {
      .hike-duration {
        align-items: center;
        display: flex;
      }
    }
  }

  .details-wrapper {
    .detail {
      align-items: center;
      display: flex;

      .left {
        display: flex;
        flex-direction: column;
      }

      .right {
        .q-btn {
          opacity: 0;
          transition: 0.2s opacity $cubic-bezier;
        }
      }

      &:hover {
        .right {
          .q-btn {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
