<template>
  <SlideUpTransition>
    <div
      v-if="!isEditing"
      class="slot-text"
      :style="slotStyles"
      @trigger="toggleEditing"
      @click="toggleEditing(true)"
      @keydown="toggleEditing(true)">
      <slot />
      <q-icon
        v-if="!hideEditBtn"
        flat
        round
        text-color="text"
        size="1rem"
        name="bi-pencil-fill"
        class="q-ml-md edit-btn" />
    </div>
    <q-input
      v-else
      ref="target"
      v-model="stringifiedDate"
      v-on-click-outside="() => toggleEditing(false)"
      outlined
      dense
      mask="date"
      :label="placeholder"
      :style="inputStyles"
      @keyup.escape="handleEscape"
      @keyup.enter="handleEmit"
      @keyup.tab="handleEmit">
      <template #prepend>
        <q-icon
          name="bi-calendar-check"
          class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            cover
            transition-show="scale"
            transition-hide="scale">
            <q-date
              :minimal="minimal"
              :model-value="localModel[field]"
              @update:model-value="handleSelect">
              <div class="row items-center justify-between">
                <q-btn
                  v-close-popup
                  label="Close"
                  flat
                  color="text"
                  :ripple="false" />
                <q-space />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </SlideUpTransition>
</template>

<script lang='ts' setup>
  import {
    computed, nextTick, onMounted, ref, watch,
  } from 'vue';
  import dayjs from 'dayjs';
  import { vOnClickOutside } from '@vueuse/components';
  import SlideUpTransition from '@/components/transitions/SlideUpTransition.vue';

  // define props
  interface Props {
    model: any;
    field: string;
    placeholder?: string;
    minimal?: boolean;
    hideEditBtn?: boolean;
    slotStyles?: any;
    inputStyles?: any;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    model: null,
    field: '',
    placeholder: 'Date',
    minimal: false,
    hideEditBtn: false,
    slotStyles: undefined,
    inputStyles: undefined,
  });

  // define emits
  const emit = defineEmits(['handleUpdate']);

  // define local state
  const isEditing = ref(false);
  const localModel = ref<any>(null);
  const target = ref<any>(null);

  const stringifiedDate = computed({
    get () {
      return JSON.stringify(localModel.value![props.field]);
    },
    set (newValue: any) {
      localModel.value![props.field] = dayjs(newValue)
        .toISOString();
    },
  });

  const toggleEditing = (val: boolean): void => {
    isEditing.value = val;
    if (isEditing.value) {
      nextTick(() => {
        target.value!.focus();
      });
    }
  };

  const handleEmit = (): void => {
    toggleEditing(false);

    // convert date to ISOString before emit
    localModel.value![props.field] = dayjs(localModel.value![props.field])
      .toISOString();

    emit('handleUpdate', localModel.value);
  };

  const handleSelect = (value: any): void => {
    localModel.value![props.field] = value;
    isEditing.value = false;
    handleEmit();
  };

  const handleEscape = (): void => {
    localModel.value = props.model;
    isEditing.value = false;
  };

  onMounted(() => {
    localModel.value = props.model;
  });

  watch(
    () => isEditing.value,
    (newVal) => {
      if (newVal) {
        localModel.value![props.field] = dayjs(localModel.value![props.field])
          .format('YYYY/MM/DD');
      }
    },
  );
</script>

<style lang='scss' scoped>
  .slot-text {
    align-items: center;
    cursor: pointer;
    display: flex;
    transition: 0.2s all $cubic-bezier;
    padding: 4px 6px;
    margin: 0 -6px;

    .edit-btn {
      opacity: 0;
      transition: 0.2s opacity $cubic-bezier;
    }

    &:hover {
      background: $grey-3;
      border-radius: 10px;

      .edit-btn {
        opacity: 1;
      }
    }
  }
</style>
