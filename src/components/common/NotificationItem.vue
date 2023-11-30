<script lang='ts' setup>
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { CheckCircleIcon } from 'lucide-vue-next';
  import type { Notification } from '@/generated/backendTypes';

  dayjs.extend(relativeTime);

  interface Props {
    notification: Notification;
  }

  const props = withDefaults(defineProps<Props>(), {
    notification: undefined,
  });

  const emit = defineEmits(['markAsRead']);

  const relativeDate = computed(() => dayjs()
    .to(props.notification.created_at as string));
</script>

<template>
  <li class="duration-200 ease-in-out flex px-4 py-3 transition hover:bg-gray-100">
    <div class="flex-shrink-0">
      <img
        alt="Jese image"
        class="h-11 rounded-full w-11"
        src="/docs/images/people/profile-picture-1.jpg">
      <div class="-mt-5 absolute bg-blue-600 border border-white flex justify-center items-center h-5 ms-6 rounded-full w-5">
        <svg
          aria-hidden="true"
          class="h-2 text-white w-2"
          fill="currentColor"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
          <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
        </svg>
      </div>
    </div>
    <div class="ps-3 w-full">
      <div class="mb-1.5 text-gray-500 text-sm">
        New message from <span class="font-semibold text-gray-900">Jese Leos</span>: "Hey, what's up? All set for the presentation?"
      </div>
      <div class="text-primary text-xs">
        {{ relativeDate }}
      </div>
    </div>
  </li>
  <!-- <li class="font-medium grid grid-cols-[auto,1fr,auto,auto] gap-x-2 group items-start px-0 py-3 text-dark-grey text-sm">
    <span class="w-[1rem]">
      <span
        class="font-medium h-[8px] inline-flex items-center rounded-full text-xs w-[8px]"
        :class="props.notification.read_on_date ? 'bg-transparent' : 'bg-danger'" />
    </span>
    <span class="flex flex-col">
      <p class="font-bold mb-1 text-sm">
        {{ props.notification.title }}
      </p>
      <p class="font-medium text-sm">
        {{ props.notification.content }}
      </p>
    </span>
    <span class="text-grey text-xs uppercase">
      {{ relativeDate(props.notification) }}
    </span>
    <button
      v-show="!props.notification.read_on_date"
      class="ml-2"
      type="button"
      @click="emit('markAsRead', notification)">
      <check-circle-icon class="duration-200 group-hover:opacity-100 h-5 opacity-0 text-dark-grey hover:text-positive transition-all w-5" />
    </button>
  </li> -->
</template>
