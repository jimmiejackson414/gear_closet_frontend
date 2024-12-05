<script lang='ts' setup>
  import type { SelectOption } from '@/types/helpers';

  const $store = useClosetStore();
  const { data, dialogStates, pageLoading } = storeToRefs($store);
  const { isPaidMember } = storeToRefs(useUserStore());

  const packOptions = computed(() => data.value.allPacks.map(p => ({ label: p.name, value: p.id })) as SelectOption[]);

  const handleSelectPack = async (val: string) => {
    const cookie = useCookie('selectedPackId');
    const foundPack = data.value.allPacks.find(p => p.id === Number(val));
    cookie.value = encrypt(foundPack?.id);
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
              v-tippy="{ content: !data.selectedPack ? 'Please select a pack to import items.' : '' }"
              :disabled="!data.selectedPack"
              @select="dialogStates.uploadCsvDialog = true">
              Import from CSV
            </dropdown-menu-item>
            <dropdown-menu-item
              v-tippy="{ content: !data.selectedPack ? 'Please select a pack to share.' : '' }"
              :disabled="!data.selectedPack"
              @select="dialogStates.sharePackDialog = true">
              Share pack list
            </dropdown-menu-item>
            <dropdown-menu-item
              v-tippy="{ content: !data.selectedPack ? 'Please select a pack to delete.' : '' }"
              :disabled="!data.selectedPack"
              @select="dialogStates.deletePackDialog = true">
              Delete pack
            </dropdown-menu-item>
          </dropdown-menu-content>
        </dropdown-menu>
      </div>
      <select-root
        :default-value="String(data.selectedPack?.id)"
        :disabled="pageLoading"
        :model-value="String(data.selectedPack?.id)"
        @update:model-value="handleSelectPack">
        <select-trigger>
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
        content: !isPaidMember && data.allPacks.length >= 1 ? 'Free accounts are limited to one pack. Please upgrade to enjoy unlimited packs!' : ''
      }">
      <button-root
        class="self-center"
        :disabled="!isPaidMember && data.allPacks.length >= 1"
        size="sm"
        @click="$store.dialogStates.createPackDialog = true">
        <icon-plus class="h-4 text-primary-foreground w-4" />
        New Pack
      </button-root>
    </div>
  </div>
</template>
