<script lang='ts' setup>
  import GcButton from '@/components/common/GcButton.vue';

  interface Props {
    cancelButton?: boolean;
    closeable?: boolean;
    confirmButtonText?: string;
    declineButtonText?: string;
    id: string;
    title: string;
    variant?: 'primary' | 'positive' | 'danger';
  } 

  withDefaults(defineProps<Props>(), {
    cancelButton: true,
    confirmButtonText: 'Continue',
    closeable: true,
    declineButtonText: 'Cancel',
    id: 'static-modal',
    title: '',
    variant: 'primary',
  });

  const emit = defineEmits(['handleContinue', 'handleCancel']);
</script>

<template>
  <div
    :id="id"
    aria-hidden="true"
    class="backdrop-blur-sm fixed top-0 right-0 left-0 md:inset-0 h-[calc(100%-1rem)] hidden items-center justify-center max-h-full overflow-x-hidden overflow-y-auto w-full z-50"
    data-modal-backdrop="static"
    tabindex="-1">
    <div class="max-h-full max-w-2xl p-4 relative w-full">
      <!-- Modal content -->
      <div
        class="bg-white border-t-8 relative rounded-lg shadow"
        :class="[{ 
          'border-primary': variant === 'primary',
          'border-positive': variant === 'positive',
          'border-danger': variant === 'danger',
        }]">
        <!-- Modal header -->
        <div class="border-b flex justify-between items-center p-4 md:p-5 rounded-t">
          <h3 class="font-semibold text-gray-900 text-xl">
            {{ title }}
          </h3>
          <button
            v-if="closeable"
            class="bg-transparent hover:bg-gray-200 h-8 inline-flex justify-center items-center ms-auto rounded-lg text-gray-400 hover:text-gray-900 text-sm w-8"
            data-modal-hide="static-modal"
            type="button">
            <svg
              aria-hidden="true"
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 space-y-4">
          <slot name="content" />
        </div>
        <!-- Modal footer -->
        <div class="border-gray-200 border-t flex justify-end items-center p-4 md:p-5 rounded-b">
          <gc-button
            v-if="cancelButton"
            data-modal-hide="static-modal"
            type="button"
            @click="emit('handleCancel')">
            {{ declineButtonText }}
          </gc-button>
          <gc-button
            data-modal-hide="static-modal"
            type="button"
            :variant="variant"
            @click="emit('handleContinue')">
            {{ confirmButtonText }}
          </gc-button>
        </div>
      </div>
    </div>
  </div>
</template>
