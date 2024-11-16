<script lang='ts' setup>
  import Papa, { type ParseResult } from 'papaparse';
  import type { Database } from '@/types';
  import type { ExtendedCategory, ExtendedPack, ParsedResults } from '@/types/helpers';

  const $store = useClosetStore();
  const { data, dialogStates } = storeToRefs($store);
  const submitting = ref(false);
  const file = ref<File | undefined>(undefined);
  const parsingResult = ref<{ status?: 'success' | 'failure', message?: string }>({
    status: undefined,
    message: undefined,
  });

  /**
   * Parse CSV file
   */
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
  const $appStore = useAppStore();
  const handleSubmit = async () => {
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
      dialogStates.value.uploadCsvDialog = false;
    }
  };

  /**
   * Reset file and parsing result on close
   */
  watch(() => dialogStates.value.uploadCsvDialog, (newValue) => {
    if (!newValue) {
      file.value = undefined;
      parsingResult.value = {
        status: undefined,
        message: undefined,
      };
    }
  });
</script>

<template>
  <gc-modal
    :is-open="dialogStates.uploadCsvDialog"
    title="Import from CSV"
    @handle-cancel="dialogStates.uploadCsvDialog = false">
    <template #content>
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
              <icon-info
                v-tippy="{ content: 'Uploading a CSV will automatically add them to your pack.' }"
                class="h-4 w-4" />
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
        @click="dialogStates.uploadCsvDialog = false" />
      <gc-button
        :disabled="submitting"
        label="Add Items"
        :loading="submitting"
        size="sm"
        @click="handleSubmit" />
    </template>
  </gc-modal>
</template>
