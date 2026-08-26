<script lang='ts' setup>
  import {
    FREE_PACK_CREATE_TIP,
    FREE_PACK_LIMIT,
    isFreeCreateBlocked,
    isResourceLocked,
    LOCKED_RESOURCE_TIP,
  } from '@/utils/planLimits';
  import type { SelectOption } from '@/types/ui';
  import type { AcceptableValue } from 'reka-ui';

  const $store = useClosetStore();
  const $userStore = useUserStore();
  const $appStore = useAppStore();
  const $router = useRouter();
  const $route = useRoute();

  const packOptions = computed(() => $store.data.allPacks.map(p => ({
    label: p.name,
    locked: isResourceLocked(p),
    value: p.id,
  })) as Array<SelectOption & { locked?: boolean }>);

  const createBlocked = computed(() =>
    isFreeCreateBlocked($userStore.isPaidMember, $store.data.allPacks, FREE_PACK_LIMIT));

  const defaultMode = ref<'create' | 'update'>('create');
  const mode = inject<Ref<'create' | 'update'>>('dialogMode', defaultMode);

  /**
   * Persist cookie, clear pinned ?pack=, refetch.
   * Cookie-only updates previously relied on a container watcher (removed).
   */
  const handleSelectPack = async (val: AcceptableValue) => {
    if (val == null || val === '') return;

    const packId = Number(val);
    const pack = $store.data.allPacks.find((p) => p.id === packId);
    if (!$userStore.isPaidMember && isResourceLocked(pack)) {
      $appStore.notifyNegative(LOCKED_RESOURCE_TIP);
      return;
    }

    const cookie = useCookie('selectedPackId');
    cookie.value = encrypt(String(packId));

    if ($route.query.pack != null) {
      const nextQuery = { ...$route.query };
      delete nextQuery.pack;
      await $router.replace({ query: nextQuery });
    }

    await $store.fetchClosetPage(packId);
  };
</script>

<template>
  <div class="flex flex-wrap justify-between lg:justify-end items-center gap-3 sm:gap-6 mb-8">
    <div class="flex justify-center items-center gap-3 sm:gap-4 min-w-0">
      <div class="flex">
        <dropdown-menu>
          <dropdown-menu-trigger aria-label="Pack actions">
            <icon-settings
              aria-hidden="true"
              class="w-6 h-6"
              data-testid="settings-icon" />
          </dropdown-menu-trigger>
          <dropdown-menu-content>
            <dropdown-menu-label>
              Actions
            </dropdown-menu-label>
            <dropdown-menu-separator />
            <dropdown-menu-item
              v-tippy="{ content: !$store.data.selectedPack ? 'Please select a pack to import items.' : '' }"
              :disabled="!$store.data.selectedPack"
              @select="$store.dialogStates.uploadCsvDialog = true">
              Import from CSV
            </dropdown-menu-item>
            <dropdown-menu-item
              v-tippy="{ content: !$store.data.selectedPack ? 'Please select a pack to share.' : '' }"
              :disabled="!$store.data.selectedPack"
              @select="$store.dialogStates.sharePackDialog = true">
              Share pack list
            </dropdown-menu-item>
            <dropdown-menu-item
              v-tippy="{ content: !$store.data.selectedPack ? 'Please select a pack.' : '' }"
              :disabled="!$store.data.selectedPack"
              @select="[ $store.dialogStates.managePackSettingsDialog = true, mode = 'update' ]">
              Settings
            </dropdown-menu-item>
            <dropdown-menu-item
              v-tippy="{ content: !$store.data.selectedPack ? 'Please select a pack to delete.' : '' }"
              :disabled="!$store.data.selectedPack"
              @select="$store.dialogStates.deletePackDialog = true">
              Delete pack
            </dropdown-menu-item>
          </dropdown-menu-content>
        </dropdown-menu>
      </div>
      <select-root
        :default-value="String($store.data.selectedPack?.id)"
        :disabled="$store.pageLoading"
        :model-value="String($store.data.selectedPack?.id)"
        @update:model-value="handleSelectPack">
        <select-trigger class="min-w-0 w-40 sm:min-w-45 sm:w-auto">
          <span v-if="!$store.data.selectedPack?.id">Selected Pack</span>
          <select-value placeholder="Selected Pack" />
        </select-trigger>
        <select-content>
          <select-group v-if="packOptions.length">
            <select-item
              v-for="pack in packOptions"
              :key="pack.value"
              :disabled="!$userStore.isPaidMember && pack.locked"
              hide-checkmark
              :value="String(pack.value)">
              {{ pack.label }}{{ !$userStore.isPaidMember && pack.locked ? ' (Locked)' : '' }}
            </select-item>
          </select-group>
          <select-group v-else>
            <select-item
              disabled
              hide-checkmark
              value="0">
              No packs found
            </select-item>
          </select-group>
        </select-content>
      </select-root>
    </div>

    <div
      v-tippy="{
        content: createBlocked ? FREE_PACK_CREATE_TIP : ''
      }">
      <button-root
        class="self-center"
        :disabled="createBlocked"
        @click="[ $store.dialogStates.managePackSettingsDialog = true, mode = 'create' ]">
        <icon-plus class="w-4 h-4 text-primary-foreground" />
        New Pack
      </button-root>
    </div>
  </div>
</template>
