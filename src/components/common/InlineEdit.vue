<template>
  <div class="inline-edit-container">
    <SlideUpTransition>
      <span
        v-if="!isEditing"
        class="slot-text"
        :style="slotStyles"
        @trigger="toggleEditing"
        @click="isEditing = true"
        @keydown="isEditing = true">
        <slot />
        <q-icon
          v-if="!hideEditBtn"
          flat
          round
          text-color="text"
          size="1rem"
          name="bi-pencil-fill"
          class="q-ml-md edit-btn" />
      </span>
      <q-input
        v-else
        v-model="model[field]"
        v-on-click-outside="() => isEditing = false"
        autofocus
        :type="type"
        outlined
        dense
        hide-bottom-space
        :input-style="inputStyles"
        @blur="handleEmit"
        @keydown.escape="handleEscape"
        @keydown.enter.prevent="handleEmit"
        @keydown.tab="handleEmit" />
    </SlideUpTransition>
  </div>
</template>

<script lang='ts' setup>
  import { onMounted, ref } from 'vue';
  import { QInputProps } from 'quasar';
  import { vOnClickOutside } from '@vueuse/components';
  import SlideUpTransition from '@/components/transitions/SlideUpTransition.vue';

  // define props
  interface Props {
    model: any;
    field: string;
    placeholder?: string;
    hideEditBtn?: boolean;
    type?: QInputProps['type'];
    slotStyles?: any;
    inputStyles?: any;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    model: null,
    placeholder: '',
    field: '',
    hideEditBtn: false,
    slotStyles: undefined,
    inputStyles: undefined,
  });

  // define emits
  const emit = defineEmits(['handleUpdate']);

  // define local state
  const isEditing = ref(false);
  const model = ref(null);
  const type = ref(props.type || 'text');

  const toggleEditing = (val: boolean): void => {
    isEditing.value = val;
  };

  const handleEmit = (): void => {
    isEditing.value = false;

    // convert quantity to Number before emit
    if (props.field === 'quantity') {
      (model.value as any)!.quantity = Number((model.value as any).quantity);
    }

    emit('handleUpdate', model.value);
  };

  const handleEscape = (): void => {
    model.value = props.model;
    isEditing.value = false;
  };

  onMounted(() => {
    model.value = props.model;
  });
</script>

<style lang='scss' scoped>
  .inline-edit-container {
    display: grid;
    grid-template-columns: auto;
    position: relative;
    height: 100%;
  }

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
