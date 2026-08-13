<script lang="ts" setup>
  import type { Tables } from '@/types';
  import {
    FREE_PACK_LIMIT,
    FREE_TRIP_LIMIT,
    needsFreeResourcePick,
  } from '@/utils/planLimits';

  const $userStore = useUserStore();
  const $appStore = useAppStore();
  const $closetStore = useClosetStore();
  const $planningStore = usePlanningStore();

  const isOpen = computed(() =>
    Boolean(
      $userStore.profile
        && !$userStore.isPaidMember
        && $userStore.profile.needs_free_resource_selection,
    ));

  const packs = ref<Pick<Tables<'packs'>, 'id' | 'name' | 'locked_at'>[]>([]);
  const trips = ref<Pick<Tables<'trips'>, 'id' | 'name' | 'locked_at'>[]>([]);
  const selectedPackId = ref<number | undefined>(undefined);
  const selectedTripId = ref<number | undefined>(undefined);
  const isSubmitting = ref(false);

  const canSubmit = computed(() => {
    if (packs.value.length > FREE_PACK_LIMIT && selectedPackId.value == null) return false;
    if (trips.value.length > FREE_TRIP_LIMIT && selectedTripId.value == null) return false;
    return needsFreeResourcePick(packs.value, trips.value);
  });

  const loadResources = async () => {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    if (!user.value?.sub) return;

    const [{ data: packRows }, { data: tripRows }] = await Promise.all([
      supabase.from('packs')
        .select('id, name, locked_at')
        .eq('profile_id', user.value.sub)
        .order('created_at', { ascending: true }),
      supabase.from('trips')
        .select('id, name, locked_at')
        .eq('profile_id', user.value.sub)
        .order('created_at', { ascending: true }),
    ]);

    packs.value = packRows ?? [];
    trips.value = tripRows ?? [];
    selectedPackId.value = packs.value.find((p) => !p.locked_at)?.id ?? packs.value[0]?.id;
    selectedTripId.value = trips.value.find((t) => !t.locked_at)?.id ?? trips.value[0]?.id;
  };

  watch(isOpen, async (open) => {
    if (open) await loadResources();
  }, { immediate: true });

  const handleConfirm = async () => {
    if (!canSubmit.value || isSubmitting.value) return;
    try {
      isSubmitting.value = true;
      await $fetch('/api/plan/free-selection', {
        method: 'POST',
        body: {
          packId: packs.value.length ? selectedPackId.value ?? null : null,
          tripId: trips.value.length ? selectedTripId.value ?? null : null,
        },
      });

      if ($userStore.profile) {
        $userStore.profile.needs_free_resource_selection = false;
      }

      $appStore.notifyPositive('Your Free pack and trip are ready.');

      if (selectedPackId.value != null) {
        await $closetStore.fetchClosetPage(selectedPackId.value);
      }
      if (selectedTripId.value != null) {
        await $planningStore.fetchPlanningPage(selectedTripId.value);
      }
    } catch {
      $appStore.notifyNegative('Failed to save your Free selection. Please try again.');
    } finally {
      isSubmitting.value = false;
    }
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="flex flex-col sm:max-w-112.5 max-h-[90dvh]"
      @escape-key-down.prevent
      @interact-outside.prevent>
      <dialog-header>
        <dialog-title>Choose your Free pack & trip</dialog-title>
      </dialog-header>
      <div class="flex flex-col gap-4 py-4">
        <typography>
          Your plan is now Free. Pick one pack and one trip to keep unlocked — everything else stays saved and locked until you upgrade.
        </typography>
        <div
          v-if="packs.length > FREE_PACK_LIMIT"
          class="flex flex-col gap-2">
          <typography class="font-bold">
            Pack to keep
          </typography>
          <select-root
            :model-value="selectedPackId != null ? String(selectedPackId) : undefined"
            @update:model-value="selectedPackId = $event ? Number($event) : undefined">
            <select-trigger>
              <select-value placeholder="Select a pack" />
            </select-trigger>
            <select-content>
              <select-item
                v-for="pack in packs"
                :key="pack.id"
                :value="String(pack.id)">
                {{ pack.name }}
              </select-item>
            </select-content>
          </select-root>
        </div>
        <div
          v-if="trips.length > FREE_TRIP_LIMIT"
          class="flex flex-col gap-2">
          <typography class="font-bold">
            Trip to keep
          </typography>
          <select-root
            :model-value="selectedTripId != null ? String(selectedTripId) : undefined"
            @update:model-value="selectedTripId = $event ? Number($event) : undefined">
            <select-trigger>
              <select-value placeholder="Select a trip" />
            </select-trigger>
            <select-content>
              <select-item
                v-for="trip in trips"
                :key="trip.id"
                :value="String(trip.id)">
                {{ trip.name }}
              </select-item>
            </select-content>
          </select-root>
        </div>
      </div>
      <dialog-footer>
        <button-root
          :disabled="!canSubmit || isSubmitting"
          :loading="isSubmitting"
          @click="handleConfirm">
          Continue
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
