<script lang='ts' setup>
  import { Theme } from '@/types';
  import generateThemeOptions from '@/utils/chartTheme';

  export interface CreatePack {
    allow_comments: boolean;
    name: string;
    theme: Theme;
    private: boolean;
  }

  const $store = useClosetStore();
  const { dialogStates } = storeToRefs($store);
  const submitting = ref(false);
  const themeOptions = computed(() => generateThemeOptions());
  const newPack = reactive<CreatePack>({
    allow_comments: false,
    name: '',
    theme: Theme.BLUE6,
    private: true,
  });

  const handleCancelModal = () => {
    dialogStates.value.createPackDialog = false;
  };

  const handleSubmit = async () => {
    submitting.value = true;
    await $store.createPack(newPack);
    submitting.value = false;
    dialogStates.value.createPackDialog = false;
  };
</script>

<template>
  <gc-modal
    :is-open="dialogStates.createPackDialog"
    size="sm"
    title="Create a New Pack"
    @handle-cancel="handleCancelModal">
    <template #content>
      <div class="flex flex-col gap-6">
        <gc-input
          v-model="newPack.name"
          class="w-full"
          :disabled="submitting"
          label="Pack Name"
          name="pack-name"
          placeholder="Summer Pack" />
        <gc-select
          :disabled="submitting"
          label="Theme"
          :model-value="newPack.theme"
          :options="themeOptions"
          @update:model-value="(value: Theme) => newPack.theme = value">
          <template #option="{ option }">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <span
                  v-for="color in (option as Option).colors"
                  :key="color"
                  class="border-1 border-white h-4 rounded-[3px] w-4"
                  :style="{ backgroundColor: color }" />
              </div>
              <p class="text-base">
                {{ option.label }}
              </p>
            </div>
          </template>
        </gc-select>
        <div class="flex flex-col gap-3">
          <gc-toggle
            v-model="newPack.private"
            :disabled="submitting"
            variant="positive">
            <div class="flex items-center gap-2">
              <p class="text-base">
                Private
              </p>
              <info-icon
                v-tippy="{ content: 'Private packs cannot be viewed by other users. This setting can be changed later.' }"
                class="h-4 w-4" />
            </div>
          </gc-toggle>
          <gc-toggle
            v-model="newPack.allow_comments"
            :disabled="submitting"
            variant="positive">
            <div class="flex items-center gap-2">
              <p class="text-base">
                Allow Comments
              </p>
              <info-icon
                v-tippy="{ content: 'Allow users you share this pack with list to make comments? This setting can be changed later.' }"
                class="h-4 w-4" />
            </div>
          </gc-toggle>
        </div>
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Cancel"
        size="sm"
        variant="secondary"
        @click="handleCancelModal" />
      <gc-button
        :disabled="submitting"
        label="Create Pack"
        :loading="submitting"
        size="sm"
        @click="handleSubmit" />
    </template>
  </gc-modal>
</template>
