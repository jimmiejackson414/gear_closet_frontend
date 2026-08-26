<script lang="ts" setup>
  import { lockedDeepLinkMessage, resolveLockedFallback } from '@/utils/planLimits';
  import { findTripById, isTripLockedForUser, parsePositiveTripId } from '@/utils/trips';

  const $store = usePlanningStore();
  const $userStore = useUserStore();
  const $appStore = useAppStore();
  const $route = useRoute();
  const $router = useRouter();
  const $cookie = useCookie('selectedTripId');
  const showLockedDeepLinkBanner = ref(false);

  /**
   * Resolve trip id once: query > cookie > 0 (RPC / store pick first trip).
   * Cookie watcher + onMounted previously both fetched → double RPC / races.
   */
  const resolveTripId = (): number => {
    const fromQuery = $route.query?.trip;
    if (fromQuery != null && fromQuery !== '') {
      return parsePositiveTripId(decrypt(fromQuery)) ?? 0;
    }
    if ($cookie.value) {
      return parsePositiveTripId(decrypt($cookie.value)) ?? 0;
    }
    return 0;
  };

  const persistSelectedTripCookie = () => {
    const tripId = parsePositiveTripId($store.selectedTripId);
    if (tripId == null) return;
    $cookie.value = encrypt(String(tripId));
  };

  const hasTripQuery = () => $route.query.trip != null && $route.query.trip !== '';
  const userId = () => $userStore.profile?.id;
  const isSelectedTripLocked = (
    trip: (typeof $store.data.trips)[number] | null | undefined,
  ) => isTripLockedForUser(trip, userId(), false);

  const stripTripQuery = async () => {
    if (!hasTripQuery()) return;
    const nextQuery = { ...$route.query };
    delete nextQuery.trip;
    await $router.replace({ query: nextQuery });
  };

  const fallbackFromLockedTrip = async (fromQuery: boolean) => {
    if ($userStore.isPaidMember) return;

    const selected = findTripById($store.data.trips, $store.selectedTripId);
    const fallback = resolveLockedFallback(
      selected,
      $store.data.trips,
      isSelectedTripLocked,
    );
    if (!fallback.needed) return;

    await $store.fetchPlanningPage(fallback.unlocked?.id ?? 0);
    if (fallback.unlocked) {
      $cookie.value = encrypt(String(fallback.unlocked.id));
    }

    $appStore.notifyInfo(lockedDeepLinkMessage('trip'));
    if (fromQuery) {
      showLockedDeepLinkBanner.value = true;
      await stripTripQuery();
    }
  };

  onMounted(async () => {
    await $store.fetchPlanningPage(resolveTripId());
    await fallbackFromLockedTrip(hasTripQuery());
    persistSelectedTripCookie();
  });

  // Deep-link / browser navigation with ?trip= should refetch that trip.
  watch(
    () => $route.query.trip,
    async (tripQuery, previous) => {
      if (tripQuery === previous) return;
      if (tripQuery == null || tripQuery === '') return;
      const id = parsePositiveTripId(decrypt(tripQuery)) ?? 0;
      await $store.fetchPlanningPage(id);
      await fallbackFromLockedTrip(true);
      persistSelectedTripCookie();
    },
  );

  const isCreateTripDialogOpen = ref(false);
  const isDeleteTripDialogOpen = ref(false);
</script>

<template>
  <div class="pb-8">
    <locked-deep-link-banner
      v-if="showLockedDeepLinkBanner"
      kind="trip"
      @dismiss="showLockedDeepLinkBanner = false" />

    <planning-settings
      @open-delete-dialog="isDeleteTripDialogOpen = true"
      @open-dialog="isCreateTripDialogOpen = true" />

    <planning-empty-state
      v-if="!$store.data.trips.length && !$store.pageLoading"
      @open-dialog="isCreateTripDialogOpen = true" />

    <planning-content v-else />

    <lazy-create-trip-dialog
      :is-open="isCreateTripDialogOpen"
      @on-close="isCreateTripDialogOpen = false" />

    <lazy-delete-trip-dialog
      :is-open="isDeleteTripDialogOpen"
      @on-close="isDeleteTripDialogOpen = false" />
  </div>
</template>
