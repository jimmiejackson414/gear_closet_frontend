<script lang='ts' setup>
  import { UsersIcon } from 'lucide-vue-next';
  import type { Friend } from '~/types'; 

  interface Props {
    data: Friend[];
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: () => [],
    loading: false,
  });
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow-light">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="flex justify-between items-center mb-4 py-4">
        <users-icon class="h-6 mr-6 text-primary w-6" />
        <p class="font-bold text-base">
          Friends
        </p>
      </div>
      <div class="-space-x-2 flex">
        <img
          alt=""
          class="border-2 border-white h-12 rounded-full w-12"
          src="https://placehold.co/100x100">
        <img
          alt=""
          class="border-2 border-white h-12 rounded-full w-12"
          src="https://placehold.co/100x100">
        <img
          alt=""
          class="border-2 border-white h-12 rounded-full w-12"
          src="https://placehold.co/100x100">
        <img
          alt=""
          class="border-2 border-white h-12 rounded-full w-12"
          src="https://placehold.co/100x100">
        <nuxt-link
          class="bg-dark-grey hover:bg-gray-600 border-2 border-white flex justify-center items-center font-medium h-12 rounded-full text-white text-xs w-12"
          :to="{ name: 'friends' }">
          +99
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
