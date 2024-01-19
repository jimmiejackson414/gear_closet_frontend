<script lang='ts' setup>
  import { PlusIcon, SettingsIcon } from 'lucide-vue-next';
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
          label="Selected Trip"
          :model-value="selectedPackId"
          name="selected-trip-select"
          :options="packOptions"
          size="sm"
          @update:model-value="handleSelectPack" />
      </div>

      <gc-button
        size="sm"
        @click="isCreatePackDialogOpen = true">
        <plus-icon class="h-4 mr-2 text-white w-4" />
        New Pack
      </gc-button>
    </div>
  </div>

  <!-- Create Pack Dialog -->
  <gc-modal
    :is-open="isCreatePackDialogOpen"
    size="sm"
    title="Create a New Pack"
    @handle-cancel="isCreatePackDialogOpen = false">
    <template #default>
      <div class="flex flex-col gap-4">
        <p class="text-base text-gray">
          Create a new pack to add to your closet.
        </p>
        <gc-input
          v-model:name="newPack.name"
          class="w-full"
          :disabled="submitting"
          label="Pack Name"
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
        <!-- TODO: Toggle and info circle for Make Private -->
        <!-- TODO: Toggle and info circle for Allow Comments -->
      </div>
    </template>
    <template #actions>
      <gc-button
        :disabled="submitting"
        label="Create Pack"
        :loading="submitting"
        size="sm"
        @click="createPack" />
    </template>
  </gc-modal>
</template>
