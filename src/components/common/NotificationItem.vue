<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { Notification } from '@/generated/types';
  import type { PropType } from 'vue';

  dayjs.extend(relativeTime);

  const props = defineProps({
    notification: { type: Object as PropType<Notification>, default: null, required: true },
    placement: { type: String as PropType<'navbar' | 'page'>, required: false, default: 'navbar' },
  });

  // const padding = computed(() => {
  //   if (props.placement === 'navbar') return 'q-my-sm';
  //   return 'q-my-md';
  // });

  const emit = defineEmits(['markAsRead', 'markAsUnread']);

  const relativeDate = ((notification: Notification): string => dayjs()
    .to(notification.created_at as string));
</script>

<template>
  <p>Notification Item</p>
  <!-- <q-item :class="['items-center', padding]">
    <q-item-section
      avatar
      style="min-width: 12px;">
      <q-badge
        rounded
        :color="props.notification.read_on_date ? 'transparent' : 'red'" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ props.notification.title }}</q-item-label>
      <q-item-label
        caption
        lines="2">
        {{ props.notification.content }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label caption>
        {{ relativeDate(props.notification as Notification) }}
      </q-item-label>
      <q-btn
        v-if="!props.notification.read_on_date"
        flat
        color="white"
        :ripple="false"
        class="justify-end"
        @click="emit('markAsRead', props.notification)">
        <q-tooltip>Mark as read</q-tooltip>
        <q-icon name="bi-check-lg" />
      </q-btn>
      <q-btn
        v-else
        flat
        color="white"
        :ripple="false"
        class="justify-end"
        @click="emit('markAsUnread', props.notification)">
        <q-tooltip>Mark as unread</q-tooltip>
        <q-icon name="bi-dash-circle" />
      </q-btn>
    </q-item-section>
  </q-item> -->
</template>
