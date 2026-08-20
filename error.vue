<script setup lang="ts">
  import * as Sentry from '@sentry/nuxt';
  import { shouldIgnoreSentryError } from '@/utils/sentryIgnore';
  import type { NuxtError } from '#app';

  const props = defineProps({
    error: {
      type: Object as () => NuxtError,
      required: true,
    },
  });

  // Nitro already captures SSR fatals. Skip the hydrated error page so those
  // do not report again from the browser. beforeSend also drops duplicates.
  if (import.meta.client && !useNuxtApp().isHydrating) {
    if (!shouldIgnoreSentryError(props.error)) {
      Sentry.captureException(props.error);
    }
  }

  const handleClear = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="bg-background flex justify-center items-center px-4 min-h-screen">
    <div class="bg-card shadow-sm px-8 py-10 rounded-3xl w-full max-w-lg text-center">
      <h1 class="font-bold text-foreground text-xl">
        Something went wrong
      </h1>
      <p class="mt-4 text-muted-foreground">
        {{ error?.statusMessage || error?.statusText || error?.message || 'Please try again.' }}
      </p>
      <button
        class="inline-flex justify-center items-center bg-primary mt-6 px-4 rounded-full h-10 font-semibold text-primary-foreground"
        type="button"
        @click="handleClear">
        Go home
      </button>
    </div>
  </div>
</template>
