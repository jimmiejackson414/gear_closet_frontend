<script lang='ts' setup>
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-[65%,35%]">
    <div class="flex flex-col space-y-6">
      <!-- Pack Widget -->
      <pack-widget />

      <!-- Trip Details -->
      <trip-details-widget />

      <!-- Hike Details -->
      <hike-details-widget />
    </div>

    <div class="flex flex-col space-y-6">
      <!-- Friends -->
      <trip-friends-widget />

      <!-- Todos -->
      <todos-widget />

      <!-- Shopping List -->
      <shopping-list-widget />

      <!-- Poll -->
      <poll-widget />
    </div>
  </div>
</template>
