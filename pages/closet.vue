<script lang='ts' setup>
  import { InfoIcon, PlusIcon, SettingsIcon } from 'lucide-vue-next';
  import generateThemeOptions from '@/utils/chartTheme';
  import { Theme } from '@/types';
  import type { SelectOption } from '@/types/helpers';
  import type { Database, Tables } from '@/types';

  definePageMeta({ layout: 'page-layout' });

  const $route = useRoute();
  const $appStore = useAppStore();
  const $store = useClosetStore();
  const $cookie = useCookie('selectedPackId');
  const { data, pageLoading, selectedPackId } = storeToRefs($store);

  const packOptions = computed(() => data.value.packs.map((p: Tables<'packs'>) => ({ label: p.name, value: p.id })) as SelectOption[]);
  
  let identifier = 0;
  watch($cookie, (newValue) => {
    if (newValue && !$route.query?.pack) {
      identifier = Number(decrypt(newValue)) || 0;
      $store.fetchClosetPage(identifier);
    }
  }, { immediate: true });

  onMounted(async () => {
    identifier = $route.query?.pack ? Number(decrypt($route.query.pack)) || 0 : identifier;
    await $store.fetchClosetPage(identifier);
  });

  const submitting = ref(false);
  const isCreatePackDialogOpen = ref(false);
  const themeOptions = computed(() => generateThemeOptions());
  const newPack = reactive({
    allow_comments: false,
    name: '',
    theme: Theme.BLUE6,
    private: true,
  });

  /**
   * Creates a new pack.
   */
  const createPack = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const { data: createdPack, error } = await supabase.from('packs')
        .insert([{
          ...newPack,
          profile_id: user.value?.id as string,
        }])
        .select();
      console.log({ createdPack, error });
    } catch (err) {
      $appStore.notifyNegative('There was an error creating the pack.');
    } finally {
      submitting.value = false;
      isCreatePackDialogOpen.value = false;
    }
  };

  const handleCancelModal = () => {
    isCreatePackDialogOpen.value = false;
    newPack.allow_comments = false;
    newPack.name = '';
    newPack.theme = Theme.BLUE6;
    newPack.private = true;
  };

  const handleSelectPack = async (pack: { label: string, value: number }) => {
    const cookie = useCookie('selectedPackId');
    cookie.value = encrypt(pack.value);
  };

  const sharePackList = () => {
    // TODO: Implement sharing pack list.
  };

  useHead({
    title: 'Closet | Gear Closet',
    meta: [
      {
        name: 'description',
        content: 'Welcome to your Gear Closet!',
      },
    ],
  });
</script>

<template>
  <div class="pb-8">
    <!-- Settings Row -->
    <div class="flex justify-between lg:justify-end items-center gap-6 mb-8">
      <div class="flex justify-center items-center gap-4">
        <div class="flex">
          <headless-menu
            as="div"
            class="inline-block relative text-left">
            <div>
              <headless-menu-button class="duration-150 ease-snap focus-visible:ring-2 focus-visible:ring-white/0 font-medium inline-flex justify-center outline-none focus:outline-none px-4 py-2 rounded-md text-gray-500 hover:text-dark-grey text-sm w-full">
                <settings-icon class="h-6 w-6" />
              </headless-menu-button>
            </div>
            <zoom-transition>
              <headless-menu-items class="absolute right-0 bg-white divide-gray-100 divide-y mt-2 origin-top-right ring-1 ring-black/5 rounded-md shadow-lg w-56 focus:outline-none">
                <headless-menu-item
                  class="border-b border-gray-300"
                  disabled>
                  <p class="!text-xs block font-bold px-4 py-2 rounded-t-lg text-eyebrow text-grey">
                    Settings
                  </p>
                </headless-menu-item>
                <headless-menu-item @click="sharePackList">
                  <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-dark-grey hover:bg-gray-100">
                    Share pack list
                  </p>
                </headless-menu-item>
              </headless-menu-items>
            </zoom-transition>
          </headless-menu>
        </div>
        <gc-select
          :disabled="pageLoading"
          :model-value="selectedPackId"
          name="selected-trip-select"
          :options="packOptions"
          placeholder="Selected Trip"
          size="sm"
          @update:model-value="handleSelectPack" />
      </div>

      <gc-button
        class="self-center"
        size="sm"
        @click="isCreatePackDialogOpen = true">
        <plus-icon class="h-4 mr-2 text-white w-4" />
        New Pack
      </gc-button>
    </div>

    <!-- Create Pack Dialog -->
    <gc-modal
      :is-open="isCreatePackDialogOpen"
      size="sm"
      title="Create a New Pack"
      @handle-cancel="isCreatePackDialogOpen = false">
      <template #default>
        <div class="flex flex-col gap-4">
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
          <gc-toggle
            v-model="newPack.private"
            :disabled="submitting"
            variant="positive">
            <div class="flex items-center gap-2">
              <p class="text-base">
                Private
              </p>
              <info-icon
                class="h-4 w-4"
                data-tooltip-placement="right"
                data-tooltip-target="tooltip-private" />
              <div
                id="tooltip-private"
                class="absolute bg-dark-grey duration-300 font-medium inline-block invisible opacity-0 px-3 py-2 rounded-lg shadow-sm text-sm text-white tooltip transition-opacity z-10"
                role="tooltip"
                @mouseover="$event.stopPropagation">
                Private packs cannot be viewed by other users.<br>This setting can be changed later.
              </div>
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
                class="h-4 w-4"
                data-tooltip-placement="right"
                data-tooltip-target="tooltip-comments" />
              <div
                id="tooltip-comments"
                class="absolute bg-dark-grey duration-300 font-medium inline-block invisible opacity-0 px-3 py-2 rounded-lg shadow-sm text-sm text-white tooltip transition-opacity z-10"
                role="tooltip"
                @mouseover="$event.stopPropagation">
                Allow users you share this pack with list to make comments?<br>This setting can be changed later.
              </div>
            </div>
          </gc-toggle>
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
          @click="createPack" />
      </template>
    </gc-modal>
  </div>
</template>
