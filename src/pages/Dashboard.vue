<template>
  <PageLayout>
    <div class="row q-col-gutter-md">
      <div class="col col-12 col-md-9">
        <div class="wrapper">
          <Navbar :page-title="capitalize(route.name as string)" />
          <div class="row q-col-gutter-md q-my-md">
            <div class="col col-xs-12 col-md-8">
              <InvitationsWidget
                :data="pageData"
                :loading="loading"
                @handle-update-invite="handleUpdateInvite" />
            </div>
            <div class="col col-xs-12 col-md-4">
              <FriendsWidget
                :data="pageData"
                :loading="loading" />
            </div>
          </div>
          <div class="row">
            <div class="col col-12">
              <NewsWidget
                :data="pageData"
                :loading="loading" />
            </div>
          </div>
        </div>
      </div>
      <div class="col col-12 col-md-3">
        <UpcomingTrips
          :data="pageData"
          :loading="loading" />
      </div>
    </div>
    <Walkthrough
      :steps="dashboardSteps(finishWalkthrough)"
      :trigger-start="startWalkthrough" />
  </PageLayout>
</template>

<script lang='ts' setup>
  import {
    defineAsyncComponent, onMounted, ref, watch,
  } from 'vue';
  import { useMeta } from 'quasar';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useClient } from '@/lib/graphqlRequest';
  import {
    getSdk, DashboardData, TripFriend, Trip, TripFriendStatus,
  } from '@/generated/types';
  import { capitalize, completedOnboarding } from '@/helpers/functions';
  import { dashboardSteps } from '@/helpers/walkthroughSteps';
  import { useUserStore } from '@/stores/user';
  import PageLayout from '@/layouts/PageLayout.vue';
  import Navbar from '@/components/common/Navbar.vue';
  import UpcomingTrips from '@/components/dashboard/UpcomingTrips.vue';
  import NewsWidget from '@/components/dashboard/NewsWidget.vue';
  import FriendsWidget from '@/components/dashboard/FriendsWidget.vue';
  import InvitationsWidget from '@/components/dashboard/InvitationsWidget.vue';

  const Walkthrough = defineAsyncComponent(() => import('@/components/Walkthrough.vue'));

  // metadata
  const metaData = {
    title: 'Dashboard | Gear Closet',
  };
  useMeta(metaData);

  const userStore = useUserStore();
  const route = useRoute();
  const { currentUser } = storeToRefs(userStore);

  const pageData = ref<DashboardData>({
    upcomingTrips: [],
    friends: [],
    news: [],
    invitations: [],
  });
  const loading = ref(false);
  const startWalkthrough = ref(false);

  const finishWalkthrough = (): void => {
    startWalkthrough.value = false;
    const input = {
      page: 'dashboard',
    };
    userStore.createOnboardingStep(input);
  };

  const handleUpdateInvite = (invite: TripFriend): void => {
    const index = pageData.value.invitations.findIndex(i => i!.id === invite.id);
    if (index > -1) pageData.value.invitations[index] = invite;

    const ind = pageData.value.upcomingTrips.findIndex(i => i!.id === invite.trip_id);

    // if trip was accepted, push to upcomingTrips
    if (invite.status === TripFriendStatus.Accepted) {
      pageData.value.upcomingTrips.push(invite.trip as Trip);
    }

    // undo Accept action
    if (invite.status === TripFriendStatus.Pending && ind > -1) {
      pageData.value.upcomingTrips.splice(ind, 1);
    }
  };

  // fetch data on mount
  onMounted(async () => {
    loading.value = true;
    const client = useClient();
    const sdk = getSdk(client);

    const { fetchDashboard } = await sdk.FetchDashboard();

    if (fetchDashboard?.data && !fetchDashboard.errors) {
      pageData.value = fetchDashboard.data as DashboardData;
    }
    loading.value = false;
  });

  watch(() => currentUser.value, () => {
    if (!(completedOnboarding(currentUser.value, 'dashboard'))) {
      startWalkthrough.value = true;
    }
  });
</script>

<style lang="scss" scoped>
  .wrapper {
    padding: 1rem 2rem;
    background-color: $light-grey;
    border-radius: 2.5rem;
  }

  .flex-break {
    flex: 1 0 100% !important;
    width: 0 !important;
  }

  .page-container > div {
    margin-bottom: 1rem;
    width: 100%;
  }

  $x: 2;

  @for $i from 1 through ($x - 1) {
    .page-container > div:nth-child(#{$x}n + #{$i}) {
      order: 1;
    }
    .page-container > div:nth-child(#{$x}n) {
      order: 2;
    }
  }

  @media screen and (min-width: $breakpoint-md-min) {
    @for $i from 1 through ($x - 1) {
      .page-container > div:nth-child(#{$x}n + #{$i}) {
        order: #{$i};
        margin-bottom: 1rem;
        width: calc(65% - 1rem);
      }
    }

    .page-container > div:nth-child(#{$x}n) {
      order: #{$x};
      margin-bottom: 1rem;
      width: calc(35% - 1rem);
    }

    .page-container {
      height: 700px; // might need to be adjusted later
    }
  }
</style>
