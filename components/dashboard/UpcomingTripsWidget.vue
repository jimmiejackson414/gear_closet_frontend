<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { Tables } from '@/types';

  dayjs.extend(relativeTime);

  interface Props {
    data: Tables<'trips'>[];
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

  const calculatedProgress = (trip: Tables<'trips'>) => {
    const tripDurationInDays = dayjs(trip.starting_date)
      .diff(trip.created_at, 'day');
    const elapsedTimeInDays = dayjs()
      .diff(trip.created_at, 'day');
    let percentage = (elapsedTimeInDays / tripDurationInDays) * 100;
    percentage = Math.min(percentage, 100);
    return { width: `${percentage}%` };
  };

  const $router = useRouter();
  const handleRouteClick = (trip: Tables<'trips'>) => {
    $router.push({
      name: 'planning',
      query: { trip: encrypt(trip.id) },
    });
  };
</script>

<template>
  <card
    class="px-8 py-4 rounded-3xl"
    data-testid="upcoming-trips-widget">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="flex justify-start items-center py-4">
        <icon-footprints class="h-6 mr-6 text-primary dark:text-primary-foreground w-6" />
        <typography
          class="font-bold"
          variant="p">
          Upcoming Trips <span class="font-normal text-grey">({{ data.length || 0 }})</span>
        </typography>
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
                    class="bg-linear-to-r from-positive-light to-positive h-2.5 rounded-full"
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
        <typography
          class="mb-4 text-center"
          variant="p">
          You don't have any upcoming trips yet!
        </typography>
        <nuxt-link :to="{ name: 'planning' }">
          <button-root size="sm">
            Get Started
          </button-root>
        </nuxt-link>
      </div>
    </div>
  </card>
</template>