<script lang='ts' setup>
  // get dynamic year
  const copyrightYear = (): number => new Date()
    .getFullYear();
</script>

<template>
  <footer class="bg-white fixed bottom-0 inset-x-0 p-8">
    <div class="flex justify-center">
      <p class="text-base">
        <span
          role="img"
          aria-label="copyright">
          &#169;
        </span>
        {{ ' ' }}Gear Closet {{ copyrightYear() }}
      </p>
    </div>
  </footer>
</template>
