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

  const fileInputRef = ref<HTMLInputElement | null>(null);
  const fileLabel = computed(() => file.value?.name ?? 'No file selected');

  const existingItemCount = computed(() => {
    const categories = $store.data.selectedPack?.categories ?? [];
    return categories.reduce(
      (sum, category) => sum + (category.category_items?.length ?? 0),
      0,
    );
  });

  const packName = computed(() => $store.data.selectedPack?.name ?? 'this pack');

  const chooseFile = () => {
    fileInputRef.value?.click();
  };

  const templateTooltip = {
    appendTo: () => document.body,
    content: 'Download template',
    placement: 'top' as const,
  };

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
      if (fileInputRef.value) {
        fileInputRef.value.value = '';
      }
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
          Export your list from LighterPack (Share → Export to CSV), or download the CSV template
          and fill it in manually, then upload the file here.
        </dialog-description>
      </dialog-header>
      <div class="flex flex-col gap-4 w-full">
        <div
          v-if="existingItemCount"
          class="bg-muted/50 px-4 py-3 border rounded-lg text-sm">
          <p class="font-medium">
            {{ packName }} already has {{ existingItemCount }} item{{ existingItemCount === 1 ? '' : 's' }}.
          </p>
          <p class="mt-1 text-muted-foreground">
            Imported items will be inserted into {{ packName }} — nothing is removed or updated.
            Matching category names get new items appended; new categories are created as needed.
            Importing the same file again will create duplicates.
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <label-root for="file-upload">
            CSV file
          </label-root>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <div class="flex flex-1 items-center gap-3 bg-background px-3 py-2 border border-input rounded-md min-h-10 min-w-0">
              <button-root
                size="sm"
                type="button"
                variant="secondary"
                @click="chooseFile">
                Choose file
              </button-root>
              <typography
                class="flex-1 truncate text-sm"
                :class="file ? 'text-foreground' : 'text-muted-foreground'"
                variant="small">
                {{ fileLabel }}
              </typography>
            </div>
            <a
              v-tippy="templateTooltip"
              aria-label="Download template"
              class="inline-flex shrink-0 justify-center items-center hover:bg-accent rounded-md w-9 h-9 text-foreground hover:text-accent-foreground transition-colors"
              href="gear_closet_template.csv">
              <icon-download class="w-4 h-4" />
            </a>
          </div>
          <input
            id="file-upload"
            ref="fileInputRef"
            accept=".csv"
            class="sr-only"
            type="file"
            @change="onFileChange">
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
