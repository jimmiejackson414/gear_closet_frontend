<template>
  <q-card class="q-pa-xs widget box-shadow-light aside">
    <NewsSkeleton v-if="loading" />
    <div v-else>
      <q-card-section class="header q-mb-xs">
        <q-icon
          name="bi-newspaper"
          color="primary"
          size="sm" />
        <p class="text-body1 title">
          News
        </p>
      </q-card-section>
      <q-card-section class="row news-wrapper">
        <q-list>
          <q-item
            v-for="n in news"
            :key="(n.title as string)"
            clickable
            class="items-center">
            <a
              class="text-body2 q-mb-none"
              :href="(n.link as string)"
              rel="noopener noreferrer"
              target="_blank">
              {{ truncate(n.title as string, 40) }}
            </a>
            <div class="row justify-between">
              <p class="subtitle1 q-mb-none text-right">
                {{ n.source }}
              </p>
              <p class="subtitle1 q-mb-none text-grey-5">
                {{ formattedRelativeDate(n.published as string) }}
              </p>
            </div>
          </q-item>
        </q-list>
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang='ts' setup>
  import { computed } from 'vue';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { truncate } from '@/helpers/functions';
  import { DashboardData, News } from '@/generated/types';
  import NewsSkeleton from './loading/NewsSkeleton.vue';

  dayjs.extend(relativeTime);

  const props = defineProps<{
    data: DashboardData;
    loading: boolean;
  }>();

  const news = computed(() => props.data.news as News[]);

  const formattedRelativeDate = (date: string): string => dayjs(date)
    .fromNow();
</script>

<style lang='scss' scoped>
  @import "@/css/planning/aside";

  .header {
    padding-bottom: 0;
  }

  .news-wrapper {
    .q-list {
      width: 100%;

      .q-item {
        align-items: center;
        border-radius: 1rem;
        display: grid;
        flex-direction: column;
      }
    }
  }
</style>
