<template>
  <q-dialog
    :model-value="props.isOpen"
    class="edit-details-dialog"
    @keydown.escape="emit('handleClose')">
    <q-card>
      <q-form @submit.prevent.stop="handleUpdate">
        <q-card-section class="header">
          <div class="row justify-between align-center">
            <h6 class="text-h6 q-ma-none">
              Edit {{ capitalize(props.type) || '' }} Detail
            </h6>
            <q-btn
              class="pack-settings"
              round
              size="md"
              text-color="negative"
              unelevated
              :ripple="false"
              icon="bi-trash"
              :disable="isSubmitting"
              @click="handleRemoveDetail(detail)" />
          </div>
          <p
            v-if="props.description"
            class="text-body1 q-mb-none">
            {{ props.description }}
          </p>
        </q-card-section>
        <q-card-section>
          <div
            v-if="detail"
            class="col q-gutter-md">
            <q-list class="details-wrapper">
              <p class="text-body2 q-mb-xs">
                {{ capitalize(props.type) }} Details
              </p>
              <q-item
                dense
                class="q-px-none q-mb-md detail">
                <div class="top">
                  <q-input
                    v-model="detail.title"
                    outlined
                    dense
                    label="Title"
                    :disable="isSubmitting"
                    class="q-mr-xs" />
                  <q-input
                    v-model="detail.value"
                    outlined
                    dense
                    :disable="isSubmitting"
                    label="Value" />
                  <q-checkbox
                    v-model="checkbox.checked"
                    :ripple="false"
                    color="green-4"
                    :disable="isSubmitting"
                    label="URL?" />
                </div>
                <div
                  v-if="checkbox.checked"
                  class="bottom">
                  <q-input
                    v-model="detail.url"
                    outlined
                    dense
                    label="Website"
                    placeholder="https://www.google.com"
                    :disable="isSubmitting"
                    class="q-mt-sm url-input" />
                </div>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-card-actions class="justify-between">
          <q-btn
            unelevated
            :ripple="false"
            flat
            text-color="text"
            label="Cancel"
            :disable="isSubmitting"
            @click="emit('handleClose')" />
          <q-btn
            unelevated
            :ripple="false"
            color="primary"
            label="Update"
            :disable="isSubmitting"
            type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
  import {
    onMounted, reactive, ref, watchEffect,
  } from 'vue';
  import { DetailType, TripDetail, UpdateTripDetailInput } from '@/generated/types';
  import { capitalize } from '@/helpers/functions';
  import { usePlanningStore } from '@/stores/planning';

  interface Checkbox {
    id: number | null;
    checked: boolean;
  }

  // instantiate store
  const store = usePlanningStore();

  // define props
  const props = defineProps<{
    isOpen: boolean;
    detail: TripDetail;
    type: DetailType;
    description: string;
  }>();

  // define emits
  const emit = defineEmits(['handleClose']);

  // local data
  const detail = ref<TripDetail | null>(null);
  const checkbox = reactive<Checkbox>({
    id: props.detail.id || null,
    checked: !!props.detail.url || false,
  });
  const isSubmitting = ref(false);

  // handle update function
  const handleUpdate = async (): Promise<void> => {
    isSubmitting.value = true;
    const payload = { ...detail.value };
    delete payload.created_at;
    delete payload.updated_at;

    await store.updateTripDetail(payload as UpdateTripDetailInput);
    emit('handleClose');

    isSubmitting.value = false;
  };

  // handle deleting detail
  const handleRemoveDetail = async (d: TripDetail): Promise<void> => {
    await store.deleteTripDetail(d.id);
    emit('handleClose');
  };

  onMounted(() => {
    detail.value = { ...props.detail };
  });

  watchEffect(() => {
    if (!props.isOpen) {
      detail.value = null;
      isSubmitting.value = false;
    }
  });
</script>

<style lang="scss" scoped>
  .edit-details-dialog {
    .q-card {
      border-top: 5px solid $primary;
      min-width: 350px;

      .details-wrapper {
        .detail {
          flex-direction: column;

          .top {
            display: grid;
            grid-template-columns: 1fr 1fr auto auto;
            grid-column-gap: 0.5rem;
          }
        }
      }
    }
  }
</style>
