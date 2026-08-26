<script lang='ts' setup>
  import Papa, { type ParseResult } from 'papaparse';
  import {
    prepareCsvRowsForImport,
    validateCsvHeaders,
  } from '@/utils/csvImport';
  import type { Database } from '@/types';

  const $store = useClosetStore();
  const $appStore = useAppStore();
  const submitting = ref(false);
  const file = ref<File | undefined>(undefined);
  const parsedRows = ref<ReturnType<typeof prepareCsvRowsForImport>>([]);
  const parsingResult = ref<{ status?: 'success' | 'failure', message?: string }>({
    message: undefined,
    status: undefined,
  });

  const canImport = computed(() =>
    Boolean(
      file.value
        && parsingResult.value.status === 'success'
        && parsedRows.value.length
        && $store.data.selectedPack?.id,
    ));

  const parseFile = async (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    return new Promise<void>((resolve, reject) => {
      Papa.parse<Record<string, unknown>>(selectedFile, {
        complete: (results: ParseResult<Record<string, unknown>>) => {
          const headerError = validateCsvHeaders(results.meta.fields);
          if (headerError) {
            parsingResult.value = {
              message: headerError,
              status: 'failure',
            };
            parsedRows.value = [];
            resolve();
            return;
          }

          const rows = prepareCsvRowsForImport(results.data);
          if (!rows.length) {
            parsingResult.value = {
              message: 'No importable rows were found. Each row needs an item name and category.',
              status: 'failure',
            };
            parsedRows.value = [];
            resolve();
            return;
          }

          parsedRows.value = rows;
          parsingResult.value = {
            message: `Ready to import ${rows.length} item${rows.length === 1 ? '' : 's'}.`,
            status: 'success',
          };
          resolve();
        },
        dynamicTyping: true,
        error: (err) => {
          parsingResult.value = {
            message: 'There was an error parsing the CSV file.',
            status: 'failure',
          };
          parsedRows.value = [];
          reject(err);
        },
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.toLowerCase()
          .trim()
          .replace(/\s/g, '_'),
      });
    });
  };

  const onFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    file.value = input.files?.[0];
    parsingResult.value = { message: undefined, status: undefined };
    parsedRows.value = [];

    if (!file.value) return;

    try {
      await parseFile(file.value);
    } catch {
      // parsingResult already set in parseFile error handler
    }
  };

  const handleSubmit = async () => {
    if (!canImport.value || !$store.data.selectedPack?.id) return;

    try {
      submitting.value = true;
      const supabase = useSupabaseClient<Database>();

      const { data, error } = await supabase.rpc('import_csv_data', {
        csv_data: parsedRows.value,
        p_pack_id: $store.data.selectedPack.id,
      });

      if (error) {
        $appStore.notifyNegative('There was an error importing the CSV.');
        return;
      }

      const importedCount = typeof data === 'object'
        && data
        && 'imported_count' in data
        ? Number((data as { imported_count: number }).imported_count)
        : parsedRows.value.length;

      await $store.fetchClosetPage($store.data.selectedPack.id);
      $appStore.notifyPositive(
        importedCount === 1
          ? 'Successfully imported 1 item.'
          : `Successfully imported ${importedCount} items.`,
      );
      $store.dialogStates.uploadCsvDialog = false;
    } catch {
      $appStore.notifyNegative('There was an error uploading the csv.');
    } finally {
      submitting.value = false;
    }
  };

  watch(() => $store.dialogStates.uploadCsvDialog, (newValue) => {
    if (!newValue) {
      file.value = undefined;
      parsedRows.value = [];
      parsingResult.value = {
        message: undefined,
        status: undefined,
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
      class="sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>Import from CSV</dialog-title>
        <dialog-description>
          Export your list from LighterPack (Share → Export to CSV), then upload it here to add
          items to this pack. Re-importing the same file may create duplicate items.
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col items-center gap-6">
        <div class="flex flex-col gap-1.5 w-full">
          <label-root for="file-upload">
            LighterPack or Gear Closet CSV
          </label-root>
          <input-root
            id="file-upload"
            accept=".csv"
            type="file"
            @change="onFileChange" />
          <a
            class="inline-block text-hyperlink"
            href="gear_closet_template.csv">Download CSV template</a>
          <typography
            v-if="parsingResult.message"
            :class="parsingResult.status === 'failure' ? 'text-destructive' : 'text-muted-foreground'"
            variant="muted">
            {{ parsingResult.message }}
          </typography>
        </div>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="submitting"
          @click="handleClose">
          Cancel
        </dialog-close>
        <button-root
          :disabled="submitting || !canImport"
          :loading="submitting"
          @click="handleSubmit">
          Import items
        </button-root>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
