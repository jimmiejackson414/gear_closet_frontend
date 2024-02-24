<script lang='ts' setup>
  import { XIcon } from 'lucide-vue-next';

  interface Props {
    closeable?: boolean;
    id?: string;
    title?: string;
    size?: 'sm' | 'md' | 'lg';
    isOpen: boolean;
  }

  withDefaults(defineProps<Props>(), {
    closeable: true,
    id: 'static-modal',
    title: '',
    size: 'md',
    isOpen: false,
  });

  const emit = defineEmits(['handleCancel']);

  const modalRef = ref(null);
  onClickOutside(modalRef, () => emit('handleCancel'));
</script>

<template>
  <slide-up-transition>
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 left-0 md:inset-0 flex justify-center items-center h-[calc(100%-1rem)] max-h-full overflow-x-hidden overflow-y-auto p-4 w-full z-50"
      tabindex="-1"
      @keydown.escape="emit('handleCancel')">
      <div class="bg-black fixed inset-0 opacity-50" />
      <div
        ref="modalRef"
        class="max-h-full relative w-full"
        :class="{
          'max-w-md': size === 'sm',
          'max-w-xl': size === 'md',
          'max-w-2xl': size === 'lg',
        }">
        <!-- modal content -->
        <div class="bg-white relative rounded-lg shadow">
          <!-- modal header -->
          <div class="border-b border-gray-200 flex justify-between items-center px-4 md:px-5 py-4 rounded-t">
            <h3 class="font-medium text-gray-900 text-xl">
              {{ title }}
            </h3>
            <button
              class="h-8 inline-flex justify-center items-center ms-auto rounded-full text-sm w-8"
              type="button"
              @click="emit('handleCancel')">
              <x-icon class="h-6 text-gray-400 hover:text-gray-900 w-6" />
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="px-4 md:px-5 py-4 space-y-4">
            <slot name="content" />
          </div>
          <!-- Modal footer -->
          <div class="border-t border-transparent flex justify-between items-center pb-2 pt-4 px-4 md:px-5 rounded-b">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </div>
  </slide-up-transition>
</template>