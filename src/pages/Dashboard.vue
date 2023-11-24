<script lang='ts' setup>
  import DashboardLayout from '@/layouts/DashboardLayout.vue';
  import GcNavbar from '@/components/common/GcNavbar.vue';
  import GcSkeleton from '@/components/common/GcSkeleton.vue';

  const loading = ref(true);
</script>

<template>
  <dashboard-layout>
    <div class="container-full mx-auto px-12 py-6">
      <div class="grid grid-cols-12 gap-8">
        <div class="bg-gray-100 col-span-12 md:col-span-9 grow px-6 py-8 rounded-4xl shadow-light">
          <gc-navbar page-title="Dashboard" />
          <div class="grid grid-cols-12 gap-8 mt-8">
            <div class="col-span-12 md:col-span-8">
              <div class="bg-white px-4 py-8 rounded-4xl shadow-light">
                <gc-skeleton
                  avatar
                  :lines="3"
                  v-if="loading" />
                <p v-else>
                  First widget
                </p>
              </div>
            </div>
            <div class="col-span-12 md:col-span-4">
              <div class="bg-white px-4 py-8 rounded-4xl shadow-light">
                <gc-skeleton
                  avatar
                  :lines="3"
                  v-if="loading" />
                <p v-else>
                  Second widget
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white col-span-12 md:col-span-3 px-4 py-8 rounded-4xl shadow-light">
          <gc-skeleton
            :lines="2"
            v-if="loading" /> 
          <p v-else>
            Side
          </p>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>
