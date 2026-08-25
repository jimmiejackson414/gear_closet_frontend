<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { IconLink, IconType } from '#components';
  import { TripDetailsType } from '@/types';
  import type { Tables } from '@/types';

  interface Props {
    activeDetail: Tables<'trip_details'>;
    isOpen: boolean;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['onClose']);

  const $store = usePlanningStore();
  const submitting = ref(false);

  const editHeading = computed(() => {
    return props.activeDetail?.type === TripDetailsType.TRIP
      ? 'Edit Trip Detail'
      : 'Edit Hike Detail';
  });

  const valuesFromDetail = (detail: Tables<'trip_details'> | undefined) => ({
    title: detail?.title ?? '',
    value: detail?.value ?? '',
    has_url: Boolean(detail?.url),
    url: detail?.url ?? '',
  });

  const formSchema = toTypedSchema(z.object({
    title: z.string()
      .min(3)
      .max(50),
    value: z.string()
      .max(500)
      .optional(),
    has_url: z.boolean(),
    url: z.string()
      .optional(),
  })
    .refine(data => !data.has_url || Boolean(data.url?.trim()), {
      message: 'URL is required.',
      path: ['url'],
    }));

  const { isFieldDirty, handleSubmit, isSubmitting, values, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: valuesFromDetail(props.activeDetail),
  });

  const handleClose = () => {
    emits('onClose');
  };

  const onOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  watch(() => [props.isOpen, props.activeDetail] as const, ([open]) => {
    if (open) {
      setValues(valuesFromDetail(props.activeDetail));
    }
  });

  /**
   * Updates a detail.
   */
  const updateDetail = handleSubmit(async (v) => {
    try {
      submitting.value = true;
      const ok = await $store.updateTripDetail(props.activeDetail?.id as number, {
        title: v.title,
        value: v.value,
        url: v.has_url && v.url?.trim() ? prependProtocol(v.url.trim()) : null,
      });
      if (ok) handleClose();
    } finally {
      submitting.value = false;
    }
  });

  /**
   * Deletes a detail.
   */
  const deleteDetail = async () => {
    try {
      submitting.value = true;
      const ok = await $store.deleteTripDetail(props.activeDetail?.id as number);
      if (ok) handleClose();
    } finally {
      submitting.value = false;
    }
  };
</script>

<template>
  <dialog-root
    :open="isOpen"
    @update:open="onOpenChange">
    <dialog-content
      class="sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>{{ editHeading }}</dialog-title>
        <dialog-description>
          Update the title, description, and optional link for this detail.
        </dialog-description>
      </dialog-header>
      <div
        class="w-full"
        data-testid="modify-detail-dialog">
        <form class="flex flex-col gap-6 w-full">
          <!-- Title -->
          <form-field
            v-slot="{ componentField }"
            name="title"
            :validate-on-blur="!isFieldDirty">
            <form-item>
              <form-label>Title</form-label>
              <form-control>
                <input-root
                  :disabled="isSubmitting"
                  :prepend-icon="IconType"
                  v-bind="componentField" />
              </form-control>
              <form-message />
            </form-item>
          </form-field>

          <!-- Value -->
          <form-field
            v-slot="{ componentField }"
            name="value"
            :validate-on-blur="!isFieldDirty">
            <form-item>
              <form-label>Description</form-label>
              <form-control>
                <input-root
                  :disabled="isSubmitting"
                  :prepend-icon="IconType"
                  v-bind="componentField" />
              </form-control>
              <form-message />
            </form-item>
          </form-field>

          <div class="flex flex-col gap-2">
            <!-- Has Url -->
            <form-field
              v-slot="{ value, handleChange }"
              name="has_url"
              type="checkbox"
              :validate-on-blur="!isFieldDirty">
              <form-item class="flex flex-row items-start gap-x-3 space-y-0">
                <form-control>
                  <checkbox
                    :checked="value"
                    :disabled="isSubmitting"
                    @update:checked="handleChange" />
                </form-control>
                <form-label>Link to URL?</form-label>
                <form-message />
              </form-item>
            </form-field>

            <!-- Url -->
            <form-field
              v-if="values.has_url"
              v-slot="{ componentField }"
              name="url"
              :validate-on-blur="!isFieldDirty">
              <form-item>
                <form-label>URL</form-label>
                <form-control>
                  <input-root
                    :disabled="isSubmitting"
                    :prepend-icon="IconLink"
                    v-bind="componentField" />
                </form-control>
                <form-message />
              </form-item>
            </form-field>
          </div>
        </form>
      </div>
      <dialog-footer>
        <dialog-close
          :disabled="isSubmitting"
          @click="handleClose">
          Cancel
        </dialog-close>
        <div class="flex items-center gap-4">
          <button-root
            data-testid="delete-detail"
            :disabled="isSubmitting"
            type="button"
            variant="destructive"
            @click="deleteDetail">
            Delete
          </button-root>
          <button-root
            data-testid="update-detail"
            :disabled="isSubmitting"
            :loading="isSubmitting"
            type="button"
            @click="updateDetail">
            Update
          </button-root>
        </div>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
