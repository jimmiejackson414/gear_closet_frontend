<script lang="ts" setup>
  import { LOCKED_DEEPLINK_CTA, lockedDeepLinkMessage } from '@/utils/planLimits';

  const props = defineProps<{
    kind: 'pack' | 'trip';
  }>();

  defineEmits<{
    dismiss: [];
  }>();
</script>

<template>
  <div
    class="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 bg-amber-50 mb-6 px-4 py-3 rounded-md text-amber-800"
    data-testid="locked-deeplink-banner"
    role="status">
    <typography class="mb-0 text-sm">
      {{ lockedDeepLinkMessage(props.kind) }}
    </typography>
    <div class="flex items-center gap-2 shrink-0">
      <nuxt-link
        class="no-underline"
        :to="{ name: 'profile' }">
        <button-root
          size="sm"
          variant="outline">
          {{ LOCKED_DEEPLINK_CTA }}
        </button-root>
      </nuxt-link>
      <button-root
        size="sm"
        variant="ghost"
        @click="$emit('dismiss')">
        Dismiss
      </button-root>
    </div>
  </div>
</template>
