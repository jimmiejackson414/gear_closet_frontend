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
    // TODO: set to cookie instead of query
    $router.push({
      name: 'planning',
      query: { trip: encrypt(trip.id) },
    });
  };
</script>

<template>
  <card
    class="rounded-3xl p-4 md:px-8"
    data-testid="upcoming-trips-widget">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="flex items-center justify-start py-4">
        <icon-footprints class="mr-6 size-6 text-primary dark:text-primary-foreground" />
        <typography
          class="!font-bold"
          variant="p">
          Upcoming Trips <span class="font-normal text-muted-foreground">({{ data.length || 0 }})</span>
        </typography>
      </div>
      <div v-if="data.length">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="trip in data"
            :key="trip.id"
            class="cursor-pointer"
            @click="handleRouteClick(trip)">
            <div class="flex flex-col items-stretch space-y-2 rounded-md p-3 duration-150 ease-in-out hover:bg-gray-100 md:flex-row md:space-x-4 md:space-y-0">
              <div class="min-w-0 flex-1">
                <typography class="truncate text-base font-semibold">
                  {{ trip.name }}
                </typography>
                <typography class="truncate text-sm text-muted-foreground">
                  {{ trip.description }}
                </typography>
              </div>
              <div class="flex min-w-0 flex-1 flex-col justify-end">
                <typography class="inline-flex items-center text-sm font-medium">
                  Begins {{ formattedRelativeDate(trip.starting_date) }}
                </typography>
                <div class="h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    class="h-2.5 rounded-full bg-gradient-to-r from-accent to-accent-alt"
                    :style="calculatedProgress(trip)" />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center">
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