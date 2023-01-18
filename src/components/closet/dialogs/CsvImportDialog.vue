<template>
  <q-dialog
    :model-value="props.isOpen"
    class="csv-import-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-card-section>
        <div class="row justify-between align-center column">
          <h6 class="text-h6 q-ma-none">
            Import From CSV
          </h6>
          <p class="text-body1 q-mb-none">
            Uploading a CSV will automatically add these items to your Closet.
          </p>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-file
              v-model="file"
              outlined
              dense
              clearable
              :disable="isParsing"
              accept=".csv"
              label="CSV File"
              placeholder="Click to browse"
              @change="handleChangeFile">
              <template #prepend>
                <q-icon name="bi-file-earmark-arrow-up" />
              </template>
            </q-file>
            <p
              v-if="parsingError"
              class="text-body1 text-negative q-mt-sm q-mx-sm">
              An error occurred while parsing the CSV file. Please try again.
            </p>
          </div>
        </div>
        <div class="row q-mt-md q-pr-md items-center q-ml-none">
          <div class="col-6">
            <q-toggle
              v-model="addToPack"
              color="primary">
              <template #default>
                <span class="text-body1">
                  {{ toggleLabel }}
                  <q-icon name="bi-info-circle q-ml-sm">
                    <q-tooltip
                      anchor="top middle"
                      self="bottom middle">
                      {{ `Imported items will ${addToPack ? `be added to your ${selectedPack?.name} pack as well as your closet.` : 'only be added to your closet'}` }}
                    </q-tooltip>
                  </q-icon>
                </span>
              </template>
            </q-toggle>
          </div>
          <div class="col-6 text-right">
            <a
              class="text-body2"
              href="gear_closet_template.csv"
              download>
              <q-icon name="bi-cloud-download q-mr-sm" />
              Download Template
            </a>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="justify-between">
        <q-btn
          flat
          color="text"
          @click="emit('handleClose')">
          Cancel
        </q-btn>
        <q-btn
          flat
          color="primary"
          :disable="isParsing"
          :loading="isParsing"
          @click="handleImportCSV">
          Import
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import { ref, computed, watchEffect } from 'vue';
  import { storeToRefs } from 'pinia';
  import Papa, { ParseResult } from 'papaparse';
  import { useClosetStore } from '@/stores/closet';

  const props = defineProps<{
    isOpen: boolean;
  }>();

  const file = ref<File | null>(null);
  const content = ref<ParseResult<any> | null>(null);
  const parsed = ref(false);
  const isParsing = ref(false);
  const parsingError = ref(false);
  const addToPack = ref(true);

  const store = useClosetStore();
  const { selectedPack } = storeToRefs(store);

  const emit = defineEmits(['handleClose', 'handleUpdate']);

  const toggleLabel = computed(() => (selectedPack.value ? `Add to ${selectedPack.value.name} Pack?` : 'Add to Pack?'));

  const handleChangeFile = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    const userFile = (target.files as FileList)[0] as File;
    file.value = userFile;
  };

  // parse CSV
  const handleImportCSV = async (): Promise<void> => {
    isParsing.value = true;

    Papa.parse(file.value as File, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase()
        .replace(/\s/g, '_'),
      complete: (results: ParseResult<any>) => {
        content.value = results;
        parsed.value = true;
        isParsing.value = false;
        emit('handleUpdate', { content: content.value.data, addToPack: addToPack.value });
      },
      error: (err: any) => {
        console.error(err);
        parsingError.value = true;
        isParsing.value = false;
      },
    });
  };

  watchEffect(() => {
    if (!props.isOpen) {
      file.value = null;
      content.value = null;
      parsed.value = false;
      isParsing.value = false;
      parsingError.value = false;
      addToPack.value = true;
    }
  });
</script>

<style lang='scss' scoped>
  .csv-import-dialog {
    .q-card {
      border-top: 5px solid $primary;
      min-width: 250px;
    }
  }
</style>
