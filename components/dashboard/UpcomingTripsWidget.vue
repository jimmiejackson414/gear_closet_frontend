<script lang='ts' setup>
  import { FootprintsIcon } from 'lucide-vue-next';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { Trip } from '@/types';

  dayjs.extend(relativeTime);

  interface Props {
    data: Trip[];
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: () => [],
    loading: false,
  });

  const formattedRelativeDate = (date: string | null) => {
    if (!date) return '--';
    return dayjs(date)
      .fromNow();
  };

  const calculatedProgress = (trip: Trip) => {
    const tripDurationInDays = dayjs(trip.starting_date)
      .diff(trip.created_at, 'day');
    const elapsedTimeInDays = dayjs()
      .diff(trip.created_at, 'day');
    let percentage = (elapsedTimeInDays / tripDurationInDays) * 100;
    percentage = Math.min(percentage, 100);
    return { width: `${percentage}%` };
  };

  const $router = useRouter();
  const handleRouteClick = (trip: Trip) => {
    $router.push({
      name: 'planning',
      query: { trip: encrypt(trip.id) },
    });
  };
</script>

<template>
  <div class="!bg-white card card-aside">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="flex justify-start items-center py-4">
        <footprints-icon class="h-6 mr-6 text-primary w-6" />
        <p class="!font-bold text-base">
          Upcoming Trips <span class="font-normal text-grey">({{ data.length || 0 }})</span>
        </p>
      </div>
      <div v-if="data.length">
        <ul class="divide-gray-200 divide-y">
          <li
            v-for="trip in data"
            :key="trip.id"
            class="cursor-pointer"
            @click="handleRouteClick(trip)">
            <div class="duration-150 ease-in-out flex items-stretch p-3 rounded-md space-x-4 hover:bg-gray-100">
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-base text-dark-grey truncate">
                  {{ trip.name }}
                </p>
                <p class="text-grey text-sm truncate">
                  {{ trip.description }}
                </p>
              </div>
              <div class="flex justify-between flex-1 flex-col min-w-0">
                <p class="font-medium inline-flex items-center text-base text-dark-gray">
                  Begins {{ formattedRelativeDate(trip.starting_date) }}
                </p>
                <div class="bg-gray-200 h-2.5 rounded-full w-full">
                  <div
                    class="bg-gradient-to-r from-positive-light to-positive h-2.5 rounded-full"
                    :style="calculatedProgress(trip)" />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        v-else
        class="flex justify-center items-center flex-col">
        <p class="mb-4 text-base text-center">
          You don't have any upcoming trips yet!
        </p>
        <gc-button
          label="Get Started"
          size="sm"
          :to="{ name: 'planning' }" />
      </div>
    </div>
  </div>
</template>
