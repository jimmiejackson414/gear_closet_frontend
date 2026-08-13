<script lang='ts' setup>
  import type { Tables } from '@/types';

  interface Props {
    details: Tables<'trip_details'>[];
  }

  defineProps<Props>();
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
      <div class="flex items-center gap-4 group space-between">
        <div class="flex justify-between items-center flex-1">
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
          class="group-hover:opacity-100 opacity-0 rounded-full"
          size="sm"
          variant="ghost"
          @click="emits('edit', detail)">
          <icon-pencil />
        </button-root>
      </div>
    </li>
  </ul>
</template>
