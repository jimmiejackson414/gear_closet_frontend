<template>
  <div class="row q-mb-sm justify-center">
    <p class="text-body1 q-mt-none q-mb-md">
      1. Upload a profile picture
    </p>
  </div>
  <AvatarUpload
    @handle-add-file="handleAddAvatar"
    @handle-error="handleAvatarError"
    @handle-remove-file="handleRemoveAvatar" />
  <Alert
    v-if="uploadError"
    severity="error"
    message="There was an error updating your avatar. Please try again later!" />
  <q-stepper-navigation class="row">
    <q-space />
    <q-btn
      color="primary"
      :loading="isSubmitting"
      :ripple="false"
      :label="hasFile ? 'Continue' : 'Skip'"
      @click="handleNextStep" />
  </q-stepper-navigation>
</template>

<script lang='ts' setup>
  import { ref } from 'vue';
  import { FilePondFile } from 'filepond';
  import { useUserStore } from '@/stores/user';
  import { getSdk } from '@/generated/types';
  import { useClient } from '@/lib/graphqlRequest';
  import Alert from '@/components/common/Alert.vue';
  import AvatarUpload from '@/components/common/AvatarUpload.vue';

  const client = useClient();
  const sdk = getSdk(client);
  const user = useUserStore();

  const emit = defineEmits(['handleNextStep']);

  const avatarFile = ref<any>(null);
  const hasFile = ref(false);
  const uploadError = ref(false);
  const isSubmitting = ref(false);

  const handleAddAvatar = (file: FilePondFile): void => {
    hasFile.value = true;
    uploadError.value = false;
    avatarFile.value = file;
  };

  const handleRemoveAvatar = (): void => {
    avatarFile.value = null;
  };

  const handleAvatarError = (): void => {
    uploadError.value = true;
  };

  const handleNextStep = async (): Promise<void> => {
    isSubmitting.value = true;

    if (!avatarFile.value) {
      emit('handleNextStep');
      isSubmitting.value = false;
      return;
    }

    try {
      const payload = { input: { id: user.currentUser?.id as string, file: avatarFile.value.getFileEncodeDataURL() } };
      await sdk.UpdateAvatar(payload);
      emit('handleNextStep');
      isSubmitting.value = false;
    } catch (error) {
      uploadError.value = true;
      isSubmitting.value = false;
    }
  };
</script>

<style lang='scss' scoped>
  .filepond-upload {
    margin: 0 auto;
    max-width: 400px;
  }
</style>
