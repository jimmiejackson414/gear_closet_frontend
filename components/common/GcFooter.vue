<script lang='ts' setup>
  const copyrightYear = (): number => new Date()
    .getFullYear();
</script>

<template>
  <footer class="relative inset-x-0 bottom-0 bg-background px-8 py-4 md:fixed">
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
