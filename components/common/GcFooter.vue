<script lang='ts' setup>
  const copyrightYear = (): number => new Date()
    .getFullYear();
</script>

<template>
  <footer class="bg-background px-8 py-4 relative bottom-0 inset-x-0 md:fixed">
    <div class="flex justify-center">
      <p class="text-base">
        <span
          aria-label="copyright"
          role="img">
          &#169;
        </span>
        {{ ' ' }}Gear Closet {{ copyrightYear() }}
      </p>
    </div>
  </footer>
</template>
