<script lang='ts' setup>
  import GcNavbarAlt from '@/components/common/GcNavbarAlt.vue';
  import GcFooter from '@/components/common/GcFooter.vue';
</script>

<template>
  <div class="bg-grey-1">
    <div class="bg-gray-100 min-h-screen">
      <div class="p-4">
        <gc-navbar-alt />
        <div class="container h-[calc(100vh-9.25rem)]">
          <slot />
        </div>
      </div>
      <gc-footer />
    </div>
  </div>
</template>
