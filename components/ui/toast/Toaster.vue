<script setup lang="ts">
  import { isVNode } from 'vue';
  import { useToast } from './use-toast';
  import { Toast, ToastClose, ToastDescription, ToastIcon, ToastProvider, ToastTitle, ToastViewport } from '.';

  const { toasts } = useToast();
</script>

<template>
  <toast-provider>
    <toast
      v-for="toast in toasts"
      :key="toast.id"
      v-bind="toast">
      <div class="grid gap-1">
        <div class="flex items-center">
          <toast-icon :icon="toast.icon" />
          <div>
            <toast-title v-if="toast.title">
              {{ toast.title }}
            </toast-title>
            <template v-if="toast.description">
              <toast-description v-if="isVNode(toast.description)">
                <component :is="toast.description" />
              </toast-description>
              <toast-description v-else>
                {{ toast.description }}
              </toast-description>
            </template>
          </div>
        </div>
        <toast-close />
      </div>
      <component :is="toast.action" />
    </toast>
    <toast-viewport />
  </toast-provider>
</template>