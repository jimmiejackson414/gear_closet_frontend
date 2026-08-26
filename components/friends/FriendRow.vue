<script lang="ts" setup>
  interface Props {
    title: string;
    subtitle?: string | null;
    image?: string | null;
    initials?: string;
    mail?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    image: undefined,
    initials: undefined,
    mail: false,
    subtitle: undefined,
  });
</script>

<template>
  <div class="flex items-center gap-3 py-3 min-w-0">
    <div
      v-if="mail"
      class="flex justify-center items-center bg-muted rounded-full size-8 text-muted-foreground shrink-0">
      <icon-mail
        aria-hidden="true"
        class="size-4" />
    </div>
    <gc-avatar
      v-else
      class="shrink-0"
      :initials="initials"
      size="sm"
      :url="image" />
    <div class="flex flex-col min-w-0 flex-1">
      <typography class="font-medium truncate">
        {{ title }}
      </typography>
      <typography
        v-if="subtitle"
        class="text-muted-foreground text-sm truncate">
        {{ subtitle }}
      </typography>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <slot />
    </div>
  </div>
</template>
