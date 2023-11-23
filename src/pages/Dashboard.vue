<script lang='ts' setup>
  import DashboardLayout from '@/layouts/DashboardLayout.vue';
  import GcNavbar from '@/components/common/GcNavbar.vue';
</script>

<template>
  <dashboard-layout>
    <div class="container-lg mx-auto p-6">
      <div class="flex gap-8">
        <div class="bg-gray-100 grow px-6 py-8 rounded-4xl shadow-light">
          <gc-navbar page-title="Dashboard" />
          <div class="grid grid-cols-12 gap-8 mt-8">
            <div class="col-span-12 md:col-span-8">
              <div class="bg-white px-4 py-8 rounded-4xl shadow-light">
                First widget
              </div>
            </div>
            <div class="col-span-12 md:col-span-4">
              <div class="bg-white px-4 py-8 rounded-4xl shadow-light">
                Second widget
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white px-4 py-8 rounded-4xl shadow-light">
          Side
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>
