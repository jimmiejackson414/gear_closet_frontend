<!-- eslint-disable vuejs-accessibility/anchor-has-content -->
<template>
  <div class="row news-widget-container q-pa-xs">
    <div class="col col-12 header">
      <NewsSkeleton v-if="loading" />
      <div
        v-else
        class="wrapper">
        <h5 class="text-h5 text-weight-bold q-mb-sm">
          News
        </h5>
        <div class="row">
          <!-- <NewsItem /> -->
          <q-carousel
            v-model="slide"
            transition-prev="jump-right"
            transition-next="jump-left"
            swipeable
            animated
            control-color="primary"
            navigation
            padding
            height="350px"
            class="bg-transparent full-width">
            <q-carousel-slide
              v-for="(s, i) in slides"
              :key="i"
              :name="i"
              class="column no-wrap">
              <div class="row fit justify-center items-center q-gutter-sm q-col-gutter no-wrap">
                <div
                  v-for="n in s"
                  :key="n.created"
                  class="col-12 col-md-4 full-height item">
                  <div class="news-card">
                    <a
                      :href="(n.link as string)"
                      rel="noopener noreferrer"
                      target="_blank"
                      class="news-card__card-link" />
                    <img
                      :src="(n.image as string)"
                      alt=""
                      class="news-card__image">
                    <div class="news-card__text-wrapper">
                      <p class="news-card__title text-body1 text-weight-bold q-ma-none">
                        {{ n.title }}
                      </p>
                      <div class="news-card__details-wrapper">
                        <div class="news-card__post-date text-subtitle1 q-mb-none">
                          {{ formattedRelativeDate(n.published as string) }}
                        </div>
                        <p class="news-card__excerpt text-subtitle2">
                          {{ truncate(n.description as string, 80) }}
                        </p>
                        <q-btn
                          outline
                          size="sm"
                          color="white"
                          :href="(n.link as string)"
                          rel="noopener noreferrer"
                          target="_blank"
                          class="news-card__read-more"
                          label="Read more"
                          icon-right="bi-arrow-right-short" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { computed, ref } from 'vue';
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
  const slides = computed(() => news.value.map((n, i) => (i % 3 === 0 ? news.value.slice(i, i + 3) : null))
    .filter(n => n));

  const slide = ref(0);

  const formattedRelativeDate = (date: string): string => dayjs(date)
    .fromNow();
</script>

<style lang='scss' scoped>
  /* stylelint-disable no-descending-specificity */
  /* stylelint-disable selector-class-pattern */
  @import "@/css/planning/aside";

  .news-card {
    position: relative;
    overflow: hidden;
    border-radius: 1.5rem;
    flex: 1;
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
    height: 100%;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        rgba(0, 0, 0, 0%)
        linear-gradient(to bottom, rgba(0, 0, 0, 0%) 50%, rgba(0, 0, 0, 70%) 80%);
      z-index: 0;
    }

    &__card-link {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    &__image {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      transition: transform 0.25s $cubic-bezier;
      backface-visibility: hidden;
      position: relative;
      z-index: -1;
    }

    &__text-wrapper {
      position: absolute;
      bottom: 0;
      padding: 1rem;
      color: white;
      transition: background-color 0.25s $cubic-bezier;
    }

    &__title {
      transition: color 0.25s $cubic-bezier;
      margin-bottom: 0.5rem;
    }

    &__post-date {
      margin-bottom: 0.5rem;
      color: #ccc;
    }

    &__details-wrapper {
      max-height: 0;
      opacity: 0;
      display: flex;
      flex-direction: column;
      transition: max-height 0.25s $cubic-bezier, opacity 0.25s $cubic-bezier;
    }

    &__read-more {
      backface-visibility: hidden;
      margin-left: auto;
      position: relative;
      z-index: 5;
    }
  }

  @media (min-width: 900px) {
    .news-card:hover .news-card__details-wrapper {
      max-height: 20rem;
      opacity: 1;
    }

    .news-card:hover .news-card__text-wrapper {
      background: linear-gradient(to top, rgba(0, 0, 0, 40%) 70%, rgba(0, 0, 0, 0%) 100%);
    }

    .news-card:hover .news-card__image {
      z-index: -1;
    }
  }
</style>
