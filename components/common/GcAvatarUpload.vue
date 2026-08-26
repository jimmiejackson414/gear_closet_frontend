<script lang='ts' setup>
  import vueFilePondImport, { type VueFilePondComponent } from 'vue-filepond';
  import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageResize from 'filepond-plugin-image-resize';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
  import { cn } from '@/lib/utils';
  import type { FilePondErrorDescription, FilePondFile } from 'filepond';

  import 'filepond/dist/filepond.min.css';
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

  // vue-filepond@8 + Vite 8 may resolve the CJS interop as `{ default, setOptions }`
  const vueFilePond = (
    typeof vueFilePondImport === 'function'
      ? vueFilePondImport
      : (vueFilePondImport as unknown as { default: typeof vueFilePondImport }).default
  ) as (...plugins: unknown[]) => VueFilePondComponent;

  const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
  );

  interface Props {
    classes?: string;
    file?: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    classes: '',
    file: undefined,
  });

  const emits = defineEmits(['handleError', 'handleAddFile', 'handleRemoveFile', 'handleProcessStart']);

  const pondRef = ref<any>(undefined);
  const loadedExistingFile = ref(false);

  const handleError = (e: Event) => {
    emits('handleError', e);
  };

  const handleAddFile = (error: FilePondErrorDescription, file: FilePondFile) => {
    if (loadedExistingFile.value) {
      loadedExistingFile.value = false;
      return;
    }

    if (!error) emits('handleAddFile', file);
  };

  const handleRemoveFile = (error: FilePondErrorDescription) => {
    if (!error) emits('handleRemoveFile');
  };

  const initialFiles = computed(() => {
    if (props.file) {
      return [{
        options: {
          type: 'local',
        },
        source: props.file,
      }];
    }
    return [];
  });

  const serverOptions = {
    load: (source: string, load: (blob: Blob) => void) => {
      fetch(source)
        .then(response => response.blob())
        .then(blob => {
          load(blob);
          if (props.file) {
            loadedExistingFile.value = true;
          }
        });
    },
  };
</script>

<template>
  <file-pond
    ref="pondRef"
    accepted-file-types="image/jpeg, image/png"
    :allow-file-encode="true"
    :allow-multiple="false"
    :class-name="cn('filepond-upload', classes)"
    :files="initialFiles"
    image-crop-aspect-ratio="1:1"
    :image-preview-height="170"
    image-preview-max-file-size="2MB"
    :image-resize-target-height="250"
    :image-resize-target-width="250"
    label-idle="Drag & Drop your picture<br/>or <span class='filepond--label-action'>Browse</span>"
    :max-files="1"
    name="avatar-upload"
    :server="serverOptions"
    style-button-remove-item-position="center bottom"
    style-load-indicator-position="center bottom"
    style-panel-layout="compact circle"
    @addfile="handleAddFile"
    @addfilestart="$emit('handleProcessStart')"
    @error="handleError"
    @removefile="handleRemoveFile" />
</template>
