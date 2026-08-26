<script lang='ts' setup>
  import { parsePositiveTripId } from '@/utils/trips';

  interface Props {
    isOpen: boolean;
  }

  defineProps<Props>();
  const emits = defineEmits<{
    (event: 'onClose'): void;
  }>();

  const $store = usePlanningStore();
  const $route = useRoute();
  const $router = useRouter();
  const submitting = ref(false);

  const tripName = computed(() => $store.selectedTrip?.name?.trim() || 'this trip');

  const handleClose = () => {
    if (submitting.value) return;
    emits('onClose');
  };

  const deleteTrip = async () => {
    if (submitting.value) return;
    submitting.value = true;
    try {
      if ($route.query.trip != null) {
        const nextQuery = { ...$route.query };
        delete nextQuery.trip;
        await $router.replace({ query: nextQuery });
      }

      const ok = await $store.deleteSelectedTrip();
      if (!ok) return;

      const cookie = useCookie('selectedTripId');
      const nextId = parsePositiveTripId($store.selectedTripId);
      cookie.value = nextId != null ? encrypt(String(nextId)) : null;
      emits('onClose');
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <alert-dialog :open="isOpen">
    <alert-dialog-content
      class="max-h-[90dvh] sm:max-w-112.5 lg:max-w-162.5"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <alert-dialog-header>
        <alert-dialog-title>
          Delete trip
        </alert-dialog-title>
        <alert-dialog-description>
          Are you sure you want to delete {{ tripName }}? This action cannot be undone, and will permanently remove its details, friends, invites, and lists.
        </alert-dialog-description>
      </alert-dialog-header>
      <alert-dialog-footer>
        <alert-dialog-cancel
          :disabled="submitting"
          @click="handleClose">
          Cancel
        </alert-dialog-cancel>
        <button-root
          data-testid="delete-trip-confirm"
          :disabled="submitting"
          :loading="submitting"
          variant="destructive"
          @click="deleteTrip">
          Delete trip
        </button-root>
      </alert-dialog-footer>
    </alert-dialog-content>
  </alert-dialog>
</template>
