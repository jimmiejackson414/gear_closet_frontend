<script lang='ts' setup>
  import { PlusIcon, SettingsIcon } from 'lucide-vue-next';
  import type { SelectOption } from '@/types/helpers';

  const $store = useClosetStore();
  const { data, dialogStates, pageLoading } = storeToRefs($store);
  const { isPaidMember } = storeToRefs(useUserStore());

  const packOptions = computed(() => data.value.allPacks.map(p => ({ label: p.name, value: p.id })) as SelectOption[]);

  const handleSelectPack = async (pack: { label: string, value: number }) => {
    const cookie = useCookie('selectedPackId');
    cookie.value = encrypt(pack.value);
  };
</script>

<template>
  <div class="flex justify-between lg:justify-end items-center gap-6 mb-8">
    <div class="flex justify-center items-center gap-4">
      <div class="flex">
        <headless-menu
          as="div"
          class="inline-block relative text-left">
          <div>
            <headless-menu-button class="duration-150 ease-snap focus-visible:ring-2 focus-visible:ring-white/0 font-medium inline-flex justify-center outline-none focus:outline-none px-4 py-2 rounded-md text-gray-500 hover:text-dark-grey text-sm w-full">
              <settings-icon
                class="h-6 w-6"
                data-testid="settings-icon-btn" />
            </headless-menu-button>
          </div>
          <zoom-transition>
            <headless-menu-items class="absolute right-0 bg-white divide-gray-100 divide-y mt-2 origin-top-right ring-1 ring-black/5 rounded-md shadow-lg w-56 focus:outline-none">
              <headless-menu-item
                v-tippy="{ content: !data.selectedPack ? 'Please select a pack to import items.' : '' }"
                as="p"
                class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                :class="{
                  'cursor-not-allowed opacity-50': !data.selectedPack,
                }"
                :disabled="!data.selectedPack"
                @click="$store.dialogStates.uploadCsvDialog = true">
                Import from CSV
              </headless-menu-item>
              <headless-menu-item
                v-tippy="{ content: !data.selectedPack ? 'Please select a pack to share.' : '' }"
                as="p"
                class="cursor-pointer px-4 py-2 hover:bg-gray-100"
                :class="{
                  'cursor-not-allowed opacity-50': !data.selectedPack,
                }"
                :disabled="!data.selectedPack"
                @click="dialogStates.sharePackDialog = true">
                Share pack list
              </headless-menu-item>
              <headless-menu-item
                v-tippy="{ content: !data.selectedPack ? 'Please select a pack to delete.' : '' }"
                as="p"
                class="cursor-pointer px-4 py-2 text-danger hover:bg-gray-100"
                :class="{
                  'cursor-not-allowed opacity-50': !data.selectedPack,
                }"
                :disabled="!data.selectedPack"
                @click="$store.dialogStates.deletePackDialog = true">
                Delete pack
              </headless-menu-item>
            </headless-menu-items>
          </zoom-transition>
        </headless-menu>
      </div>
      <gc-select
        :disabled="pageLoading"
        :model-value="(data.selectedPack?.id as number)"
        name="selected-trip-select"
        no-options-copy="No packs found"
        :options="packOptions"
        placeholder="Selected Pack"
        size="sm"
        @update:model-value="handleSelectPack" />
    </div>

    <div v-tippy="{ content: !isPaidMember && data.allPacks.length >= 1 ? 'Free accounts are limited to one pack. Please upgrade to enjoy unlimited packs!' : '' }">
      <gc-button
        class="self-center"
        :disabled="!isPaidMember && data.allPacks.length >= 1"
        size="sm"
        @click="$store.dialogStates.createPackDialog = true">
        <plus-icon class="h-4 mr-2 text-white w-4" />
        New Pack
      </gc-button>
    </div>
  </div>
</template>
