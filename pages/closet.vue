<script lang='ts' setup>
  import Papa, { type ParseResult } from 'papaparse';
  import { InfoIcon, PlusIcon, SettingsIcon } from 'lucide-vue-next';
  import generateThemeOptions from '@/utils/chartTheme';
  import { Theme } from '@/types';
  import type { ExtendedPack, SelectOption, ParsedResults, ExtendedCategory } from '@/types/helpers';
  import type { Database } from '@/types';

  definePageMeta({ layout: 'page-layout' });

  const $route = useRoute();
  const $appStore = useAppStore();
  const $store = useClosetStore();
  const $cookie = useCookie('selectedPackId');
  const { data, pageLoading } = storeToRefs($store);

  const packOptions = computed(() => data.value.allPacks.map(p => ({ label: p.name, value: p.id })) as SelectOption[]);
  
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
   * Handles file upload.
   */
  const isUploadCsvModalOpen = ref(false);
  const file = ref<File | undefined>(undefined);
  const parsingResult = ref<{ status?: 'success' | 'failure', message?: string }>({
    status: undefined,
    message: undefined,
  });
  const parseFile = async (file: File | undefined) => {
    if (!file) return;
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.toLowerCase()
          .trim()
          .replace(/\s/g, '_'),
        complete: (results: ParseResult<Record<string, unknown>>) => {
          parsingResult.value = {
            status: 'success',
            message: 'Successfully parsed CSV file!',
          };
          resolve(results);
        },
        error: (err) => {
          parsingResult.value = {
            status: 'failure',
            message: 'There was an error parsing the CSV file.',
          };
          reject(err);
        },
      });
    });
  };

  /**
   * Upload items to pack from CSV
   */
  const insertItemsFromCsv = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();

      const parseResults = await parseFile(file.value) as ParsedResults;
      if (parseResults.data?.length) {
        const { data: createdCategory, error } = await supabase
          .rpc('import_csv_data', {
            p_pack_id: data.value.selectedPack?.id as number,
            csv_data: parseResults.data,
          })
          .returns<ExtendedCategory>();

        if (createdCategory && !error) {
          (data.value.selectedPack as ExtendedPack).categories.push(createdCategory);
          $appStore.notifyPositive('Successfully imported your items!');
        } else {
          $appStore.notifyNegative('There was an error importing the CSV.');
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error uploading the csv.');
    } finally {
      submitting.value = false;
      isUploadCsvModalOpen.value = false;
    }
  };

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

      if (createdPack?.length && !error) {
        data.value.allPacks.push({ id: createdPack[0].id, name: createdPack[0].name as string, slug: createdPack[0].slug as string });
        data.value.selectedPack = createdPack[0] as ExtendedPack;
        $appStore.notifyPositive('Pack created successfully.');
      } else {
        $appStore.notifyNegative('There was an error creating the pack.');
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error creating the pack.');
    } finally {
      submitting.value = false;
      isCreatePackDialogOpen.value = false;
    }
  };

  /**
   * Creates a new default category.
   */
  const createCategory = async () => {
    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();
      const { data: createdCategory, error } = await supabase
        .rpc('create_category_and_item', {
          p_name: 'Miscellaneous',
          p_pack_id: data.value.selectedPack?.id as number,
          p_items: [{
            name: 'Miscellaneous',
            generic_type: 'Miscellaneous',
            weight: 0,
            quantity: 0,
            price: 0,
            consumable: false,
            worn: false,
          }],
        })
        .returns<ExtendedCategory>();

      if (createdCategory && !error) {
        (data.value.selectedPack as ExtendedPack).categories.push(createdCategory);
        $appStore.notifyPositive('Category created successfully.');
      } else {
        $appStore.notifyNegative('There was an error creating the category.');
      }
    } catch (err) {
      console.log({ err });
      $appStore.notifyNegative('There was an error creating the category.');
    } finally {
      submitting.value = false;
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
                <headless-menu-item @click="isUploadCsvModalOpen = true">
                  <p class="block cursor-pointer duration-150 ease-in-out font-medium px-4 py-2 rounded-b-lg text-dark-grey hover:bg-gray-100">
                    Import from CSV
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
          :model-value="(data.selectedPack?.id as number)"
          name="selected-trip-select"
          :options="packOptions"
          placeholder="Selected Pack"
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

    <div v-if="!data.allPacks.length">
      <gc-empty-state>
        <h5 class="font-bold mb-3 text-base-lg">
          You haven't created any packs yet!
        </h5>
        <p class="mb-4 text-base">
          Click the button below to get started.
        </p>
        <gc-button
          label="Create a new pack"
          outlined
          size="sm"
          @click="isCreatePackDialogOpen = true" />
      </gc-empty-state>
    </div>

    <!-- Pack Summary & Tables -->
    <div v-else-if="data.selectedPack">
      <div v-if="!data.selectedPack.categories.length">
        <gc-empty-state>
          <h5 class="font-bold mb-2 text-base-lg">
            Successfully created your new {{ data.selectedPack.name }} pack!
          </h5>
          <p class="mb-0 text-base">
            The next step is to add some items to your pack.
          </p>
          <p class="mb-4 text-base">
            You can add items to your pack by clicking the Get Started button below or by uploading a CSV file.
          </p>
          <div class="flex justify-center items-center gap-4">
            <gc-button
              label="Get started"
              size="sm"
              @click="createCategory" />
            <gc-button
              label="Upload CSV"
              outlined
              size="sm"
              @click="isUploadCsvModalOpen = true" />
          </div>
        </gc-empty-state>
      </div>
      <div v-else>
        <pack-summary />
        <div class="mt-8">
          <h5 class="font-bold mb-3 text-lg">
            Pack Details
          </h5>
          <pack-items-table
            v-for="category in data.selectedPack.categories"
            :key="category.id"
            :category="category" />
        </div>
      </div>
    </div>

    <!-- Create Pack Dialog -->
    <gc-modal
      :is-open="isCreatePackDialogOpen"
      size="sm"
      title="Create a New Pack"
      @handle-cancel="isCreatePackDialogOpen = false">
      <template #default>
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

    <!-- Upload from CSV -->
    <gc-modal
      :is-open="isUploadCsvModalOpen"
      title="Upload from CSV"
      @handle-cancel="isUploadCsvModalOpen = false">
      <template #default>
        <div class="flex items-center flex-col gap-4">
          <p class="mb-0 text-base text-gray">
            Upload a CSV file to automatically add items to your pack. Any items that already exist will not be affected.
          </p>
          <gc-file-input
            class="my-4 w-full"
            @update:model-value="file = $event">
            <template #label>
              <div class="flex items-center gap-2">
                Import pack items (optional)
                <info-icon
                  class="h-4 w-4"
                  data-tooltip-placement="top"
                  data-tooltip-target="tooltip-import" />
                <div
                  id="tooltip-import"
                  class="absolute bg-dark-grey duration-300 font-medium inline-block invisible opacity-0 px-3 py-2 rounded-lg shadow-sm text-sm text-white tooltip transition-opacity z-10"
                  role="tooltip"
                  @mouseover="$event.stopPropagation">
                  Uploading a CSV will automatically add them to your pack.
                </div>
              </div>
            </template>
            <template #help-text>
              <a
                class="hyperlink inline-block"
                href="gear_closet_template.csv">Download CSV template</a>
            </template>
          </gc-file-input>
        </div>
      </template>
      <template #actions>
        <gc-button
          :disabled="submitting"
          label="Cancel"
          size="sm"
          variant="secondary"
          @click="isUploadCsvModalOpen = false" />
        <gc-button
          :disabled="submitting"
          label="Add Items"
          :loading="submitting"
          size="sm"
          @click="insertItemsFromCsv" /> 
      </template>
    </gc-modal>

    <!-- Share Pack Dialog -->
  </div>
</template>
