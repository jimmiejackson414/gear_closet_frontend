<script lang='ts' setup>
  import type { AcceptableValue } from 'reka-ui';
  import type { SelectOption } from '@/types/helpers';

  const $store = useClosetStore();
  const $userStore = useUserStore();
  const $router = useRouter();
  const $route = useRoute();

  const packOptions = computed(() => $store.data.allPacks.map(p => ({ label: p.name, value: p.id })) as SelectOption[]);

  const defaultMode = ref<'create' | 'update'>('create');
  const mode = inject<Ref<'create' | 'update'>>('dialogMode', defaultMode);

  /**
   * Persist cookie, clear pinned ?pack=, refetch.
   * Cookie-only updates previously relied on a container watcher (removed).
   */
  const handleSelectPack = async (val: AcceptableValue) => {
    if (val == null || val === '') return;

    const packId = Number(val);
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
  <div class="flex justify-between lg:justify-end items-center gap-6 mb-8">
    <div class="flex justify-center items-center gap-4">
      <div class="flex">
        <dropdown-menu>
          <dropdown-menu-trigger>
            <icon-settings
              class="h-6 w-6"
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
        <select-trigger class="min-w-45">
          <span v-if="!$store.data.selectedPack?.id">Selected Pack</span>
          <select-value placeholder="Selected Pack" />
        </select-trigger>
        <select-content>
          <select-group v-if="packOptions.length">
            <select-item
              v-for="pack in packOptions"
              :key="pack.value"
              hide-checkmark
              :value="String(pack.value)">
              {{ pack.label }}
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
        content: !$userStore.isPaidMember && $store.data.allPacks.length >= 1 ? 'Free accounts are limited to one pack. Please upgrade to enjoy unlimited packs!' : ''
      }">
      <button-root
        class="self-center"
        :disabled="!$userStore.isPaidMember && $store.data.allPacks.length >= 1"
        @click="[ $store.dialogStates.managePackSettingsDialog = true, mode = 'create' ]">
        <icon-plus class="h-4 text-primary-foreground w-4" />
        New Pack
      </button-root>
    </div>
  </div>
</template>
