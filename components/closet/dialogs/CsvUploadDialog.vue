<script lang='ts' setup>
  import Papa, { type ParseResult } from 'papaparse';
  import type { Database } from '@/types';
  import type { ExtendedCategory, ExtendedPack, ParsedResults } from '@/types/helpers';

  const $store = useClosetStore();
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
            p_pack_id: $store.data.selectedPack?.id as number,
            csv_data: parseResults.data,
          })
          .returns<ExtendedCategory[]>();

        if (createdCategory && !error) {
          ($store.data.selectedPack as ExtendedPack).categories.push(...createdCategory);
          $appStore.notifyPositive('Successfully imported your items!');
        } else {
          $appStore.notifyNegative('There was an error importing the CSV.');
        }
      }
    } catch (err) {
      $appStore.notifyNegative('There was an error uploading the csv.');
    } finally {
      submitting.value = false;
      $store.dialogStates.uploadCsvDialog = false;
    }
  };

  /**
   * Reset file and parsing result on close
   */
  watch(() => $store.dialogStates.uploadCsvDialog, (newValue) => {
    if (!newValue) {
      file.value = undefined;
      parsingResult.value = {
        status: undefined,
        message: undefined,
      };
    }
  });

  const handleClose = () => {
    $store.dialogStates.uploadCsvDialog = false;
  };
</script>

<template>
  <dialog-root :open="$store.dialogStates.uploadCsvDialog">
    <dialog-content
      class="max-h-[90dvh] sm:max-w-[450px] lg:max-w-[650px]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>Import from CSV</dialog-title>
        <dialog-description>
          Upload a CSV file to automatically add items to your pack. Any items that already exist will not be affected.
        </dialog-description>
      </dialog-header>
      <div class="flex items-center flex-col gap-6">
        <div class="flex flex-col gap-1.5">
          <label-root for="file-upload">
            Import pack items (optional)
          </label-root>
          <input-root
            id="file-upload"
            accept=".csv"
            type="file"
            @change="file = $event.target.files?.[0]" />
          <a
            class="inline-block text-hyperlink"
            href="gear_closet_template.csv">Download CSV template</a>
        </div>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="handleClose">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting"
          :loading="submitting"
          @click="handleSubmit">
          Import items
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
