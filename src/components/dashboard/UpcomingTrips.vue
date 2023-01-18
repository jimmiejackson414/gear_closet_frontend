<template>
  <q-card class="widget box-shadow-light full-height">
    <UpcomingLoading v-if="loading" />
    <div v-else>
      <q-card-section class="header q-mb-xs bg-white">
        <span class="material-icons q-mr-md">
          hiking
        </span>
        <p class="text-body1 title q-mb-none">
          Upcoming Trips <span class="text-grey-6 text-weight-regular">({{ data.upcomingTrips.length }})</span>
        </p>
      </q-card-section>
      <q-card-section
        v-if="trips?.length"
        class="col details-wrapper">
        <q-card
          v-for="trip in trips"
          :key="trip.id"
          flat
          class="pointer trip"
          @click="handleRouteClick(trip)">
          <q-card-section>
            <q-list>
              <q-item class="q-pa-none">
                <q-item-section side>
                  <q-badge
                    color="primary"
                    rounded />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ trip.name }}
                  </q-item-label>
                  <q-item-label caption>
                    Begins {{ formattedRelativeDate(trip.starting_date) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="arrow">
                    <q-icon
                      name="bi-arrow-right"
                      color="grey" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section v-else>
        <p
          class="text-body1">
          You don't currently have any upcoming trips.
        </p>
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang='ts' setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import { Cookies } from 'quasar';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { DashboardData, Trip } from '@/generated/types';
  import { encrypt } from '@/helpers/encryption';
  import UpcomingLoading from './loading/UpcomingLoading.vue';

  dayjs.extend(relativeTime);

  const props = defineProps<{
    data: DashboardData;
    loading: boolean;
  }>();

  const router = useRouter();

  const trips = computed(() => props.data.upcomingTrips as Trip[]);

  const formattedRelativeDate = (date: string): string => {
    const d = dayjs(date);
    return d.fromNow();
  };

  const handleRouteClick = async (trip: Trip): Promise<void> => {
    const cookie = encrypt(trip.id);
    Cookies.set('gc.selected_trip', cookie);
    await router.push({ name: 'planning' });
  };

</script>

<style lang="scss" scoped>
  @import "@/css/planning/main";

  .header {
    align-items: center;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 20%);
    padding-bottom: 1rem;
    justify-content: flex-start !important;

    .material-icons {
      color: $primary;
      font-size: 1.5rem;
    }
  }

  .details-wrapper {
    .trip {
      transition: 0.2s all $cubic-bezier;

      .arrow {
        transition: 0.2s transform $cubic-bezier;
      }

      &:hover {
        box-shadow: $box-shadow-light !important;

        .arrow {
          transform: translateX(5px);

          i {
            color: $primary;
          }
        }
      }
    }
  }
</style>
