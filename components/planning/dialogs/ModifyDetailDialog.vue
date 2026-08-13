<script lang='ts' setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import * as z from 'zod';
  import { IconLink, IconType } from '#components';
  import type { Tables } from '@/types';
  import { TripDetailsType } from '@/types';

  interface Props {
    activeDetail: Tables<'trip_details'>;
    isOpen: boolean;
  }

  const props = defineProps<Props>();
  const emits = defineEmits(['onClose']);

  const $store = usePlanningStore();
  const submitting = ref(false);

  const dialogTitle = computed(() => {
    return props.activeDetail?.type === TripDetailsType.TRIP
      ? 'Edit Trip Detail'
      : 'Edit Hike Detail';
  });

  const formSchema = toTypedSchema(z.object({
    title: z.string()
      .min(3)
      .max(50),
    value: z.string()
      .min(3)
      .max(500)
      .optional(),
    has_url: z.boolean(),
    url: z.string()
      .url()
      .nullable()
      .optional(),
  })
    .refine(data => !data.has_url || (data.has_url && data.url), {
      message: "URL is required.",
      path: ["url"],
    }));

  const { isFieldDirty, handleSubmit, isSubmitting, values, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      title: props.activeDetail?.title as string,
      value: props.activeDetail?.value as string,
      has_url: Boolean(props.activeDetail?.url),
      url: props.activeDetail?.url as string,
    },
  });

  // on open, set the initial values manually
  watch(() => props.isOpen, (newValue) => {
    if (newValue) {
      setValues({
        title: props.activeDetail?.title as string,
        value: props.activeDetail?.value as string,
        has_url: Boolean(props.activeDetail?.url),
        url: props.activeDetail?.url as string,
      });
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
        url: v.url ? prependProtocol(v?.url as string) : null,
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

  const handleClose = () => {
    emits('onClose');
  };
</script>

<template>
  <dialog-root :open="isOpen">
    <dialog-content
      class="sm:max-w-112.5 lg:max-w-162.5 max-h-[90dvh]"
      @escape-key-down="handleClose"
      @interact-outside="handleClose">
      <dialog-header>
        <dialog-title>{{ dialogTitle }}</dialog-title>
      </dialog-header>
      <div class="w-full">
        <form class="flex flex-col gap-6 w-full">
          <!-- Title -->
          <form-field
            v-slot="{ componentField }"
            name="title"
            :validate-on-blur="!isFieldDirty">
            <form-item>
              <form-label>Trip Name</form-label>
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
            :disabled="isSubmitting"
            variant="destructive"
            @click="deleteDetail">
            Delete
          </button-root>
          <button-root
            :disabled="isSubmitting"
            :loading="isSubmitting"
            @click="updateDetail">
            Update
          </button-root>
        </div>
      </dialog-footer>
    </dialog-content>
  </dialog-root>
</template>
