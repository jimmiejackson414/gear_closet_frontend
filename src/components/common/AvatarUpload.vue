<template>
  <file-pond
    ref="pondRef"
    class="filepond-upload"
    name="avatar-upload"
    label-idle="Drag & Drop your picture<br/>or <span class='filepond--label-action'>Browse</span>"
    :allow-multiple="false"
    :allow-file-encode="true"
    image-preview-max-file-size="2MB"
    image-crop-aspect-ratio="1:1"
    :image-resize-target-height="250"
    :image-resize-target-width="250"
    :max-files="1"
    :image-preview-height="170"
    accepted-file-types="image/jpeg, image/png"
    style-panel-layout="compact circle"
    style-load-indicator-position="center bottom"
    style-button-remove-item-position="center bottom"
    @error="handleError"
    @addfile="handleAddFile"
    @removefile="handleRemoveFile" />
</template>

<script lang='ts' setup>
  /* eslint-disable no-spaced-func */
  /* eslint-disable func-call-spacing */
  import { onMounted, PropType, ref } from 'vue';
  import vueFilePond, { VueFilePondComponent } from 'vue-filepond';
  import cld from '@/lib/cloudinary';
  import 'filepond/dist/filepond.min.css';
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageResize from 'filepond-plugin-image-resize';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
  import { FilePondErrorDescription, FilePondFile } from 'filepond';

  const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
  ) as VueFilePondComponent;

  const props = defineProps({
    file: { type: String as PropType<any>, required: false, default: undefined },
  });

  const emit = defineEmits<{
    (e: 'handleError', error: Event): void;
    (e: 'handleAddFile', file: FilePondFile): void;
    (e: 'handleRemoveFile'): void;
  }>();

  const pondRef = ref<any>(undefined);
  const loadedExistingFile = ref(false);

  const handleError = (e: Event): void => {
    emit('handleError', e);
  };

  const handleAddFile = (error: FilePondErrorDescription, file: FilePondFile): void => {
    if (loadedExistingFile.value) {
      loadedExistingFile.value = false;
      return;
    }

    if (!error) emit('handleAddFile', file);
  };

  const handleRemoveFile = (error: FilePondErrorDescription): void => {
    if (!error) emit('handleRemoveFile');
  };

  onMounted(() => {
    if (props.file && pondRef.value) {
      loadedExistingFile.value = true;
      const img = cld.image(props.file)
        .toURL();
      pondRef.value.addFile(img);
    }
  });
</script>

<style lang="scss">
  /* stylelint-disable selector-class-pattern */
  .filepond--root {
    max-height: 250px !important;
    max-width: 250px !important;
    margin: 0 auto;

    .filepond--file-action-button {
      cursor: pointer;
    }
  }
</style>
