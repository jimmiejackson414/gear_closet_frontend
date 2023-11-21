<script lang='ts' setup>
  import NavbarAlt from '@/components/common/NavbarAlt.vue';
  import Footer from '@/components/common/Footer.vue';
</script>

<template>
  <div class="bg-grey-1">
    <div class="bg-gray-100 min-h-screen">
      <div class="p-4">
        <NavbarAlt />
        <div class="container h-[calc(100vh-9.25rem)]">
          <slot />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>
