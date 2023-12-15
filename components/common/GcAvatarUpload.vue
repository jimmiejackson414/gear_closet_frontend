<script lang='ts' setup>
  import vueFilePond, { type VueFilePondComponent } from 'vue-filepond'; 
  import { Cloudinary } from '@cloudinary/url-gen';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageResize from 'filepond-plugin-image-resize';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
  import { type FilePondErrorDescription, FilePondFile } from 'filepond';

  import 'filepond/dist/filepond.min.css';
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

  const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
  ) as VueFilePondComponent;

  const runtimeConfig = useRuntimeConfig();
  const cld = new Cloudinary({
    cloud: { cloudName: runtimeConfig.public.cloudinaryCloudName },
    url: { secure: true },
  });

  interface Props {
    file?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    file: undefined,
  });

  const emits = defineEmits(['handleError', 'handleAddFile', 'handleRemoveFile']);

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

  onMounted(() => {
    if (props.file && pondRef.value) {
      loadedExistingFile.value = true;
      const img = cld.image(props.file)
        .toURL();
      pondRef.value.addFile(img);
    }
  });
</script>

<template>
  <file-pond
    ref="pondRef"
    accepted-file-types="image/jpeg, image/png"
    :allow-file-encode="true"
    :allow-multiple="false"
    class="filepond-upload"
    image-crop-aspect-ratio="1:1"
    :image-preview-height="170"
    image-preview-max-file-size="2MB"
    :image-resize-target-height="250"
    :image-resize-target-width="250"
    label-idle="Drag & Drop your picture<br/>or <span class='filepond--label-action'>Browse</span>"
    :max-files="1"
    name="avatar-upload"
    style-button-remove-item-position="center bottom"
    style-load-indicator-position="center bottom"
    style-panel-layout="compact circle"
    @addfile="handleAddFile"
    @error="handleError"
    @removefile="handleRemoveFile" />
</template>
