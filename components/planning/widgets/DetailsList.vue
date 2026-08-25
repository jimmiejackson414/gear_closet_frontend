<script lang='ts' setup>
  import type { Tables } from '@/types';

  interface Props {
    canEdit?: boolean;
    details: Tables<'trip_details'>[];
  }

  withDefaults(defineProps<Props>(), {
    canEdit: false,
  });
  const emits = defineEmits<{
    (event: 'edit', detail: Tables<'trip_details'>): void;
  }>();
</script>

<template>
  <ul>
    <li
      v-for="detail in details"
      :key="detail.id"
      class="mb-0">
      <div class="flex items-start sm:items-center gap-2 sm:gap-4 group space-between">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-1 gap-1 min-w-0">
          <typography class="font-bold! text-muted-foreground">
            {{ detail.title }}
          </typography>
          <a
            v-if="detail.url"
            class="text-hyperlink"
            :href="detail.url"
            rel="noopener noreferrer"
            target="_blank">
            {{ detail.value }}
          </a>
          <typography
            v-else
            class="text-muted-foreground">
            {{ detail.value }}
          </typography>
        </div>
        <button-root
          v-if="canEdit"
          aria-label="Edit detail"
          class="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 rounded-full"
          data-testid="edit-detail"
          size="sm"
          type="button"
          variant="ghost"
          @click="emits('edit', detail)">
          <icon-pencil />
        </button-root>
      </div>
    </li>
  </ul>
</template>
