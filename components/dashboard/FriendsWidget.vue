<script lang='ts' setup>
  import { UsersIcon } from 'lucide-vue-next';
  import type { Friend, Profile } from '@/types'; 

  interface Props {
    data: Friend[];
    loading: boolean;
  }

  withDefaults(defineProps<Props>(), {
    data: () => [],
    loading: false,
  });

  const tempUsers = [
    {
      id: "010af8bd-60c6-4c8a-8e0a-864c055e0a93",
      email: "jimmiejackson414@gmail.com",
      first_name: null,
      last_name: null,
      trail_name: null,
      image: null,
      role: "USER",
      subscription_level: "ANNUAL",
      measuring_system: "IMPERIAL",
      onboard_date: null,
      address_1: null,
      address_2: null,
      city: null,
      state: null,
      country: null,
      created_at: "2023-12-20 22:45:38.953507+00",
      updated_at: "2023-12-20 22:45:38.953507+00",
      location: null,
    },
    {
      id: "010af8bd-60c6-4c8a-8e0a-864c055e0a93",
      email: "jimmiejackson414@gmail.com",
      first_name: null,
      last_name: null,
      trail_name: null,
      image: null,
      role: "USER",
      subscription_level: "ANNUAL",
      measuring_system: "IMPERIAL",
      onboard_date: null,
      address_1: null,
      address_2: null,
      city: null,
      state: null,
      country: null,
      created_at: "2023-12-20 22:45:38.953507+00",
      updated_at: "2023-12-20 22:45:38.953507+00",
      location: null,
    },
    {
      id: "010af8bd-60c6-4c8a-8e0a-864c055e0a93",
      email: "jimmiejackson414@gmail.com",
      first_name: null,
      last_name: null,
      trail_name: null,
      image: null,
      role: "USER",
      subscription_level: "ANNUAL",
      measuring_system: "IMPERIAL",
      onboard_date: null,
      address_1: null,
      address_2: null,
      city: null,
      state: null,
      country: null,
      created_at: "2023-12-20 22:45:38.953507+00",
      updated_at: "2023-12-20 22:45:38.953507+00",
      location: null,
    },
    {
      id: "010af8bd-60c6-4c8a-8e0a-864c055e0a93",
      email: "jimmiejackson414@gmail.com",
      first_name: null,
      last_name: null,
      trail_name: null,
      image: null,
      role: "USER",
      subscription_level: "ANNUAL",
      measuring_system: "IMPERIAL",
      onboard_date: null,
      address_1: null,
      address_2: null,
      city: null,
      state: null,
      country: null,
      created_at: "2023-12-20 22:45:38.953507+00",
      updated_at: "2023-12-20 22:45:38.953507+00",
      location: null,
    },
  ] as Profile[];
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow-light">
    <gc-skeleton
      v-if="loading"
      avatar
      :lines="3" />
    <div v-else>
      <div class="flex justify-start items-center mb-4 py-4">
        <users-icon class="h-6 mr-6 text-primary w-6" />
        <nuxt-link
          class="duration-150 ease-in-out font-bold text-base hover:text-primary"
          :to="{ name: 'friends' }">
          Friends
        </nuxt-link>
      </div>
      <div class="-space-x-3 flex">
        <gc-avatar
          v-for="user in tempUsers"
          :key="user.id"
          border
          :profile="user" />
        <nuxt-link
          class="bg-dark-grey hover:bg-gray-600 border-2 border-white flex justify-center items-center font-medium h-12 rounded-full text-white text-xs w-12 z-10"
          :to="{ name: 'friends' }">
          +99
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
