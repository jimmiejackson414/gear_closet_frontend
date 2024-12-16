<script lang='ts' setup>
  const copyrightYear = (): number => new Date()
    .getFullYear();
</script>

<template>
  <footer class="bg-background fixed bottom-0 inset-x-0 px-8 py-4">
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
